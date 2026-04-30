// src/controllers/storyController.ts (Firestore implementation)

import { Request, Response } from "express";
import { z } from "zod";
import { Timestamp } from "firebase-admin/firestore";
import {
  admin,
  db,
  storiesCollection,
  usersCollection,
} from "../config/firebase";

const createStorySchema = z.object({
  mediaUrl: z.string().url({ message: "Invalid media URL" }),
  mediaType: z.enum(["image", "video"]).optional().default("image"),
});

interface FirestoreStory {
  id: string;
  userId: string;
  mediaUrl: string;
  mediaType: "image" | "video";
  viewers: string[];
  createdAt: Timestamp;
  expiresAt: Timestamp;
}

interface FirestoreUserSummary {
  id: string;
  name?: string;
  profilePhoto1?: string;
}

const toUserSummary = (id: string, data: any): FirestoreUserSummary => ({
  id,
  name: data?.name,
  profilePhoto1: data?.profilePhoto1,
});

export const createStory = async (req: Request, res: Response) => {
  try {
    const parseResult = createStorySchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        error: "Validation failed",
        details: (parseResult.error as any).errors,
      });
    }

    const { mediaUrl, mediaType } = parseResult.data;
    const uid = req.userId;

    if (!uid) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userDoc = await usersCollection.doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const now = Timestamp.now();
    const expiresAt = Timestamp.fromMillis(
      Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    );

    const newStoryRef = storiesCollection.doc();
    const storyData: Omit<FirestoreStory, "id"> = {
      userId: uid,
      mediaUrl,
      mediaType: mediaType || "image",
      viewers: [],
      createdAt: now,
      expiresAt,
    };

    await newStoryRef.set(storyData);

    const userData = userDoc.data();
    return res.status(201).json({
      id: newStoryRef.id,
      ...storyData,
      user: toUserSummary(uid, userData),
    });
  } catch (error: any) {
    console.error("Error creating story:", error);
    return res.status(500).json({ error: "Failed to create story" });
  }
};

export const getActiveStories = async (req: Request, res: Response) => {
  try {
    const uid = req.userId;
    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const currentUserDoc = await usersCollection.doc(uid).get();
    if (!currentUserDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const now = Timestamp.now();
    const snapshot = await storiesCollection
      .where("expiresAt", ">", now)
      .orderBy("expiresAt", "asc")
      .get();

    const stories: FirestoreStory[] = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...(doc.data() as Omit<FirestoreStory, "id">) }),
    );

    // Sort by createdAt ascending (oldest first within a user's stack)
    stories.sort(
      (a, b) => a.createdAt.toMillis() - b.createdAt.toMillis(),
    );

    const userIds = Array.from(new Set(stories.map((story) => story.userId)));
    const userDocs = await Promise.all(
      userIds.map((id) => usersCollection.doc(id).get()),
    );

    const userMap = new Map<string, FirestoreUserSummary>();
    userDocs.forEach((doc) => {
      if (doc.exists) {
        userMap.set(doc.id, toUserSummary(doc.id, doc.data()));
      }
    });

    const grouped: Record<
      string,
      {
        user: FirestoreUserSummary;
        stories: FirestoreStory[];
        hasUnviewed: boolean;
      }
    > = {};

    stories.forEach((story) => {
      const user = userMap.get(story.userId);
      if (!user) return;

      if (!grouped[story.userId]) {
        grouped[story.userId] = {
          user,
          stories: [],
          hasUnviewed: false,
        };
      }

      grouped[story.userId].stories.push(story);

      if (!story.viewers.includes(uid)) {
        grouped[story.userId].hasUnviewed = true;
      }
    });

    return res.status(200).json(Object.values(grouped));
  } catch (error: any) {
    console.error("Error fetching stories:", error);
    return res.status(500).json({ error: "Failed to fetch stories" });
  }
};

export const markStoryViewed = async (req: Request, res: Response) => {
  try {
    const id = String(req.params.id);
    const uid = req.userId;

    if (!uid) return res.status(401).json({ error: "Unauthorized" });

    const userDoc = await usersCollection.doc(uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const storyRef = storiesCollection.doc(id);
    const storyDoc = await storyRef.get();
    if (!storyDoc.exists) {
      return res.status(404).json({ error: "Story not found" });
    }

    await storyRef.update({
      viewers: admin.firestore.FieldValue.arrayUnion(uid),
    });

    return res.status(200).json({ message: "Marked as viewed" });
  } catch (error: any) {
    console.error("Error marking story as viewed:", error);
    return res.status(500).json({ error: "Failed to update story" });
  }
};

// Re-export `db` for any consumer that may need direct access in this module's scope.
export { db };

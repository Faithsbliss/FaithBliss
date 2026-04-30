export type Story = {
  _id: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string;
  createdAt: string;
  isViewed: boolean;
};

export type StoryUser = {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
};

export type StoryGroup = {
  user: StoryUser;
  stories: Story[];
  hasUnviewed: boolean;
};

export type UserStoryGroup = StoryGroup;

/** Display name for story rail / viewer (StoryUser uses firstName + lastName). */
export function storyUserDisplayName(u: StoryUser): string {
  const full = [u.firstName, u.lastName].filter(Boolean).join(" ").trim();
  return full || "Member";
}

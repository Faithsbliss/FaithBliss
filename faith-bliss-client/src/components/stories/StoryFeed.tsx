import React, { useEffect, useState } from 'react';
import { getApiClient } from '@/services/api-client';
import { useAuthContext } from '@/contexts/AuthContext';
import type { StoryGroup } from '@/types/app-stories';
import { storyUserDisplayName } from '@/types/app-stories';
import StoryAvatar from './StoryAvatar';
import StoryViewer from './StoryViewer';
import StoryUploader from './StoryUploader';

const StoryFeed: React.FC = () => {
  const [storyGroups, setStoryGroups] = useState<StoryGroup[]>([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [initialGroupIndex, setInitialGroupIndex] = useState(0);
  const { accessToken, user } = useAuthContext();

  const fetchStories = async () => {
    if (!accessToken) return;
    try {
      const apiClient = getApiClient(accessToken);
      const data = await apiClient.Story.getStories();
      setStoryGroups(data);
    } catch (error) {
      console.error('Failed to fetch stories:', error);
      // Optional: showToast('Failed to load stories', 'error');
    }
  };

  useEffect(() => {
    fetchStories();
  }, [accessToken]);

  const handleStoryClick = (index: number) => {
    setInitialGroupIndex(index);
    setIsViewerOpen(true);
  };

  const handleCreateClick = () => {
    setIsUploaderOpen(true);
  };

  const currentUserId = user?.id;
  const currentUserHasStory = storyGroups.some(
    (g) => g.user._id === currentUserId
  );

  return (
    <div className="w-full bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 mb-6">
      <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
        
        {/* Create Story Button (Always first) */}
        {!currentUserHasStory && (
           <StoryAvatar 
             name="Add Story"
             isSelf={true}
             image={user?.profilePhoto1}
             onClick={handleCreateClick}
           />
        )}

        {/* Story List */}
        {storyGroups.map((group, index) => (
          <StoryAvatar
            key={group.user._id}
            name={
              group.user._id === currentUserId
                ? "My Story"
                : storyUserDisplayName(group.user)
            }
            image={group.user.avatar}
            isViewed={!group.hasUnviewed}
            isSelf={group.user._id === currentUserId}
            onClick={() => handleStoryClick(index)}
          />
        ))}
      </div>

      {/* Modals */}
      {isViewerOpen && storyGroups.length > 0 && (
        <StoryViewer
          initialGroup={
            storyGroups[initialGroupIndex] ?? storyGroups[0]
          }
          allGroups={storyGroups}
          onClose={() => {
            setIsViewerOpen(false);
            fetchStories();
          }}
        />
      )}

      {isUploaderOpen && (
        <StoryUploader
          onClose={() => setIsUploaderOpen(false)}
          onUploadSuccess={fetchStories}
        />
      )}
    </div>
  );
};

export default StoryFeed;

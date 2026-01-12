export interface SocialPost {
  id: string;
  platform: 'twitter' | 'instagram' | 'linkedin' | 'news';
  author: string;
  handle: string;
  avatarUrl: string;
  content: string;
  imageUrl?: string;
  timestamp: string;
  likes: number;
  comments: number;
  tags: string[];
}

export type InteractionType = 'relevant' | 'relevant_like' | 'irrelevant' | 'irrelevant_dislike' | 'save';

export interface FeedState {
  posts: SocialPost[];
  currentIndex: number;
  history: { postId: string; interaction: InteractionType }[];
}

export enum SwipeDirection {
  Left = 'Left',
  Right = 'Right',
  Up = 'Up',
  Down = 'Down',
  None = 'None'
}

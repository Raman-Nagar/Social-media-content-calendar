export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isSelected: boolean;
  hasPosts: boolean;
  posts: PostSummary[];
  totalPosts: number;
}

export interface PostSummary {
  category: string;
  count: number;
  color: string;
}

export interface PostMetrics {
  likes: number;
  views: number;
  comments: number;
  shares: number;
  reach: number;
  impressions: number;
}

export interface DayDetail {
  date: string;
  posts: Array<{
    id: number;
    pageName: string;
    category: string;
    postType: string;
    followerCount: number;
    profileLink: string;
    metrics: PostMetrics;
  }>;
  totalMetrics: PostMetrics;
}
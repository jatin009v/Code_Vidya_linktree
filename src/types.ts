export type Category =
  | "Programming"
  | "AI"
  | "Frontend"
  | "Backend"
  | "Cloud"
  | "DevOps"
  | "Cyber Security"
  | "Books"
  | "Courses"
  | "Communities";

export type ThemeName = "Dark" | "Purple" | "Blue" | "Emerald";

export interface Resource {
  id: string;
  title: string;
  category: Category;
  description: string;
  url: string;
  image: string;
  accent: string;
  bookmarks: number;
}

export interface Visitor {
  id: string;
  name: string;
  color: string;
  avatar: string;
  joinedAt: number;
  lastSeen: number;
  currentResource?: string;
  isTyping?: boolean;
}

export interface ChatMessage {
  id: string;
  userId: string;
  userName: string;
  avatar: string;
  color: string;
  text: string;
  createdAt: number;
}

export interface RecentOpen {
  id: string;
  userName: string;
  resourceTitle: string;
  timestamp: number;
}

export type Category =
  | "GitHub Student Resources"
  | "Google Communities"
  | "Microsoft Programs"
  | "AI Communities"
  | "Cloud Platforms"
  | "Developer Programs"
  | "Learning Platforms"
  | "Certification Programs"
  | "Startup Communities"
  | "Hosting & Startup Tools";

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

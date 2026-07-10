import { Category, Resource, ThemeName } from "./types";

export const categories: Category[] = [
  "Programming",
  "AI",
  "Frontend",
  "Backend",
  "Cloud",
  "DevOps",
  "Cyber Security",
  "Books",
  "Courses",
  "Communities"
];

export const themes: ThemeName[] = ["Dark", "Purple", "Blue", "Emerald"];

export const seedResources: Resource[] = [
  {
    id: "react-docs",
    title: "React Docs",
    category: "Frontend",
    description: "Modern React reference for components, hooks, effects, transitions, and application architecture.",
    url: "https://react.dev",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=900&q=80",
    accent: "#61dafb",
    bookmarks: 42
  },
  {
    id: "roadmap",
    title: "Roadmap.sh",
    category: "Programming",
    description: "Visual learning paths for frontend, backend, DevOps, AI, cloud, security, and system design.",
    url: "https://roadmap.sh",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    accent: "#8b5cf6",
    bookmarks: 37
  },
  {
    id: "github",
    title: "GitHub",
    category: "Communities",
    description: "Discover repositories, collaborate on open source, and keep developer workflows moving.",
    url: "https://github.com",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=900&q=80",
    accent: "#f8fafc",
    bookmarks: 64
  },
  {
    id: "vercel",
    title: "Vercel",
    category: "Cloud",
    description: "Deploy full-stack React and Next.js products with previews, edge functions, and analytics.",
    url: "https://vercel.com",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    accent: "#ffffff",
    bookmarks: 31
  },
  {
    id: "openai",
    title: "OpenAI Docs",
    category: "AI",
    description: "Build AI agents, product copilots, realtime interfaces, and multimodal developer tools.",
    url: "https://platform.openai.com/docs",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    accent: "#10b981",
    bookmarks: 58
  },
  {
    id: "tailwind",
    title: "Tailwind CSS",
    category: "Frontend",
    description: "Utility-first styling system for building precise, responsive, production-grade interfaces fast.",
    url: "https://tailwindcss.com",
    image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=900&q=80",
    accent: "#38bdf8",
    bookmarks: 46
  },
  {
    id: "aws-builders",
    title: "AWS Builders",
    category: "Backend",
    description: "Serverless, databases, queues, containers, observability, and reference architectures for scale.",
    url: "https://aws.amazon.com/builders",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    accent: "#f59e0b",
    bookmarks: 29
  },
  {
    id: "security-cheatsheet",
    title: "OWASP Cheatsheets",
    category: "Cyber Security",
    description: "Practical application security guidance for authentication, APIs, cryptography, and reviews.",
    url: "https://cheatsheetseries.owasp.org",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
    accent: "#ef4444",
    bookmarks: 24
  }
];

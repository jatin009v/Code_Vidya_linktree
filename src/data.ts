import { Category, Resource, ThemeName } from "./types";

export const categories: Category[] = [
  "GitHub Student Resources",
  "Google Communities",
  "Microsoft Programs",
  "AI Communities",
  "Cloud Platforms",
  "Developer Programs",
  "Learning Platforms",
  "Certification Programs",
  "Startup Communities",
  "Hosting & Startup Tools"
];

export const themes: ThemeName[] = ["Dark", "Purple", "Blue", "Emerald"];

export const seedResources: Resource[] = [
  // GitHub Student Resources
  {
    id: "github-pack",
    title: "GitHub Student Developer Pack",
    category: "GitHub Student Resources",
    description: "Get free access to the best developer tools in one place, including cloud credits, developer platforms, and training.",
    url: "https://education.github.com/pack",
    image: "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=900&q=80",
    accent: "#24292e",
    bookmarks: 120
  },
  {
    id: "github-copilot",
    title: "GitHub Copilot",
    category: "GitHub Student Resources",
    description: "AI-powered coding assistant that helps you write code faster, offering autocomplete suggestions and chat assistance.",
    url: "https://github.com/features/copilot",
    image: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=900&q=80",
    accent: "#f8fafc",
    bookmarks: 98
  },
  {
    id: "frontend-masters",
    title: "Frontend Masters",
    category: "GitHub Student Resources",
    description: "Deepen your knowledge of CSS, JavaScript, React, Vue, Node.js, and more with high-quality video courses.",
    url: "https://frontendmasters.com/welcome/github-student-developers/",
    image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=900&q=80",
    accent: "#e1573d",
    bookmarks: 85
  },
  {
    id: "digitalocean-student",
    title: "DigitalOcean Student Benefits",
    category: "GitHub Student Resources",
    description: "Free cloud platform credits for students to build, test, and scale application deployments.",
    url: "https://www.digitalocean.com/github-students",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80",
    accent: "#0080ff",
    bookmarks: 74
  },
  {
    id: "mongodb-student",
    title: "MongoDB for Students",
    category: "GitHub Student Resources",
    description: "Get free MongoDB Atlas credits, access to MongoDB University courses, and certification prep.",
    url: "https://www.mongodb.com/academia",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80",
    accent: "#00ed64",
    bookmarks: 68
  },

  // Google Communities
  {
    id: "gdg-kanpur",
    title: "GDG Kanpur",
    category: "Google Communities",
    description: "Connect, learn, and grow with Google Developer Groups in Kanpur through meetups, workshops, and tech talks.",
    url: "https://gdg.community.dev/gdg-kanpur/",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
    accent: "#4285f4",
    bookmarks: 45
  },
  {
    id: "google-arcade",
    title: "Google Cloud Arcade",
    category: "Google Communities",
    description: "Gamified learning platform to learn cloud skills and earn digital badges, goodies, and prizes.",
    url: "https://go.cloudskillsboost.google/arcade",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=900&q=80",
    accent: "#34a853",
    bookmarks: 92
  },

  // Microsoft Programs
  {
    id: "microsoft-learn",
    title: "Microsoft Learn",
    category: "Microsoft Programs",
    description: "Comprehensive documentation, tutorials, and structured learning paths for Microsoft products and developer roles.",
    url: "https://learn.microsoft.com/en-us/training/browse/",
    image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=900&q=80",
    accent: "#00a4ef",
    bookmarks: 56
  },
  {
    id: "microsoft-student-hub",
    title: "Microsoft Learn Student Hub",
    category: "Microsoft Programs",
    description: "Dedicated learning resources, student certifications, free Azure credits, and starter kits for student builders.",
    url: "https://learn.microsoft.com/en-in/training/student-hub/",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80",
    accent: "#f25022",
    bookmarks: 79
  },
  {
    id: "azure-student",
    title: "Azure for Students",
    category: "Microsoft Programs",
    description: "Build in the cloud for free with $100 Azure credits, plus free access to popular developer services without a credit card.",
    url: "https://azure.microsoft.com/en-us/free/students/",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=900&q=80",
    accent: "#0078d4",
    bookmarks: 83
  },

  // AI Communities
  {
    id: "huggingface",
    title: "Hugging Face",
    category: "AI Communities",
    description: "The open community hub for collaborating on machine learning models, datasets, and interactive AI applications.",
    url: "https://huggingface.co/",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
    accent: "#ffd21e",
    bookmarks: 112
  },
  {
    id: "openai",
    title: "OpenAI",
    category: "AI Communities",
    description: "Research and deployment company offering APIs, models like GPT-4o, and tools to build state-of-the-art AI applications.",
    url: "https://openai.com/",
    image: "https://images.unsplash.com/photo-1684369175833-317457c12c69?auto=format&fit=crop&w=900&q=80",
    accent: "#10b981",
    bookmarks: 95
  },
  {
    id: "anthropic",
    title: "Anthropic",
    category: "AI Communities",
    description: "AI safety and research company, creators of Claude, focused on building helpful, harmless, and honest AI systems.",
    url: "https://www.anthropic.com/",
    image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?auto=format&fit=crop&w=900&q=80",
    accent: "#f9f6f0",
    bookmarks: 78
  },
  {
    id: "nvidia-developer",
    title: "NVIDIA Developer",
    category: "AI Communities",
    description: "Access SDKs, training material, community forums, and deep learning institutes to accelerate AI, gaming, and compute applications.",
    url: "https://developer.nvidia.com/",
    image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=900&q=80",
    accent: "#76b900",
    bookmarks: 62
  },
  {
    id: "kanpur-ai-space",
    title: "Kanpur AI Space",
    category: "AI Communities",
    description: "A regional collaborative hub for artificial intelligence research, projects, events, and tech team collaboration in Kanpur.",
    url: "https://kanpurai.space/",
    image: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=900&q=80",
    accent: "#a855f7",
    bookmarks: 41
  },

  // Cloud Platforms
  {
    id: "aws",
    title: "AWS (Amazon Web Services)",
    category: "Cloud Platforms",
    description: "On-demand cloud computing platforms and APIs offering computing, storage, networking, and analytics at scale.",
    url: "https://aws.amazon.com/",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80",
    accent: "#ff9900",
    bookmarks: 88
  },
  {
    id: "gcp",
    title: "Google Cloud Platform",
    category: "Cloud Platforms",
    description: "Suite of cloud computing services running on Google's infrastructure, enabling developers to build, test, and deploy applications.",
    url: "https://cloud.google.com/",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    accent: "#34a853",
    bookmarks: 72
  },
  {
    id: "azure",
    title: "Microsoft Azure",
    category: "Cloud Platforms",
    description: "Public cloud computing platform providing software as a service, platform as a service, and infrastructure as a service.",
    url: "https://azure.microsoft.com/",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    accent: "#0089d6",
    bookmarks: 64
  },
  {
    id: "digitalocean",
    title: "DigitalOcean",
    category: "Cloud Platforms",
    description: "Simple cloud hosting, virtual machines, managed databases, and developer-friendly infrastructure solutions.",
    url: "https://www.digitalocean.com/",
    image: "https://images.unsplash.com/photo-1548345680-f5475ea5df84?auto=format&fit=crop&w=900&q=80",
    accent: "#0069ff",
    bookmarks: 70
  },
  {
    id: "vercel",
    title: "Vercel",
    category: "Cloud Platforms",
    description: "Deploy frontend applications, serverless functions, and static content globally with instant builds and edge hosting.",
    url: "https://vercel.com/",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    accent: "#ffffff",
    bookmarks: 86
  },
  {
    id: "netlify",
    title: "Netlify",
    category: "Cloud Platforms",
    description: "All-in-one platform for automating modern web projects with continuous integration, serverless functions, and CDN hosting.",
    url: "https://www.netlify.com/",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=900&q=80",
    accent: "#20c6b7",
    bookmarks: 59
  },

  // Developer Programs
  {
    id: "jetbrains-student",
    title: "JetBrains Student Pack",
    category: "Developer Programs",
    description: "Free educational licenses to premium JetBrains IDEs like IntelliJ IDEA, PyCharm, WebStorm, and ReSharper.",
    url: "https://www.jetbrains.com/community/education/#students",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=900&q=80",
    accent: "#000000",
    bookmarks: 97
  },
  {
    id: "figma-education",
    title: "Figma Education",
    category: "Developer Programs",
    description: "Free professional plan for Figma and FigJam to design prototypes, collaborate, and brainstorm user interfaces.",
    url: "https://www.figma.com/education/",
    image: "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?auto=format&fit=crop&w=900&q=80",
    accent: "#f24e1e",
    bookmarks: 81
  },
  {
    id: "canva-education",
    title: "Canva for Education",
    category: "Developer Programs",
    description: "Free graphic design tool for creating visuals, presentations, posters, and documents with premium assets.",
    url: "https://www.canva.com/education/",
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=900&q=80",
    accent: "#00c4cc",
    bookmarks: 53
  },
  {
    id: "notion-education",
    title: "Notion Education",
    category: "Developer Programs",
    description: "Free Notion Plus plan for students and educators to organize study plans, tasks, wiki docs, and collaborative projects.",
    url: "https://www.notion.so/product/notion-for-education",
    image: "https://images.unsplash.com/photo-1517842645767-c639042777db?auto=format&fit=crop&w=900&q=80",
    accent: "#e2e2e2",
    bookmarks: 77
  },
  {
    id: "autodesk-education",
    title: "Autodesk Education",
    category: "Developer Programs",
    description: "Free access to industry-grade 3D design and engineering software like AutoCAD, Fusion 360, Revit, and Maya.",
    url: "https://www.autodesk.com/education/edu-software",
    image: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=900&q=80",
    accent: "#ff0000",
    bookmarks: 48
  },

  // Learning Platforms
  {
    id: "simplilearn-skillup",
    title: "SkillUp by Simplilearn",
    category: "Learning Platforms",
    description: "Free access to foundational online courses in programming, data science, digital marketing, and cybersecurity.",
    url: "https://www.simplilearn.com/skillup-free-online-courses",
    image: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=900&q=80",
    accent: "#ff6600",
    bookmarks: 54
  },
  {
    id: "datacamp",
    title: "DataCamp",
    category: "Learning Platforms",
    description: "Interactive learning platform specializing in data science, machine learning, Python, R, SQL, and AI topics.",
    url: "https://www.datacamp.com/",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=900&q=80",
    accent: "#05192d",
    bookmarks: 75
  },

  // Certification Programs
  {
    id: "aws-skill-builder",
    title: "AWS Skill Builder",
    category: "Certification Programs",
    description: "Official digital learning center offering self-paced cloud courses, hands-on labs, and AWS certification prep.",
    url: "https://skillbuilder.aws/",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80",
    accent: "#ff9900",
    bookmarks: 66
  },
  {
    id: "cisco-netacad",
    title: "Cisco Networking Academy",
    category: "Certification Programs",
    description: "Global IT and cybersecurity education program offering free self-paced courses, career guidance, and networking labs.",
    url: "https://www.netacad.com/",
    image: "https://images.unsplash.com/photo-1562408590-e32931084e23?auto=format&fit=crop&w=900&q=80",
    accent: "#00b4d8",
    bookmarks: 61
  },
  {
    id: "oracle-academy",
    title: "Oracle Academy",
    category: "Certification Programs",
    description: "Offers resources, Java and database curriculum, cloud credits, and certification path access to prepare for tech careers.",
    url: "https://academy.oracle.com/",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=900&q=80",
    accent: "#f80000",
    bookmarks: 49
  },

  // Hosting & Startup Tools
  {
    id: "hostinger",
    title: "Hostinger",
    category: "Hosting & Startup Tools",
    description: "Affordable and fast web hosting services, domain registration, and hosting solutions for startup launches.",
    url: "https://www.hostinger.com/",
    image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=900&q=80",
    accent: "#673de6",
    bookmarks: 52
  },
  {
    id: "zoho",
    title: "Zoho",
    category: "Hosting & Startup Tools",
    description: "A comprehensive suite of business applications, customer relationship management (CRM), mail, and startup tools.",
    url: "https://www.zoho.com/",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
    accent: "#e31c23",
    bookmarks: 47
  },
  {
    id: "razorpay",
    title: "Razorpay",
    category: "Hosting & Startup Tools",
    description: "Converged payments platform facilitating online transactions, payment gateways, and startup financial suites.",
    url: "https://razorpay.com/",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=900&q=80",
    accent: "#0a2540",
    bookmarks: 58
  },
  {
    id: "freshworks",
    title: "Freshworks",
    category: "Hosting & Startup Tools",
    description: "Customer service and engagement software platforms designed to optimize CRM, helpdesk, and team workflows.",
    url: "https://www.freshworks.com/",
    image: "https://images.unsplash.com/photo-1552581230-c01374138763?auto=format&fit=crop&w=900&q=80",
    accent: "#0052cc",
    bookmarks: 41
  },
  {
    id: "appwrite",
    title: "Appwrite",
    category: "Hosting & Startup Tools",
    description: "Secure end-to-end backend server for web, mobile, and flutter developers packaged as simple JSON REST APIs.",
    url: "https://appwrite.io/",
    image: "https://images.unsplash.com/photo-1627390496608-7d6824eb049d?auto=format&fit=crop&w=900&q=80",
    accent: "#fd366e",
    bookmarks: 69
  },
  {
    id: "supabase",
    title: "Supabase",
    category: "Hosting & Startup Tools",
    description: "Open-source Firebase alternative providing database listening, authentication, instant APIs, and storage.",
    url: "https://supabase.com/",
    image: "https://images.unsplash.com/photo-1608452964553-9b4d97b2752f?auto=format&fit=crop&w=900&q=80",
    accent: "#3ecf8e",
    bookmarks: 85
  },
  {
    id: "convex",
    title: "Convex",
    category: "Hosting & Startup Tools",
    description: "The backend-as-a-service platform that stores your data and manages your backend logic in unified TypeScript.",
    url: "https://www.convex.dev/",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=900&q=80",
    accent: "#f43f5e",
    bookmarks: 53
  },
  {
    id: "clerk",
    title: "Clerk",
    category: "Hosting & Startup Tools",
    description: "Complete user authentication and management suite offering pre-built UI components and API helpers.",
    url: "https://clerk.com/",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
    accent: "#5f6368",
    bookmarks: 71
  },
  {
    id: "neon",
    title: "Neon",
    category: "Hosting & Startup Tools",
    description: "Serverless Postgres database architecture designed with storage autoscaling, branching, and quick setup.",
    url: "https://neon.tech/",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=900&q=80",
    accent: "#00e599",
    bookmarks: 60
  },
  {
    id: "railway",
    title: "Railway",
    category: "Hosting & Startup Tools",
    description: "Deploy applications, servers, databases, and cron tasks instantly with zero-configuration build packs.",
    url: "https://railway.app/",
    image: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=900&q=80",
    accent: "#ffffff",
    bookmarks: 76
  },
  {
    id: "n8n",
    title: "n8n",
    category: "Hosting & Startup Tools",
    description: "Fair-code node-based workflow automation tool to connect databases, APIs, and cloud services without coding.",
    url: "https://n8n.io/",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=900&q=80",
    accent: "#f11155",
    bookmarks: 63
  },
  {
    id: "onepassword",
    title: "1Password",
    category: "Hosting & Startup Tools",
    description: "Secure credential manager that keeps passwords, developer secrets, keys, and cards encrypted in the cloud.",
    url: "https://1password.com/",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
    accent: "#0078d4",
    bookmarks: 51
  },
  {
    id: "namecheap-student",
    title: "Namecheap Student Domain",
    category: "Hosting & Startup Tools",
    description: "Offers free one-year domain name registrations (such as .me) to students to establish their digital presence.",
    url: "https://nc.me/",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80",
    accent: "#de3721",
    bookmarks: 70
  },

  // Startup Communities
  {
    id: "devfolio",
    title: "Devfolio",
    category: "Startup Communities",
    description: "India's largest hackathon platform connecting developer communities, startup sponsors, and builders.",
    url: "https://devfolio.co/",
    image: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80",
    accent: "#3770ff",
    bookmarks: 89
  },
  {
    id: "mlh",
    title: "Major League Hacking (MLH)",
    category: "Startup Communities",
    description: "The official student hackathon league, running global hackathons and providing hardware labs, networks, and resources.",
    url: "https://mlh.io/",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=900&q=80",
    accent: "#e62627",
    bookmarks: 93
  },
  {
    id: "tie-global",
    title: "TiE Global",
    category: "Startup Communities",
    description: "A global non-profit community supporting startups through mentoring, networking, education, incubating, and funding.",
    url: "https://tie.org/",
    image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
    accent: "#004b93",
    bookmarks: 40
  },
  {
    id: "nasscom",
    title: "NASSCOM",
    category: "Startup Communities",
    description: "The premier trade association and chamber of commerce of the tech industry in India, fostering startup ecosystems.",
    url: "https://nasscom.in/",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=80",
    accent: "#006ab6",
    bookmarks: 42
  },
  {
    id: "startup-india",
    title: "Startup India",
    category: "Startup Communities",
    description: "A flagship initiative of the Government of India, intended to build a strong ecosystem for nurturing innovation and startups.",
    url: "https://www.startupindia.gov.in/",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80",
    accent: "#000000",
    bookmarks: 57
  }
];

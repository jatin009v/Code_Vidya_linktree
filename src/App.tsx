import { AnimatePresence, motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import {
  Activity,
  Bot,
  Check,
  Clock3,
  Code2,
  Command,
  Copy,
  ExternalLink,
  Layers3,
  MessageCircle,
  Search,
  Send,
  Share2,
  Sparkles,
  Users,
  Wifi,
  X
} from "lucide-react";
import { FormEvent, lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import { categories, seedResources, themes } from "./data";
import {
  createVisitorProfile,
  deleteResource,
  ensureAnonymousUser,
  firebaseEnabled,
  parseFirebaseError,
  removePresence,
  saveResource,
  seedFirebaseResources,
  sendMessage,
  subscribeMessages,
  subscribePresence,
  subscribeResources,
  updateCurrentResource,
  updateTyping,
  upsertPresence,
  registerVisit,
  subscribeTodayVisits,
  logResourceOpen,
  subscribeRecentOpens,
  deleteUserMessages,
  validateAccessCode
} from "./firebase";
import { Category, ChatMessage, Resource, ThemeName, Visitor, RecentOpen } from "./types";

gsap.registerPlugin(ScrollTrigger);

// Removed LazyEditor and emptyResource

function App() {
  const [resources, setResources] = useState<Resource[]>(seedResources);
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [visitor, setVisitor] = useState<Visitor | null>(null);
  const [theme, setTheme] = useState<ThemeName>("Dark");
  const [category, setCategory] = useState<Category | "All">("All");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatText, setChatText] = useState("");
  const [realtimeError, setRealtimeError] = useState<string | null>(null);
  const [clock, setClock] = useState(() => new Date());
  const [todayVisits, setTodayVisits] = useState(1);
  const [recentOpens, setRecentOpens] = useState<RecentOpen[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [viewPremium, setViewPremium] = useState(false);
  const [premiumResources, setPremiumResources] = useState<Resource[]>(() => {
    try {
      const stored = sessionStorage.getItem("code-vidya-premium-resources");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [showAccessModal, setShowAccessModal] = useState(false);
  const [accessCodeInput, setAccessCodeInput] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const lastTypingRef = useRef(false);
  const appRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let interval: number | undefined;
    let current: Visitor | undefined;
    const unsubscribers: Array<() => void> = [];

    const reportError = (error: any) => {
      console.error("Firebase realtime error:", error);
      const friendly = parseFirebaseError(error);
      setRealtimeError(friendly);
    };

    const setupRealtime = async () => {
      let user: { uid: string };
      try {
        user = await ensureAnonymousUser();
      } catch (authError) {
        reportError(authError);
        // Gracefully fall back to local storage UID so visitor profile works locally
        const stored = localStorage.getItem("code-vidya-local-uid") || crypto.randomUUID();
        localStorage.setItem("code-vidya-local-uid", stored);
        user = { uid: stored };
      }

      if (cancelled) return;

      current = createVisitorProfile(user.uid);
      setVisitor(current);

      try {
        await registerVisit(user.uid);
      } catch (err) {
        reportError(err);
      }

      try {
        await upsertPresence(current);
      } catch (err) {
        reportError(err);
      }
      
      if (cancelled) return;

      try {
        await seedFirebaseResources();
      } catch (err) {
        reportError(err);
      }

      if (cancelled) return;

      unsubscribers.push(
        subscribeResources(setResources, reportError),
        subscribePresence(setVisitors, reportError),
        subscribeMessages(setMessages, reportError),
        subscribeTodayVisits(setTodayVisits, reportError),
        subscribeRecentOpens(setRecentOpens, reportError)
      );

      interval = window.setInterval(() => {
        if (current) {
          upsertPresence({ ...current, lastSeen: Date.now() }).catch(reportError);
        }
      }, 15000);
    };

    setupRealtime().catch(reportError);

    const leave = () => {
      if (current) {
        removePresence(current.id).catch(() => {});
        deleteUserMessages(current.id).catch(() => {});
      }
    };
    window.addEventListener("beforeunload", leave);
    return () => {
      cancelled = true;
      window.removeEventListener("beforeunload", leave);
      unsubscribers.forEach((unsubscribe) => unsubscribe());
      if (interval) window.clearInterval(interval);
      leave();
    };
  }, []);

  useEffect(() => {
    if (!visitor || visitors.length === 0) return;
    const isPresenceLoaded = visitors.some((v) => v.id === visitor.id);
    if (!isPresenceLoaded) return;

    const onlineIds = new Set(visitors.map((v) => v.id));
    const offlineUserIdsToDelete = new Set<string>();

    messages.forEach((msg) => {
      if (msg.userId !== "system" && !onlineIds.has(msg.userId)) {
        offlineUserIdsToDelete.add(msg.userId);
      }
    });

    offlineUserIdsToDelete.forEach((offlineUserId) => {
      deleteUserMessages(offlineUserId).catch((err) => {
        console.error("Cleanup error for offline user:", offlineUserId, err);
      });
    });
  }, [messages, visitors, visitor]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (showAccessModal) {
      setValidationError(null);
    }
  }, [showAccessModal]);

  useEffect(() => {
    const timer = window.setInterval(() => setClock(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const lenis = new Lenis({ lerp: 0.08, wheelMultiplier: 0.9 });
    const raf = (time: number) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);
    return () => lenis.destroy();
  }, []);

  useEffect(() => {
    if (!appRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(".intro-mask", { yPercent: 0 }, { yPercent: -110, duration: 1.2, ease: "power4.inOut", delay: 0.2 });
      gsap.from(".hero-reveal", { y: 34, opacity: 0, duration: 1.05, stagger: 0.08, ease: "power3.out", delay: 0.55 });
      gsap.from(".panel-reveal", { y: 24, opacity: 0, duration: 0.9, stagger: 0.07, ease: "power2.out", delay: 0.75 });
      gsap.from(".resource-card", {
        y: 52,
        opacity: 0,
        rotateX: 8,
        duration: 1,
        stagger: 0.08,
        ease: "power3.out",
        delay: 0.95
      });
      gsap.to(".float-layer", {
        y: -18,
        duration: 4.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.35
      });
      gsap.to(".aurora-core", {
        backgroundPosition: "180% 50%",
        duration: 14,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });
      gsap.utils.toArray<HTMLElement>(".scroll-reveal").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 35,
          duration: 0.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 88%" }
        });
      });
    }, appRef);

    return () => ctx.revert();
  }, [category, query, resources, viewPremium, premiumResources]);

  useEffect(() => {
    const move = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      gsap.to(cursorRef.current, { x, y, duration: 0.24, ease: "power3.out" });
      gsap.to(spotlightRef.current, { x, y, duration: 0.55, ease: "power2.out" });
      gsap.to(".parallax-soft", {
        x: (x - window.innerWidth / 2) * 0.012,
        y: (y - window.innerHeight / 2) * 0.012,
        duration: 0.7,
        ease: "power2.out"
      });
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen(true);
      }
      if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme.toLowerCase();
    gsap.fromTo(
      ".theme-wash",
      { opacity: 0.85, scale: 0.94 },
      { opacity: 0, scale: 1.18, duration: 0.85, ease: "power2.out" }
    );
  }, [theme]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, chatOpen]);

  const filtered = useMemo(() => {
    return resources.filter((resource) => {
      const matchesCategory = category === "All" || resource.category === category;
      const haystack = `${resource.title} ${resource.category} ${resource.description}`.toLowerCase();
      return matchesCategory && haystack.includes(query.toLowerCase());
    });
  }, [category, query, resources]);

  const filteredPremium = useMemo(() => {
    return premiumResources.filter((resource) => {
      const haystack = `${resource.title} ${resource.category} ${resource.description}`.toLowerCase();
      return haystack.includes(query.toLowerCase());
    });
  }, [query, premiumResources]);

  const handleUnlock = async (e: FormEvent) => {
    e.preventDefault();
    if (!accessCodeInput.trim()) return;
    setUnlocking(true);
    setValidationError(null);
    try {
      const res = await validateAccessCode(accessCodeInput);
      if (res.length === 0) {
        setValidationError("This access code doesn't contain any resources.");
      } else {
        setPremiumResources(res);
        sessionStorage.setItem("code-vidya-premium-resources", JSON.stringify(res));
        setViewPremium(true);
        setShowAccessModal(false);
        setAccessCodeInput("");
      }
    } catch (err: any) {
      setValidationError(err?.message || "Invalid or expired access code.");
    } finally {
      setUnlocking(false);
    }
  };

  const onlineMessages = useMemo(() => {
    const onlineIds = new Set(visitors.map((v) => v.id));
    return messages.filter((msg) => msg.userId === "system" || onlineIds.has(msg.userId));
  }, [messages, visitors]);

  const typingVisitors = visitors.filter((entry) => entry.isTyping && entry.id !== visitor?.id);

  const openResource = async (resource: Resource) => {
    if (visitor) {
      updateCurrentResource(visitor.id, resource.title).catch(reportError);
      logResourceOpen(visitor.name, resource.title).catch(reportError);
    }
    window.open(resource.url, "_blank", "noopener,noreferrer");
  };

  const onMagnet = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = event.clientX - rect.left - rect.width / 2;
    const y = event.clientY - rect.top - rect.height / 2;
    gsap.to(target, { x: x * 0.25, y: y * 0.25, duration: 0.35, ease: "power3.out" });
  };

  const resetMagnet = (event: React.MouseEvent<HTMLElement>) => {
    gsap.to(event.currentTarget, { x: 0, y: 0, duration: 0.55, ease: "elastic.out(1, .45)" });
  };

  const copyResource = async (resource: Resource) => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(resource.url);
      } else {
        // Fallback for non-secure contexts (e.g. HTTP, custom IP addresses on network)
        const textarea = document.createElement("textarea");
        textarea.value = resource.url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setToast("Resource link copied!");
      if (visitor) updateCurrentResource(visitor.id, `Copied ${resource.title}`).catch(reportError);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const shareResource = async (resource: Resource) => {
    try {
      if (navigator.share) {
        await navigator.share({ title: resource.title, url: resource.url });
        setToast("Share successful.");
      } else {
        await copyResource(resource);
      }
    } catch (err) {
      console.error("Failed to share:", err);
      await copyResource(resource);
    }
  };

  const submitChat = async (event: FormEvent) => {
    event.preventDefault();
    if (!visitor || !chatText.trim()) return;
    try {
      await sendMessage({
        userId: visitor.id,
        userName: visitor.name,
        avatar: visitor.avatar,
        color: visitor.color,
        text: chatText.trim().slice(0, 240)
      });
      setChatText("");
      lastTypingRef.current = false;
      updateTyping(visitor.id, false).catch(reportError);
    } catch (err) {
      reportError(err);
    }
  };

  const handleImport = async (file?: File) => {
    if (!file) return;
    const text = await file.text();
    const imported = JSON.parse(text) as Resource[];
    await Promise.all(imported.map((resource) => saveResource({ ...resource, id: resource.id || crypto.randomUUID() })));
  };

  return (
    <div ref={appRef} className="app-shell min-h-screen overflow-x-hidden font-sans antialiased">
      <div className="intro-mask app-bg fixed inset-0 z-[100] grid place-items-center">
        <div className="text-sm uppercase tracking-[0.45em] text-white/60">Code Vidya Loading</div>
      </div>
      <div className="theme-wash pointer-events-none fixed inset-0 z-[60] bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,.20),transparent_42%)] opacity-0" />
      <div ref={spotlightRef} className="spotlight pointer-events-none fixed left-0 top-0 z-10 h-[34rem] w-[34rem] -translate-x-1/2 -translate-y-1/2 rounded-full" />
      <div ref={cursorRef} className="cursor-dot pointer-events-none fixed left-0 top-0 z-[70] hidden h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/40 md:block" />

      <Backdrop />

      <main className="relative z-20 mx-auto flex min-h-screen w-full max-w-[1800px] flex-col px-4 pb-16 pt-4 sm:px-6 lg:px-8">
        <TopBar
          theme={theme}
          setTheme={setTheme}
          onMagnet={onMagnet}
          resetMagnet={resetMagnet}
        />

        <section className="grid flex-1 gap-4 lg:grid-cols-[250px_minmax(0,1fr)_330px]">
          <aside className="panel-reveal glass-panel hidden h-[calc(100vh-116px)] min-h-[680px] flex-col p-4 lg:sticky lg:top-24 lg:flex">
            <Sidebar
              category={category}
              setCategory={setCategory}
              resources={resources}
              totalToday={todayVisits}
              viewPremium={viewPremium}
              setViewPremium={setViewPremium}
              premiumResources={premiumResources}
              setShowAccessModal={setShowAccessModal}
            />
          </aside>
 
           <section className="min-w-0">
             <Hero visitors={visitors} resources={viewPremium ? premiumResources : resources} query={query} setQuery={setQuery} setSearchOpen={setSearchOpen} />
 
             <div className="mb-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
               {(["All", ...categories] as Array<Category | "All">).map((item) => (
                 <button
                   key={item}
                   onClick={() => {
                     setViewPremium(false);
                     setCategory(item);
                   }}
                   className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition ${
                     !viewPremium && category === item ? "border-white/30 bg-white/18" : "border-white/10 bg-white/6 text-white/55"
                   }`}
                 >
                   {item}
                 </button>
               ))}
               <button
                 onClick={() => {
                   if (premiumResources.length > 0) {
                     setViewPremium(true);
                   } else {
                     setShowAccessModal(true);
                   }
                 }}
                 className={`shrink-0 rounded-full border px-4 py-2 text-xs font-medium transition flex items-center gap-1.5 ${
                   viewPremium ? "border-amber-500/40 bg-amber-500/18 text-amber-300" : "border-white/10 bg-white/6 text-white/55"
                 }`}
               >
                 <Sparkles size={12} className="text-amber-400" />
                 <span>Premium Vault</span>
               </button>
             </div>
 
             <div ref={cardsRef} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
               {viewPremium ? (
                 filteredPremium.map((resource, index) => (
                   <ResourceCard
                     key={resource.id}
                     resource={resource}
                     index={index}
                     onOpen={openResource}
                     onShare={shareResource}
                   />
                 ))
               ) : (
                 filtered.map((resource, index) => (
                   <ResourceCard
                     key={resource.id}
                     resource={resource}
                     index={index}
                     onOpen={openResource}
                     onShare={shareResource}
                   />
                 ))
               )}
             </div>
           </section>
 
           <aside className="panel-reveal glass-panel h-fit p-4 lg:sticky lg:top-24 lg:h-[calc(100vh-116px)] lg:min-h-[680px]">
             <ActivityPanel
               visitors={visitors}
               visitor={visitor}
               totalToday={todayVisits}
               resources={resources}
               firebaseEnabled={firebaseEnabled}
               recentOpens={recentOpens}
             />
           </aside>
        </section>

        <StatusBar theme={theme} clock={clock} resources={resources.length} visitors={visitors.length} />
      </main>

      <Chat
        open={chatOpen}
        setOpen={setChatOpen}
        messages={onlineMessages}
        visitor={visitor}
        realtimeError={realtimeError}
        text={chatText}
        setText={(value) => {
          setChatText(value);
          const isTyping = value.length > 0;
          if (visitor && isTyping !== lastTypingRef.current) {
            lastTypingRef.current = isTyping;
            updateTyping(visitor.id, isTyping).catch(reportError);
          }
        }}
        submit={submitChat}
        endRef={chatEndRef}
        typingVisitors={typingVisitors}
      />

      <AnimatePresence>
        {searchOpen && (
          <SearchPalette
            resources={filtered}
            query={query}
            setQuery={setQuery}
            close={() => setSearchOpen(false)}
            openResource={openResource}
          />
        )}
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-full border border-white/12 bg-black/50 px-4 py-2 text-xs text-white shadow-glow backdrop-blur-xl"
          >
            <Check size={14} className="text-emerald-400" />
            <span>{toast}</span>
          </motion.div>
        )}
        {showAccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="glass-panel w-full max-w-md p-6 text-center shadow-glow"
            >
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full border border-amber-500/30 bg-amber-500/10">
                <Sparkles className="text-amber-400" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-white">Unlock Premium Vault</h3>
              <p className="mt-2 text-xs text-white/55">
                Enter your unique access code to unlock your exclusive premium resources and vouchers.
              </p>
              
              <form onSubmit={handleUnlock} className="mt-6">
                <input
                  type="text"
                  required
                  value={accessCodeInput}
                  onChange={(e) => setAccessCodeInput(e.target.value)}
                  placeholder="Enter Access Code (e.g. CODE-XXXX)"
                  className="field text-center font-mono uppercase tracking-wider placeholder:normal-case placeholder:tracking-normal"
                  disabled={unlocking}
                />
                
                {validationError && (
                  <p className="mt-3 text-xs text-rose-400">{validationError}</p>
                )}
                
                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAccessModal(false);
                      setAccessCodeInput("");
                      setValidationError(null);
                    }}
                    className="magnetic-btn w-full"
                    disabled={unlocking}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="magnetic-btn primary w-full"
                    disabled={unlocking}
                  >
                    {unlocking ? "Validating..." : "Unlock"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Backdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="aurora-core absolute -left-1/4 top-[-20%] h-[42rem] w-[90rem] rounded-full blur-3xl" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.10),transparent_25%),radial-gradient(circle_at_80%_10%,rgba(16,185,129,.14),transparent_24%),radial-gradient(circle_at_70%_80%,rgba(14,165,233,.11),transparent_24%)]" />
      <div className="animated-grid absolute inset-0 opacity-50" />
      <div className="noise-layer absolute inset-0 opacity-[0.075]" />
      {Array.from({ length: 28 }).map((_, index) => (
        <span
          key={index}
          className="float-layer absolute h-1 w-1 rounded-full bg-white/50 shadow-[0_0_18px_rgba(255,255,255,.8)]"
          style={{
            left: `${(index * 37) % 100}%`,
            top: `${(index * 19) % 92}%`,
            opacity: 0.25 + (index % 5) * 0.12
          }}
        />
      ))}
    </div>
  );
}

function TopBar({
  theme,
  setTheme,
  onMagnet,
  resetMagnet
}: {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  onMagnet: (event: React.MouseEvent<HTMLElement>) => void;
  resetMagnet: (event: React.MouseEvent<HTMLElement>) => void;
}) {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <header className="hero-reveal app-chrome sticky top-0 z-40 mb-4 flex items-center justify-between border-b border-white/10 py-4 backdrop-blur-2xl">
      <div className="flex items-center gap-3">
        <div className="grid h-12 w-12 place-items-center overflow-hidden rounded-2xl border border-white/16 bg-white/10 shadow-glow">
          {logoFailed ? (
            <Code2 className="text-white" size={25} />
          ) : (
            <img 
              src="/logo.png" 
              alt="Code Vidya Logo" 
              className="h-full w-full object-cover" 
              onError={() => setLogoFailed(true)} 
            />
          )}
        </div>
        <div>
          <div className="text-xl font-semibold tracking-tight">Code Vidya</div>
          <div className="text-xs uppercase tracking-[0.34em] text-white/45">Developer OS</div>
        </div>
      </div>
      <div className="hidden items-center gap-2 md:flex">
        {themes.map((item) => (
          <button
            key={item}
            onMouseMove={onMagnet}
            onMouseLeave={resetMagnet}
            onClick={() => setTheme(item)}
            className={`rounded-full border px-3 py-2 text-xs transition ${
              theme === item ? "border-white/24 bg-white/16 text-white" : "border-white/10 bg-white/6 text-white/55"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
    </header>
  );
}

function Hero({
  visitors,
  resources,
  query,
  setQuery,
  setSearchOpen
}: {
  visitors: Visitor[];
  resources: Resource[];
  query: string;
  setQuery: (value: string) => void;
  setSearchOpen: (value: boolean) => void;
}) {
  return (
    <div className="hero-reveal parallax-soft app-card mb-5 overflow-hidden rounded-[28px] border p-5 shadow-inner-line backdrop-blur-2xl sm:p-7">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/10 px-3 py-2 text-xs text-white/70">
            <Sparkles size={14} className="text-cyan-200" />
            Firebase powered realtime resource cockpit
          </div>
          <h1 className="text-balance text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">
            Developer Resource Dashboard
          </h1>
          <p className="typing-line mt-5 min-h-7 max-w-2xl text-lg text-white/62">
            Curated links, live presence, and chat inside one cinematic command center.
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:min-w-[360px]">
          <Metric value={String(resources.length)} label="Resources" />
          <Metric value={String(visitors.length)} label="Live" />
          <Metric value="v1.0" label="Build" />
        </div>
      </div>
      <button
        onClick={() => setSearchOpen(true)}
        className="app-subtle mt-6 flex w-full items-center justify-between rounded-2xl border border-white/12 px-4 py-3 text-left text-white/50 transition hover:border-white/22 hover:bg-white/10"
      >
        <span className="flex items-center gap-3">
          <Search size={18} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onClick={(event) => event.stopPropagation()}
            placeholder="Search resources, categories, docs..."
            className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/38"
          />
        </span>
        <span className="hidden items-center gap-1 rounded-lg border border-white/10 bg-white/8 px-2 py-1 text-xs text-white/45 sm:flex">
          <Command size={12} /> K
        </span>
      </button>
    </div>
  );
}

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="app-subtle rounded-2xl border border-white/10 p-4">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs uppercase tracking-[0.2em] text-white/42">{label}</div>
    </div>
  );
}

function Sidebar({
  category,
  setCategory,
  resources,
  totalToday,
  viewPremium,
  setViewPremium,
  premiumResources,
  setShowAccessModal
}: {
  category: Category | "All";
  setCategory: (category: Category | "All") => void;
  resources: Resource[];
  totalToday: number;
  viewPremium: boolean;
  setViewPremium: (value: boolean) => void;
  premiumResources: Resource[];
  setShowAccessModal: (value: boolean) => void;
}) {
  return (
    <>
      <div className="mb-5 flex items-center justify-between">
        <div className="text-sm font-medium text-white/72">Categories</div>
        <Layers3 size={17} className="text-white/42" />
      </div>
      <div className="space-y-1">
        {(["All", ...categories] as Array<Category | "All">).map((item) => {
          const count = item === "All" ? resources.length : resources.filter((resource) => resource.category === item).length;
          return (
            <button
              key={item}
              onClick={() => {
                setViewPremium(false);
                setCategory(item);
              }}
              className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
                !viewPremium && category === item ? "bg-white/14 text-white" : "text-white/55 hover:bg-white/8 hover:text-white"
              }`}
            >
              <span>{item}</span>
              <span className="rounded-full bg-white/8 px-2 py-0.5 text-xs text-white/45">{count}</span>
            </button>
          );
        })}

        <div className="my-4 border-t border-white/10" />

        <button
          onClick={() => {
            if (premiumResources.length > 0) {
              setViewPremium(true);
            } else {
              setShowAccessModal(true);
            }
          }}
          className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm transition ${
            viewPremium ? "bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/25" : "text-white/55 hover:bg-white/8 hover:text-white"
          }`}
        >
          <span className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-400" />
            <span>Premium Vault</span>
          </span>
        </button>
      </div>
      <div className="app-subtle mt-auto rounded-2xl border border-white/10 p-4">
        <div className="flex items-center gap-2 text-sm text-white/72">
          <Activity size={16} className="text-emerald-300" /> Analytics
        </div>
        <div className="mt-4 text-3xl font-semibold">{totalToday}</div>
        <div className="text-xs uppercase tracking-[0.22em] text-white/38">Total visitors today</div>
      </div>
    </>
  );
}

function ResourceCard({
  resource,
  index,
  onOpen,
  onShare
}: {
  resource: Resource;
  index: number;
  onOpen: (resource: Resource) => void;
  onShare: (resource: Resource) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const tilt = (event: React.MouseEvent<HTMLDivElement>) => {
    const element = ref.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    gsap.to(element, {
      rotateY: ((x / rect.width) - 0.5) * 12,
      rotateX: -((y / rect.height) - 0.5) * 12,
      y: -8,
      duration: 0.35,
      ease: "power2.out"
    });
  };

  const reset = () => gsap.to(ref.current, { rotateY: 0, rotateX: 0, y: 0, duration: 0.6, ease: "elastic.out(1, .55)" });

  return (
    <article
      ref={ref}
      onMouseMove={tilt}
      onMouseLeave={reset}
      className="resource-card app-card group relative min-h-[390px] overflow-hidden rounded-[26px] border p-3 shadow-inner-line backdrop-blur-2xl"
      style={{ transformStyle: "preserve-3d", animationDelay: `${index * 80}ms` }}
    >
      <div className="animated-border" style={{ "--accent": resource.accent } as React.CSSProperties} />
      <div className="app-subtle relative h-44 overflow-hidden rounded-[20px] border border-white/10">
        <img src={resource.image} alt="" loading="lazy" className="h-full w-full object-cover opacity-82 transition duration-700 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <div className="absolute left-3 top-3 rounded-full border border-white/12 bg-black/35 px-3 py-1 text-xs text-white/78 backdrop-blur-xl">
          {resource.category}
        </div>
      </div>
      <div className="relative p-2 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">{resource.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm leading-6 text-white/56">{resource.description}</p>
          </div>
        </div>
        <div className="mt-5 flex items-center justify-between">
          <button onClick={() => onOpen(resource)} className="magnetic-btn primary">
            Open Resource <ExternalLink size={15} />
          </button>
          <div className="flex gap-2">
            <button onClick={() => onShare(resource)} className="icon-btn" aria-label="Share"><Share2 size={16} /></button>
          </div>
        </div>
      </div>
    </article>
  );
}

function ActivityPanel({
  visitors,
  visitor,
  totalToday,
  resources,
  firebaseEnabled,
  recentOpens
}: {
  visitors: Visitor[];
  visitor: Visitor | null;
  totalToday: number;
  resources: Resource[];
  firebaseEnabled: boolean;
  recentOpens: RecentOpen[];
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium text-white/75">Realtime Activity</div>
          <div className="mt-1 text-xs text-white/42">{firebaseEnabled ? "Firebase Powered" : "Local realtime preview"}</div>
        </div>
        <Wifi size={18} className="text-emerald-300" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2">
        <Metric value={String(visitors.length)} label="Active" />
        <Metric value={String(totalToday)} label="Today" />
      </div>
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-sm text-white/70"><Users size={16} /> Who's Online</div>
        <div className="space-y-2">
          {visitors.slice(0, 8).map((entry) => (
            <div key={entry.id} className="app-subtle rounded-2xl border border-white/8 p-3">
              <div className="flex items-center gap-3">
                <Avatar visitor={entry} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm text-white/82">{entry.name}{entry.id === visitor?.id ? " (you)" : ""}</div>
                  <div className="truncate text-xs text-white/40">
                    {entry.currentResource ? `Viewing ${entry.currentResource}` : "Exploring dashboard"}
                  </div>
                </div>
                <span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(52,211,153,.9)]" />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-3 flex items-center gap-2 text-sm text-white/70"><Bot size={16} /> Recently Opened</div>
        <div className="space-y-2 text-sm text-white/55">
          {recentOpens.map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-xl bg-white/[0.055] px-3 py-2">
              <span>{entry.userName}</span>
              <span className="max-w-[130px] truncate text-white/85" title={entry.resourceTitle}>{entry.resourceTitle}</span>
            </div>
          ))}
          {recentOpens.length === 0 && (
            <div className="text-xs text-white/36 py-2 text-center">No resource activity logged yet</div>
          )}
        </div>
      </div>
      <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.055] p-4">
        <div className="text-xs uppercase tracking-[0.24em] text-white/36">Presence</div>
        <div className="mt-3 text-sm text-white/68">Anonymous auth joins each visitor, writes their profile to `presence`, and removes it on exit.</div>
      </div>
    </div>
  );
}

function Avatar({ visitor }: { visitor: Visitor }) {
  return (
    <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-xs font-semibold text-white shadow-glow" style={{ background: visitor.color }}>
      {visitor.avatar}
    </div>
  );
}

function Chat({
  open,
  setOpen,
  messages,
  visitor,
  realtimeError,
  text,
  setText,
  submit,
  endRef,
  typingVisitors
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
  messages: ChatMessage[];
  visitor: Visitor | null;
  realtimeError: string | null;
  text: string;
  setText: (value: string) => void;
  submit: (event: FormEvent) => void;
  endRef: React.RefObject<HTMLDivElement | null>;
  typingVisitors: Visitor[];
}) {
  const unread = open ? 0 : Math.min(messages.length, 9);
  return (
    <>
      <button onClick={() => setOpen(!open)} className="fixed bottom-8 right-6 z-50 grid h-14 w-14 place-items-center rounded-2xl border border-white/16 bg-white/12 shadow-glow backdrop-blur-2xl">
        <MessageCircle size={22} />
        {unread > 0 && <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-rose-500 text-[10px]">{unread}</span>}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            className="app-modal fixed bottom-28 right-4 z-50 flex h-[520px] w-[min(420px,calc(100vw-2rem))] flex-col rounded-[26px] border border-white/14 p-4 shadow-glow backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <div className="text-sm font-medium">Live Chat</div>
                <div className="text-xs text-white/40">Anonymous realtime room</div>
              </div>
              <button onClick={() => setOpen(false)} className="icon-btn"><X size={16} /></button>
            </div>
            <div className="flex-1 space-y-3 overflow-y-auto py-4">
              {realtimeError && (
                <div className="mb-4 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-200">
                  <div className="font-semibold mb-1 flex items-center gap-1.5">
                    <Activity size={14} className="text-rose-400 font-bold" /> Firebase Configuration Guide
                  </div>
                  <p className="leading-relaxed text-white/80">{realtimeError}</p>
                  <div className="mt-2.5 pt-2.5 border-t border-rose-500/20 text-white/60 space-y-1.5">
                    <p className="font-semibold text-white/80">Follow these steps in your Firebase Console:</p>
                    <div className="space-y-1 pl-1">
                      <p>• <strong>Authentication</strong>: Go to Build &gt; Authentication &gt; Sign-in method, click 'Add new provider', and enable <strong>Anonymous</strong>.</p>
                      <p>• <strong>Firestore</strong>: Go to Build &gt; Firestore Database, and click <strong>Create database</strong> (use Test Mode or default options).</p>
                      <p>• <strong>Security Rules</strong>: Go to the Rules tab in Firestore and deploy the rules defined in <code>firestore.rules</code>.</p>
                    </div>
                  </div>
                </div>
              )}
              {messages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.userId === visitor?.id ? "justify-end" : ""}`}>
                  {message.userId !== visitor?.id && <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px]" style={{ background: message.color }}>{message.avatar}</div>}
                  <div className="app-card max-w-[76%] rounded-2xl border border-white/8 px-3 py-2">
                    <div className="text-[11px] text-white/38">{message.userName}</div>
                    <div className="text-sm text-white/82">{message.text}</div>
                  </div>
                </div>
              ))}
              <div ref={endRef} />
            </div>
            <div className="min-h-6 text-xs text-white/40">
              {realtimeError ? `Realtime error: ${realtimeError}` : typingVisitors.length ? `${typingVisitors.map((entry) => entry.name).join(", ")} typing...` : ""}
            </div>
            <form onSubmit={submit} className="app-subtle flex items-center gap-2 rounded-2xl border border-white/10 p-2">
              <input value={text} onChange={(event) => setText(event.target.value)} placeholder="Say thanks, ask about AI, drop an emoji..." className="min-w-0 flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-white/34" />
              <button className="icon-btn bg-white/14 disabled:cursor-not-allowed disabled:opacity-45" disabled={!visitor || !text.trim()}><Send size={16} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function SearchPalette({
  resources,
  query,
  setQuery,
  close,
  openResource
}: {
  resources: Resource[];
  query: string;
  setQuery: (value: string) => void;
  close: () => void;
  openResource: (resource: Resource) => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[80] bg-black/55 p-4 backdrop-blur-xl" onClick={close}>
      <motion.div
        initial={{ y: -24, scale: 0.98 }}
        animate={{ y: 0, scale: 1 }}
        exit={{ y: -24, scale: 0.98 }}
        className="app-modal mx-auto mt-20 max-w-2xl overflow-hidden rounded-[28px] border border-white/14 shadow-glow"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-white/10 p-4">
          <Search size={19} className="text-white/42" />
          <input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Command search..." className="flex-1 bg-transparent text-lg outline-none placeholder:text-white/32" />
          <button onClick={close} className="icon-btn"><X size={16} /></button>
        </div>
        <div className="max-h-[55vh] overflow-y-auto p-2">
          {resources.map((resource) => (
            <button
              key={resource.id}
              onClick={() => {
                openResource(resource);
                close();
              }}
              className="flex w-full items-center gap-3 rounded-2xl p-3 text-left transition hover:bg-white/8"
            >
              <img src={resource.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{resource.title}</span>
                <span className="block truncate text-xs text-white/42">{resource.description}</span>
              </span>
              <ExternalLink size={16} className="text-white/35" />
            </button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}

function StatusBar({ theme, clock, resources, visitors }: { theme: ThemeName; clock: Date; resources: number; visitors: number }) {
  return (
    <footer className="app-chrome fixed bottom-0 left-0 right-0 z-30 hidden border-t border-white/10 px-5 py-2 text-xs text-white/45 backdrop-blur-2xl md:block">
      <div className="mx-auto flex max-w-[1800px] items-center justify-between">
        <span className="flex items-center gap-2"><Check size={13} className="text-emerald-300" /> Theme: {theme}</span>
        <span className="flex items-center gap-2"><Clock3 size={13} /> {clock.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</span>
        <span>Resources: {resources}</span>
        <span>Visitors: {visitors}</span>
        <span>Version 1.0.0</span>
      </div>
    </footer>
  );
}

export default App;

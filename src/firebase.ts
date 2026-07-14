import { initializeApp, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
  type Auth,
  type User
} from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  increment,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  writeBatch,
  type Firestore
} from "firebase/firestore";
import { ChatMessage, Resource, Visitor, RecentOpen } from "./types";
import { seedResources } from "./data";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const hasFirebase = Boolean(
  config.apiKey &&
  config.authDomain &&
  config.projectId &&
  config.storageBucket &&
  config.messagingSenderId &&
  config.appId
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;

if (hasFirebase) {
  app = initializeApp(config);
  auth = getAuth(app);
  db = getFirestore(app);
}

type Listener<T> = (value: T) => void;
type ErrorListener = (error: Error) => void;

const memory = {
  resources: [...seedResources],
  visitors: [] as Visitor[],
  messages: [
    {
      id: "seed-message",
      userId: "system",
      userName: "Code Vidya",
      avatar: "CV",
      color: "#8b5cf6",
      text: "React Roadmap is awesome",
      createdAt: Date.now() - 90000
    }
  ] as ChatMessage[],
  visits: 1,
  recentOpens: [] as RecentOpen[],
  resourceListeners: new Set<Listener<Resource[]>>(),
  visitorListeners: new Set<Listener<Visitor[]>>(),
  messageListeners: new Set<Listener<ChatMessage[]>>(),
  visitsListeners: new Set<Listener<number>>(),
  recentOpensListeners: new Set<Listener<RecentOpen[]>>()
};

const emit = <T,>(set: Set<Listener<T>>, value: T) => set.forEach((fn) => fn(value));

export const firebaseEnabled = hasFirebase;

export const randomColor = () => {
  const colors = ["#8b5cf6", "#06b6d4", "#10b981", "#f43f5e", "#f59e0b", "#a3e635"];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const createVisitorProfile = (uid: string): Visitor => {
  const adjectives = ["Neon", "Cyber", "Pixel", "Quantum", "Hyper", "Alpha", "Apex", "Delta", "Crypto", "Byte", "Logic", "Syntax", "Static", "Dynamic", "Cloud", "Edge"];
  const nouns = ["Sage", "Pilot", "Dev", "Monk", "Coder", "Agent", "Wizard", "Ninja", "Hacker", "Architect", "Builder", "Scout", "Sentry", "Rider", "Seeker", "Sparks"];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const suffix = Math.floor(Math.random() * 90 + 10);
  const display = `${adj} ${noun} ${suffix}`;
  return {
    id: uid,
    name: display,
    color: randomColor(),
    avatar: `${adj[0]}${noun[0]}`.toUpperCase(),
    joinedAt: Date.now(),
    lastSeen: Date.now()
  };
}

export async function ensureAnonymousUser(): Promise<User | { uid: string }> {
  if (!auth) {
    const stored = localStorage.getItem("code-vidya-local-uid") || crypto.randomUUID();
    localStorage.setItem("code-vidya-local-uid", stored);
    return { uid: stored };
  }

  if (auth.currentUser) {
    return auth.currentUser;
  }

  return new Promise((resolve, reject) => {
    let resolved = false;
    const unsubscribe = onAuthStateChanged(
      auth!,
      async (user) => {
        if (resolved) return;
        unsubscribe();
        resolved = true;
        if (user) {
          resolve(user);
        } else {
          // No active user session, attempt anonymous sign in
          try {
            const credential = await signInAnonymously(auth!);
            resolve(credential.user);
          } catch (error) {
            reject(error);
          }
        }
      },
      (error) => {
        if (!resolved) {
          unsubscribe();
          resolved = true;
          reject(error);
        }
      }
    );
  });
}

export function parseFirebaseError(error: any): string {
  const code = error?.code || error?.message || "";
  const msg = String(error?.message || error || "");

  if (code.includes("auth/operation-not-allowed") || msg.includes("operation-not-allowed")) {
    return "Anonymous Authentication is disabled in your Firebase console. Go to Authentication -> Sign-in Method, and enable Anonymous Auth.";
  }
  if (code.includes("permission-denied") || msg.includes("permission-denied") || code.includes("PERMISSION_DENIED")) {
    return "Firestore security rules denied read/write access. Please deploy the rules from 'firestore.rules' in your Firebase console.";
  }
  if (code.includes("not-found") || msg.includes("not-found") || msg.includes("database-not-found")) {
    return "Cloud Firestore database does not exist for this project. Please create the database in your Firebase Console.";
  }
  if (code.includes("auth/invalid-api-key") || msg.includes("invalid-api-key")) {
    return "Invalid Firebase API Key. Please verify the environment variables in your '.env' file.";
  }
  if (code.includes("auth/network-request-failed") || msg.includes("network-request-failed")) {
    return "Network error connecting to Firebase. Please check your internet connection.";
  }
  return error?.message || String(error);
}

export async function seedFirebaseResources() {
  if (!db) return;
  await Promise.all(seedResources.map((resource) => setDoc(doc(db!, "resources", resource.id), resource, { merge: true })));
}

export async function validateAccessCode(_code: string): Promise<Resource[]> {
  // Premium code validation is disabled until real premium resources are available.
  throw new Error("Premium access codes have not been released yet.");
}

export function subscribeResources(callback: Listener<Resource[]>, onError?: ErrorListener) {
  if (!db) {
    callback(memory.resources);
    memory.resourceListeners.add(callback);
    return () => memory.resourceListeners.delete(callback);
  }
  return onSnapshot(
    collection(db, "resources"),
    (snapshot) => {
      const resources = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as Resource);
      callback(resources.length ? resources : seedResources);
    },
    onError
  );
}

export function subscribePresence(callback: Listener<Visitor[]>, onError?: ErrorListener) {
  if (!db) {
    callback(memory.visitors);
    memory.visitorListeners.add(callback);
    return () => memory.visitorListeners.delete(callback);
  }
  return onSnapshot(
    collection(db, "presence"),
    (snapshot) => {
      const cutoff = Date.now() - 120000;
      const visitors = snapshot.docs
        .map((entry) => ({ id: entry.id, ...entry.data() }) as Visitor)
        .filter((visitor) => visitor.lastSeen > cutoff)
        .sort((a, b) => b.joinedAt - a.joinedAt);
      callback(visitors);
    },
    onError
  );
}

export function subscribeMessages(callback: Listener<ChatMessage[]>, onError?: ErrorListener) {
  if (!db) {
    callback(memory.messages);
    memory.messageListeners.add(callback);
    return () => memory.messageListeners.delete(callback);
  }
  const messagesQuery = query(collection(db, "messages"), orderBy("createdAt", "asc"), limit(80));
  return onSnapshot(
    messagesQuery,
    (snapshot) => {
      callback(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }) as ChatMessage));
    },
    onError
  );
}

export async function upsertPresence(visitor: Visitor) {
  if (!db) {
    const next = memory.visitors.filter((entry) => entry.id !== visitor.id).concat(visitor);
    memory.visitors = next;
    emit(memory.visitorListeners, next);
    return;
  }
  await setDoc(doc(db, "presence", visitor.id), visitor, { merge: true });
}

export async function removePresence(id: string) {
  if (!db) {
    memory.visitors = memory.visitors.filter((entry) => entry.id !== id);
    emit(memory.visitorListeners, memory.visitors);
    return;
  }
  await deleteDoc(doc(db, "presence", id));
}

export async function updateCurrentResource(id: string, currentResource?: string) {
  if (!db) {
    const visitor = memory.visitors.find((entry) => entry.id === id);
    if (visitor) {
      visitor.currentResource = currentResource;
      visitor.lastSeen = Date.now();
      emit(memory.visitorListeners, [...memory.visitors]);
    }
    return;
  }
  await setDoc(doc(db, "presence", id), { currentResource, lastSeen: Date.now() }, { merge: true });
}

export async function updateTyping(id: string, isTyping: boolean) {
  if (!db) {
    const visitor = memory.visitors.find((entry) => entry.id === id);
    if (visitor) {
      visitor.isTyping = isTyping;
      emit(memory.visitorListeners, [...memory.visitors]);
    }
    return;
  }
  await setDoc(doc(db, "presence", id), { isTyping, lastSeen: Date.now() }, { merge: true });
}

export async function sendMessage(message: Omit<ChatMessage, "id" | "createdAt">) {
  if (!db) {
    const next = { ...message, id: crypto.randomUUID(), createdAt: Date.now() };
    memory.messages = [...memory.messages, next];
    emit(memory.messageListeners, memory.messages);
    return;
  }
  await addDoc(collection(db, "messages"), { ...message, createdAt: Date.now(), serverCreatedAt: serverTimestamp() });
}

export async function saveResource(resource: Resource) {
  if (!db) {
    memory.resources = memory.resources.filter((entry) => entry.id !== resource.id).concat(resource);
    emit(memory.resourceListeners, memory.resources);
    return;
  }
  await setDoc(doc(db, "resources", resource.id), resource, { merge: true });
}

export async function deleteResource(id: string) {
  if (!db) {
    memory.resources = memory.resources.filter((entry) => entry.id !== id);
    emit(memory.resourceListeners, memory.resources);
    return;
  }
  await deleteDoc(doc(db, "resources", id));
}

export async function bookmarkResource(id: string) {
  if (!db) {
    memory.resources = memory.resources.map((entry) =>
      entry.id === id ? { ...entry, bookmarks: entry.bookmarks + 1 } : entry
    );
    emit(memory.resourceListeners, memory.resources);
    return;
  }
  await updateDoc(doc(db, "resources", id), { bookmarks: increment(1) });
}

export async function registerVisit(uid: string) {
  if (!db) {
    memory.visits = Math.max(1, memory.visitors.length);
    emit(memory.visitsListeners, memory.visits);
    return;
  }
  const dateString = new Date().toISOString().split("T")[0];
  const visitId = `${uid}-${dateString}`;
  try {
    await setDoc(doc(db, "visits", visitId), {
      uid,
      date: dateString,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Failed to register visit:", error);
  }
}

export function subscribeTodayVisits(callback: Listener<number>, onError?: ErrorListener) {
  if (!db) {
    callback(memory.visits);
    memory.visitsListeners.add(callback);
    return () => memory.visitsListeners.delete(callback);
  }
  const dateString = new Date().toISOString().split("T")[0];
  const q = query(collection(db, "visits"), where("date", "==", dateString));
  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.size);
    },
    onError
  );
}

export async function logResourceOpen(userName: string, resourceTitle: string) {
  if (!db) {
    const next = { id: crypto.randomUUID(), userName, resourceTitle, timestamp: Date.now() };
    memory.recentOpens = [next, ...memory.recentOpens].slice(0, 5);
    emit(memory.recentOpensListeners, memory.recentOpens);
    return;
  }
  try {
    await addDoc(collection(db, "recent_opens"), {
      userName,
      resourceTitle,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Failed to log resource open:", error);
  }
}

export function subscribeRecentOpens(callback: Listener<RecentOpen[]>, onError?: ErrorListener) {
  if (!db) {
    callback(memory.recentOpens);
    memory.recentOpensListeners.add(callback);
    return () => memory.recentOpensListeners.delete(callback);
  }
  const q = query(collection(db, "recent_opens"), orderBy("timestamp", "desc"), limit(5));
  return onSnapshot(
    q,
    (snapshot) => {
      callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as RecentOpen));
    },
    onError
  );
}

export async function deleteUserMessages(userId: string) {
  if (!db) {
    memory.messages = memory.messages.filter((msg) => msg.userId !== userId);
    emit(memory.messageListeners, memory.messages);
    return;
  }
  try {
    const q = query(collection(db, "messages"), where("userId", "==", userId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return;
    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
  } catch (error) {
    console.error("Failed to delete user messages:", error);
  }
}


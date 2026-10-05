import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  initializeFirestore,
  connectFirestoreEmulator,
  collection,
  getDocs,
} from "firebase/firestore";

const source = process.env.NEXT_PUBLIC_DATA_SOURCE ?? "api";
const useEmulator = process.env.NEXT_PUBLIC_USE_EMULATOR === "true";

// Fonte "api": o backend Django da Semana 5
async function fromApi() {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  const r = await fetch(`${base}/api/health/`);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

// No Codespaces (navegador) o emulador fica em <nome>-8080.app.github.dev
function codespacesFirestoreHost() {
  const h = window.location.hostname;
  if (!h.endsWith(".app.github.dev")) return null;
  return h.replace(/-\d+\.app\.github\.dev$/, "-8080.app.github.dev");
}

let db = null;
function getDb() {
  if (db) return db;
  const app =
    getApps()[0] ??
    initializeApp({
      // No emulador usamos um projeto "demo-": nada toca a nuvem real.
      projectId: useEmulator
        ? "demo-melo-makers"
        : process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    });
  const csHost = useEmulator ? codespacesFirestoreHost() : null;
  if (csHost) {
    db = initializeFirestore(app, {
      host: csHost,
      ssl: true,
      experimentalForceLongPolling: true,
    });
  } else {
    db = getFirestore(app);
    if (useEmulator) connectFirestoreEmulator(db, "127.0.0.1", 8080);
  }
  return db;
}

// Fonte "firestore": devolve o MESMO formato da API: { status, items }
async function fromFirestore() {
  const snap = await getDocs(collection(getDb(), "items"));
  // Se a resposta veio do cache local, o servidor nao foi alcancado.
  if (snap.metadata.fromCache) {
    throw new Error("Firestore inacessivel: resposta veio do cache local");
  }
  const docs = snap.docs.map((d) => d.data());
  docs.sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0));
  return { status: "ok", items: docs.map((d) => d.titulo) };
}

export async function loadData() {
  try {
    return source === "firestore" ? await fromFirestore() : await fromApi();
  } catch (e) {
    console.error("Falha ao carregar dados:", e);
    throw e;
  }
}

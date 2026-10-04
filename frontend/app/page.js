"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "";
    fetch(`${base}/api/health/`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(setData)
      .catch(() => setError(true));
  }, []);

  if (error)
    return (
      <main style={{ padding: 32 }}>
        <h1>Dados indisponíveis</h1>
        <p>
          Não foi possível carregar os dados agora. Tente novamente mais tarde.
        </p>
      </main>
    );
  if (!data) return <p>Carregando...</p>;

  return (
    <main style={{ padding: 32 }}>
      <h1>Status: {data.status}</h1>
      <ul>{data.items.map((i) => <li key={i}>{i}</li>)}</ul>
    </main>
  );
}

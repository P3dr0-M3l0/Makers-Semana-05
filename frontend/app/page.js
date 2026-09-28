"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_API_URL ?? "";
    fetch(`${base}/api/health/`)
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p>Erro: {error}</p>;
  if (!data) return <p>Carregando...</p>;

  return (
    <main style={{ padding: 32 }}>
      <h1>Status: {data.status}</h1>
      <ul>{data.items.map((i) => <li key={i}>{i}</li>)}</ul>
    </main>
  );
}

"use client";
import { useEffect, useState } from "react";
import { loadData } from "./lib/dataSource";

export default function Home() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadData()
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
      <h1 style={{ color: "#4da3ff" }}>Status: {data.status} - Versão B</h1>
      <ul>{data.items.map((i) => <li key={i}>{i}</li>)}</ul>
    </main>
  );
}

import styles from "./page.module.css";
import { RevalidateButton } from "../components/RevalidateButton";

async function fetchData() {
  const result = await fetch("https://pokeapi.co/api/v2/pokemon", {
    cache: "force-cache",
    next: {
      tags: ["pokemon"],
    },
  });

  return await result.json();
}

export default async function Home() {
  const pokemons = await fetchData();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <RevalidateButton />
        <ol>
          {pokemons.results.map((pokemon) => (
            <li key={pokemon.name}>{pokemon.name}</li>
          ))}
        </ol>
      </main>
    </div>
  );
}

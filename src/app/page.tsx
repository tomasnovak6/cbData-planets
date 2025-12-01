import styles from "./page.module.css";
import PlanetsList from "@/app/planets/planetsList";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <div className={styles.intro}>
          <PlanetsList />
        </div>
      </main>
    </div>
  );
}

import styles from './styles/main.module.scss'
import Image from "next/image";
import {CardHero} from "@/app/[locale]/widgets";
export default function Home() {
  return (
      <main className={styles.main}>
          <div className={styles.backCol}/>
          <section className={styles.hero}>
              <div>
                  <h1>VERBITSKY</h1>
                  <h2>IRINA</h2>
              </div>
              <div className={styles.logo}>
                  <Image
                      src="/logo/Logo_white.webp"
                      alt="Verbitsky Irina logo"
                      width={256}
                      height={0}
                      style={{ width: '100%', height: 'auto' }}
                  />
              </div>
              <div className={styles.ImageBlock}>
                  <Image
                      src="/logo/photo.jpg"
                      alt="Verbitsky Irina portrait"
                      width={256}
                      height={0}
                      style={{ width: '100%', height: 'auto' }}
                  />
              </div>
              <div className={styles.contact}>
                  CONTACT
              </div>
          </section>
          <section className={styles.cardSection}>
              <CardHero/>
          </section>
      </main>
  );
}

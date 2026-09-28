import styles from './styles/main.module.scss'
import Image from "next/image";
import {MainCardFeature} from "@/app/[locale]/features";
interface arrayProps{
    array: string[]
}
function ArrayLetters({array}: arrayProps){
    return(
        array.map((item, index) =>
            <div key={index} style={{backgroundColor: `hsl(0, 0%, ${100 - (index * 15)}%)`, borderRadius: '1rem'}}>
                <p style={{color: "black", padding: "1rem", textAlign: "center"}}>{item}</p>
            </div>
        )
    )
}
export default function Home() {
    const lettersRight = [
        'Салютогенный',
        'Дизайн',
        'Экологичный',
        'Биофильный',
        'Современный',
        'Живой',
    ]
    const lettersLeft = [
        'Живопись',
        'Рисунок',
        'Иллюстрация',
        'Искусство',
        'Здоровье',
        'Культура',
    ]
  return (
      <main className={styles.main}>
          <section className={styles.mainLeftBox}>
              <section className={styles.leftBox}>
                  <div className={styles.logo}>
                      <Image src={'/logo/Logo_white.webp'} alt={'Logo of Irina Verbitsky'} width={977} height={338}/>
                  </div>
                  <div className={styles.photo}>
                      <Image src={'/logo/photo.jpg'} alt={'Photo of Irina Verbitsky'} width={955} height={1280}/>
                  </div>
                  <div className={styles.name}>
                      <h1>VERBITSKY</h1>
                      <h1>IRINA</h1>
                  </div>
                  <div className={styles.contact}>
                      <a href="mailto:verbitsky.vastu@gmail.com">verbitsky.vastu@gmail.com</a>
                      <a href="tel:+79771315563">+79771315563</a>
                  </div>
              </section>
              <section className={styles.infoAbout}>
                  <h1>КАКОЙ-ТО ТЕКСТ</h1>
              </section>
          </section>
          <section className={styles.mainBox}>
              <MainCardFeature/>
          </section>
      </main>
  );
}

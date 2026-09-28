import React from 'react';
import {useTranslations} from 'next-intl';
import {MainLinkCards} from "@/app/[locale]/shared/UI";
const array = [
    {
        id: 'interior',
        href: "/interior",
        src: "/logo/photo.jpg"
    },
    {
        id: 'art',
        href: "test2",
        src: "/logo/photo.jpg"
    },
    {
        id: 'about',
        href: "test2",
        src: "/logo/photo.jpg"
    }
]
import styles from './mainCardFeature.module.scss'
const MainCardFeature = () => {
    const t = useTranslations('home.cards');
    return (
        <section className={styles.cards}>
            {array.map((item, index) =>
                <MainLinkCards alt={t(item.id)} src={item.src} href={item.href} key={index}/>)}
        </section>
    );
};

export default MainCardFeature;

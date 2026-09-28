import React from 'react';
import {MainLinkCards} from "@/app/[locale]/shared/UI";
const array = [
    {
        alt: "test1",
        href: "test2",
        src: "/logo/photo.jpg"
    },
    {
        alt: "test1",
        href: "test2",
        src: "/logo/photo.jpg"
    },
    {
        alt: "test1",
        href: "test2",
        src: "/logo/photo.jpg"
    }
]
import styles from './mainCardFeature.module.scss'
const MainCardFeature = () => {
    return (
        <section className={styles.cards}>
            {array.map((item, index) =>
                <MainLinkCards alt={item.alt} src={item.src} href={item.href} key={index}/>)}
        </section>
    );
};

export default MainCardFeature;
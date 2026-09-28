import React from 'react';
import styles from './mainLinkCards.module.scss'
import Image from "next/image";
import {Link} from "@/i18n/navigation";
interface IProps {
    alt: string;
    src: string;
    href: string;
}
const MainLinkCards = ({src, alt, href}: IProps) => {
    return (
        <Link href={href} className={styles.image}>
            <Image src={src} alt={alt} fill style={{ objectFit: 'cover' }} />
        </Link>
    );
};

export default MainLinkCards;

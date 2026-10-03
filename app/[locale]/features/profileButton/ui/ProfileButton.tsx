import {useTranslations} from 'next-intl';
import styles from './ProfileButton.module.scss';

type Props = {mobile?: boolean};

// Пока профиль не готов, это отдельная неактивная кнопка без фиктивного перехода.
export function ProfileButton({mobile = false}: Props) {
  const t = useTranslations('siteHeader');

  return (
    <button className={`${styles.button} ${mobile ? styles.mobile : ''}`} type="button" disabled title={t('profileUnavailable')} aria-label={t('profileUnavailable')}>
      <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
        <circle cx="12" cy="8" r="3.5" />
        <path d="M5 21v-2a7 7 0 0 1 14 0v2" />
      </svg>
      {mobile && <span>{t('profile')}</span>}
    </button>
  );
}

import {getTranslations} from 'next-intl/server';
import {Heart} from '@/app/[locale]/shared/UI/icons/Heart';
import styles from './FavoriteProjectButton.module.scss';

type FavoriteProjectButtonProps = {
  projectId: string;
  projectName: string;
};

// Заготовка отдельной feature: после подключения аккаунта здесь появится клиентское сохранение.
// Пока кнопка отключена и не создаёт фиктивное избранное или запросы к несуществующему API.
export async function FavoriteProjectButton({projectId, projectName}: FavoriteProjectButtonProps) {
  const t = await getTranslations('favoriteProject');

  return (
    <button className={styles.button} type="button" disabled data-project-id={projectId} aria-label={t('add', {name: projectName})} title={t('unavailable')}>
      <Heart className={styles.icon} />
    </button>
  );
}

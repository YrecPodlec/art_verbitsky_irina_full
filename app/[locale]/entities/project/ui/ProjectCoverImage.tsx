import Image from 'next/image';
import {unstable_rethrow} from 'next/navigation';
import {getProjectCoverImage} from '../api/getProjectCoverImage';
import styles from './ProjectCoverImage.module.scss';

type Props = {contentKey: string; preload?: boolean};

// Статичное серверное изображение: никаких слайдов, кнопок или клиентского состояния.
// Родитель задаёт position: relative и высоту; Image fill заполняет его фон.
export async function ProjectCoverImage({contentKey, preload = false}: Props) {
  const cover = await getProjectCoverImage(contentKey).catch((error: unknown) => {
    unstable_rethrow(error);
    console.error('PROJECT_COVER_IMAGE_LOAD_FAILED');
    return null;
  });
  // Не заменяем реальную обложку сгенерированным фото при недоступной БД.
  if (!cover) return null;
  return <Image className={styles.image} src={cover.url} alt={cover.alt} fill sizes="100vw" quality={90}
    preload={preload} loading={preload ? undefined : 'lazy'} data-project-cover={contentKey}
    style={cover.position ? {objectPosition: `${cover.position.x}% ${cover.position.y}%`} : undefined} />;
}

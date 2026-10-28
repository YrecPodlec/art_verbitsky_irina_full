import type {ReactNode} from 'react';
import {getMessages, getTranslations} from 'next-intl/server';
import type {Project} from '@/app/[locale]/entities/project';
import {ProjectMediaGallery} from '@/app/[locale]/features/viewProjectMedia';
import {ActionLink} from '@/app/[locale]/shared/UI/actionLink';
import styles from './ProjectCase.module.scss';

const sections = ['request', 'before', 'layout', 'concept', 'visuals', 'documents', 'result'] as const;

// Раздел кейса — единый ритм заголовков и отступов; содержимое передаёт серверный виджет.
function CaseSection({id, index, title, label, children}: {id: string; index: number; title: string; label: string; children: ReactNode}) {
  return <section id={id} className={styles.section} aria-labelledby={`${id}-title`}>
    <p className={styles.eyebrow}>{String(index + 1).padStart(2, '0')} / {label}</p>
    <h2 id={`${id}-title`}>{title}</h2>{children}
  </section>;
}

// Подробные тексты читаем по contentKey, не из MongoDB. Без материалов показываем честную
// заглушку, а не подставляем визуализации вместо чертежей или фотографий реализации.
export async function ProjectCase({project, contentKey, locale}: {project: Project; contentKey: string; locale: string}) {
  const [t, texts, messages] = await Promise.all([getTranslations('projectCase'), getTranslations('projects'), getMessages()]);
  const body = (id: typeof sections[number]) => texts.has(`${contentKey}.details.${id}`) ? texts(`${contentKey}.details.${id}`) : t(`sections.${id}.body`);
  const materials = {
    before: [] as Project['media'], layout: [] as Project['media'],
    concept: project.media.filter((image) => image.category === 'concept'),
    visuals: project.media.filter((image) => image.category === 'visualization'),
    documents: project.media.filter((image) => image.category === 'drawing'),
    result: project.media.filter((image) => image.category === 'photo'),
  };
  const area = project.areaM2 === null ? t('pending') : t('areaValue', {value: new Intl.NumberFormat(locale).format(project.areaM2)});
  return <>
    <dl className={styles.facts}>
      <div><dt>{t('facts.category')}</dt><dd>{project.spaceType}</dd></div>
      <div><dt>{t('facts.location')}</dt><dd>{project.country} / {project.city}</dd></div>
      <div><dt>{t('facts.area')}</dt><dd>{area}</dd></div>
      <div><dt>{t('facts.year')}</dt><dd>{project.year ?? t('pending')}</dd></div>
    </dl>
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <nav aria-label={t('navigation')} className={styles.navigation}>
          <p>{t('contents')}</p>
          <ol>{sections.map((id, index) => <li key={id}><a href={`#${id}`}><span>{String(index + 1).padStart(2, '0')}</span>{t(`sections.${id}.title`)}</a></li>)}</ol>
          <ActionLink href="/interior#contacts">{t('discuss')}</ActionLink>
        </nav>
      </aside>
      <div className={styles.story}>
        {sections.map((id, index) => <CaseSection key={id} id={id} index={index} title={t(`sections.${id}.title`)} label={t('sectionLabel')}>
          {id === 'request' ? <>
            <p className={styles.lead}>{project.description || body(id)}</p>
            <p>{project.story || t('storyPlaceholder')}</p>
          </> : <>
            <p>{body(id)}</p>
            {materials[id].length > 0 ? <ProjectMediaGallery images={materials[id]} copy={messages.projectCase.viewer} title={t(`sections.${id}.title`)} layout={id === 'visuals' ? 'masonry' : 'grid'} />
              : <div className={`${styles.materialPlaceholder} ${id === 'layout' || id === 'documents' ? styles.blueprint : ''}`}>
                <span aria-hidden="true">{id === 'layout' || id === 'documents' ? '⌑' : '◇'}</span>
                <strong>{t(`sections.${id}.empty`)}</strong><p>{t('materialsPending')}</p>
              </div>}
          </>}
        </CaseSection>)}
        <ActionLink href="/gallery" variant="outline">{t('back')}</ActionLink>
      </div>
    </div>
  </>;
}

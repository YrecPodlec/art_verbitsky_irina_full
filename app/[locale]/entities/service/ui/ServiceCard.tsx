import type {ReactNode} from 'react';
import type {ServicePackage, ServiceVariant, ServiceCardLabels} from '../model/services';
import styles from './ServiceCard.module.scss';

type ServiceCardProps = {
  service: ServicePackage;
  variant: ServiceVariant;
  labels: ServiceCardLabels;
  index: number;
  controls: ReactNode;
  action: ReactNode;
};

// Только представление услуги. Выбор варианта и связь с формой принадлежат feature.
export function ServiceCard({service, variant, labels, index, controls, action}: ServiceCardProps) {
  return (
    <article className={`${styles.card} ${service.id === 'premium' ? styles.premium : ''}`}>
      <div className={styles.top}><span>{String(index).padStart(2, '0')}</span><span>{service.tag}</span></div>
      <h3 className={styles.title}>{service.name}</h3>
      <p className={styles.intro}>{service.intro}</p>
      <div className={styles.controls}>{controls}</div>
      <ul className={styles.items}>{variant.items.map((item) => <li key={item}>{item}</li>)}</ul>
      <p className={styles.difference} aria-live="polite">{variant.difference}</p>
      <div className={styles.price}><strong>{labels.price}</strong><span>{labels.unit}</span></div>
      <div className={styles.action}>{action}</div>
      <p className={styles.remote}>{labels.remote}</p>
    </article>
  );
}

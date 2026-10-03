'use client';

import {useState} from 'react';
import {ServiceCard, type ServicePackage, type ServiceCardLabels} from '@/app/[locale]/entities/service';
import {ServiceChoiceLink} from './ServiceChoiceLink';
import styles from './ServicePackageChoice.module.scss';

type Props = {service: ServicePackage; index: number; labels: ServiceCardLabels & {choose: string; variantGroup: string}};

// Локальное состояние относится только к переключателю; вся разметка карточки живёт в entity.
export function ServicePackageChoice({service, index, labels}: Props) {
  const [selected, setSelected] = useState(0);
  const variant = service.variants[selected];
  return <ServiceCard service={service} variant={variant} index={index} labels={labels}
    controls={<div className={styles.variants} role="group" aria-label={`${labels.variantGroup}: ${service.name}`}>
      {service.variants.map((item, position) => <button key={item.id} type="button" aria-pressed={selected === position} onClick={() => setSelected(position)}>{item.label}</button>)}
    </div>}
    action={<ServiceChoiceLink service={variant.id} variant="outline">{labels.choose}</ServiceChoiceLink>}
  />;
}

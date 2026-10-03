'use client';

import {ActionLink, type ActionLinkProps} from '@/app/[locale]/shared/UI/actionLink';
import type {ServiceId} from '@/app/[locale]/entities/service';
import {useInquiry} from '../model/InquiryProvider';

type Props = Omit<ActionLinkProps, 'href' | 'onClick'> & {service: ServiceId};

// Якорь прокручивает к форме, а React-контекст переносит выбранную услугу без изменения URL-параметров.
export function ServiceChoiceLink({service, ...props}: Props) {
  const {selectService} = useInquiry();
  return <ActionLink {...props} href="#contacts" onClick={() => selectService(service)} />;
}

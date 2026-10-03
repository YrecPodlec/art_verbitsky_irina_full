'use client';

import {createContext, useContext, useState, type ReactNode} from 'react';
import type {ServiceId} from '@/app/[locale]/entities/service';

type InquiryContextValue = {
  service: ServiceId;
  preview: boolean;
  selectService: (service: ServiceId) => void;
  setPreview: (preview: boolean) => void;
};
const InquiryContext = createContext<InquiryContextValue | null>(null);

// Провайдер связывает выбор тарифа и форму только в пределах страницы interior.
// Серверные виджеты передаются через children и не становятся клиентскими из-за этой обёртки.
export function InquiryProvider({children}: {children: ReactNode}) {
  const [service, setService] = useState<ServiceId>('undecided');
  const [preview, setPreview] = useState(false);

  function selectService(value: ServiceId) {
    setService(value);
    setPreview(false);
  }

  return <InquiryContext.Provider value={{service, preview, selectService, setPreview}}>{children}</InquiryContext.Provider>;
}

export function useInquiry() {
  const context = useContext(InquiryContext);
  if (!context) throw new Error('Project inquiry components require InquiryProvider');
  return context;
}

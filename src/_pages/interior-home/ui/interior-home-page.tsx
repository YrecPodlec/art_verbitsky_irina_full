import {
  InteriorShell,
  HeroSection,
  ProjectsSection,
  ServicesSection,
  ProcessSection,
  AboutSection,
  ShowroomSection,
  ContactSection,
} from '@/src/widgets/interior-home';

// FSD-страница задаёт порядок готовых блоков; Next.js-маршрут лишь подключает её.
export function InteriorHomePage() {
  return (
    <InteriorShell>
      <HeroSection />
      <ProjectsSection />
      <ServicesSection />
      <ProcessSection />
      <AboutSection />
      <ShowroomSection />
      <ContactSection />
    </InteriorShell>
  );
}

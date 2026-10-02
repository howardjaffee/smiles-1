import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileStickyCTA } from "@/components/layout/mobile-sticky-cta";
import { getClinicSettings } from "@/lib/data/clinic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getClinicSettings();

  return (
    <>
      <Header />
      <main id="main-content" className="pb-16 lg:pb-0">
        {children}
      </main>
      <Footer settings={settings} />
      <MobileStickyCTA settings={settings} />
    </>
  );
}

import SiteHeader from "@/components/site-header"
import { HeroSection } from "@/components/hero-section"
import { ActionCards } from "@/components/action-cards"
import { LatestReports } from "@/components/latest-reports"
import { PrivacyBanner } from "@/components/privacy-banner"
import SiteFooter from "@/components/site-footer"

export default function Page() {
  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <SiteHeader />
      <main>
        <HeroSection />
        <ActionCards />
        <LatestReports />
        <PrivacyBanner />
      </main>
      <SiteFooter />
    </div>
  )
}
import { EventsNavbar } from "@/components/events/events-navbar"
import { EventsFooter } from "@/components/events/events-footer"
import { WhatsAppButton } from "@/components/events/whatsapp-button"
import { StickyCTA } from "@/components/events/sticky-cta"
import { ExitIntentPopup } from "@/components/events/exit-intent-popup"
import { CartProvider } from "@/contexts/cart-context"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CartProvider>
      <div className="min-h-screen flex flex-col light">
        <EventsNavbar />
        <main className="flex-1">{children}</main>
        <EventsFooter />
        <WhatsAppButton />
        <StickyCTA />
        <ExitIntentPopup />
        <Toaster />
      </div>
    </CartProvider>
  )
}

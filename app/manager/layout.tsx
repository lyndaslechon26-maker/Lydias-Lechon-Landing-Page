import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { StaffShell, type NavSection } from "@/components/staff-shell"

const NAV: NavSection[] = [
  {
    label: "OVERVIEW",
    items: [
      { href: "/manager", label: "Dashboard", icon: "LayoutDashboard" },
      { href: "/manager/activity", label: "Activity Log", icon: "FileText" },
    ]
  },
  {
    label: "OPERATIONS",
    items: [
      { href: "/manager/bookings", label: "Event Bookings", icon: "Calendar" },
      { href: "/manager/orders", label: "Online Orders", icon: "ShoppingCart" },
      { href: "/manager/customers", label: "Customers", icon: "Users" },
    ]
  },
  {
    label: "CONTENT MANAGEMENT",
    items: [
      { href: "/manager/menu", label: "Menu Items", icon: "UtensilsCrossed" },
      { href: "/manager/menu-packages", label: "Menu Packages", icon: "ChefHat" },
      { href: "/manager/venues", label: "Event Venues", icon: "MapPin" },
      { href: "/manager/packages", label: "Event Packages", icon: "Package" },
      { href: "/manager/gallery", label: "Gallery", icon: "Image" },
    ]
  },
  {
    label: "ENGAGEMENT",
    items: [
      { href: "/manager/reviews", label: "Reviews", icon: "Star" },
    ]
  },
  {
    label: "SYSTEM",
    items: [
      { href: "/manager/settings", label: "Settings", icon: "Settings" },
    ]
  }
]

export default async function ManagerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect("/events/login")
  }

  // Check if user has landing_page_manager or admin role
  const { data: userData } = await supabase
    .from("profiles")
    .select("role, full_name")
    .eq("id", user.id)
    .single()

  if (!userData || !['admin', 'landing_page_manager'].includes(userData.role)) {
    redirect("/unauthorized")
  }

  // Get restaurant settings (optional - for logo)
  const { data: settings } = await supabase
    .from("landing_page_settings")
    .select("*")
    .single()

  return (
    <StaffShell
      userName={userData.full_name}
      userRole={userData.role}
      items={NAV}
      title="Manager Console"
      restaurantName="Lydia's Lechon"
      restaurantTagline="Landing Page Management"
      restaurantLogo={settings?.logo_url ?? undefined}
    >
      {children}
    </StaffShell>
  )
}

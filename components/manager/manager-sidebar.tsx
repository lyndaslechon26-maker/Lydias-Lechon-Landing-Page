'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  Calendar, 
  ShoppingCart, 
  Users, 
  Image, 
  Package, 
  UtensilsCrossed, 
  MapPin, 
  Settings, 
  Star, 
  FileText 
} from 'lucide-react'

const routes = [
  { href: '/manager', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/manager/bookings', label: 'Bookings', icon: Calendar },
  { href: '/manager/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/manager/customers', label: 'Customers', icon: Users },
  { href: '/manager/menu', label: 'Menu', icon: UtensilsCrossed },
  { href: '/manager/venues', label: 'Venues', icon: MapPin },
  { href: '/manager/packages', label: 'Packages', icon: Package },
  { href: '/manager/gallery', label: 'Gallery', icon: Image },
  { href: '/manager/reviews', label: 'Reviews', icon: Star },
  { href: '/manager/activity', label: 'Activity', icon: FileText },
  { href: '/manager/settings', label: 'Settings', icon: Settings },
]

export function ManagerSidebar({ userRole, userName }: { userRole?: string; userName?: string | null }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r bg-background">
      <div className="p-6">
        <h2 className="text-lg font-semibold">Lydia's Lechon</h2>
        <p className="text-sm text-muted-foreground">Manager Dashboard</p>
      </div>
      
      <nav className="flex-1 space-y-1 px-3">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
              pathname === route.href
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            )}
          >
            <route.icon className="size-4" />
            {route.label}
          </Link>
        ))}
      </nav>
    </div>
  )
}

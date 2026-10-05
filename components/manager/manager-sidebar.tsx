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
  FileText,
  ChefHat,
  Sparkles
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const routes = [
  { 
    section: 'Overview',
    items: [
      { href: '/manager', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/manager/activity', label: 'Activity Log', icon: FileText },
    ]
  },
  {
    section: 'Operations',
    items: [
      { href: '/manager/bookings', label: 'Event Bookings', icon: Calendar, badge: 'new' },
      { href: '/manager/orders', label: 'Online Orders', icon: ShoppingCart },
      { href: '/manager/customers', label: 'Customers', icon: Users },
    ]
  },
  {
    section: 'Content Management',
    items: [
      { href: '/manager/menu', label: 'Menu Items', icon: UtensilsCrossed },
      { href: '/manager/venues', label: 'Venues', icon: MapPin },
      { href: '/manager/packages', label: 'Event Packages', icon: Package },
      { href: '/manager/gallery', label: 'Gallery', icon: Image },
    ]
  },
  {
    section: 'Engagement',
    items: [
      { href: '/manager/reviews', label: 'Reviews', icon: Star },
    ]
  },
  {
    section: 'System',
    items: [
      { href: '/manager/settings', label: 'Settings', icon: Settings },
    ]
  }
]

export function ManagerSidebar({ userRole, userName }: { userRole?: string; userName?: string | null }) {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-72 flex-col border-r bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100">
      {/* Logo & Brand */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center justify-center size-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-500/20">
            <ChefHat className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Lydia's Lechon</h2>
            <p className="text-xs text-amber-400 flex items-center gap-1">
              <Sparkles className="size-3" />
              Management Portal
            </p>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
        {routes.map((section, idx) => (
          <div key={idx}>
            <h3 className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {section.section}
            </h3>
            <div className="space-y-1">
              {section.items.map((route) => {
                const isActive = pathname === route.href
                return (
                  <Link
                    key={route.href}
                    href={route.href}
                    className={cn(
                      'group flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/20'
                        : 'text-slate-300 hover:bg-slate-800/50 hover:text-white'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <route.icon className={cn(
                        "size-5 transition-transform group-hover:scale-110",
                        isActive ? "text-white" : "text-slate-400 group-hover:text-amber-400"
                      )} />
                      <span>{route.label}</span>
                    </div>
                    {route.badge && !isActive && (
                      <Badge variant="secondary" className="bg-amber-500/20 text-amber-400 text-[10px] px-1.5 py-0">
                        {route.badge}
                      </Badge>
                    )}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Logged in as</p>
          <p className="text-sm font-medium text-white truncate">{userName || 'Manager'}</p>
          <p className="text-xs text-amber-400 mt-1">{userRole === 'admin' ? 'Administrator' : 'Landing Page Manager'}</p>
        </div>
      </div>
    </div>
  )
}

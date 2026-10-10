'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  LogOut, 
  Bell, 
  Search, 
  Settings,
  User,
  HelpCircle,
  Moon,
  Sun
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function ManagerHeader({ userName }: { userName?: string | null }) {
  const router = useRouter()
  
  const handleLogout = async () => {
    // TODO: Implement logout
    router.push('/events/login')
  }

  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'MG'

  return (
    <header className="sticky top-0 z-30 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm">
      <div className="flex h-16 items-center justify-between px-6 gap-4">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search orders, bookings, customers..."
              className="pl-10 bg-slate-50 border-slate-200 focus-visible:ring-amber-500"
            />
          </div>
        </div>
        
        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative hover:bg-slate-100">
            <Bell className="size-5" />
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 size-5 flex items-center justify-center p-0 text-[10px]"
            >
              3
            </Badge>
          </Button>

          {/* Help */}
          <Button variant="ghost" size="icon" className="hover:bg-slate-100">
            <HelpCircle className="size-5" />
          </Button>

          {/* Theme Toggle */}
          <Button variant="ghost" size="icon" className="hover:bg-slate-100">
            <Sun className="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Divider */}
          <div className="h-8 w-px bg-slate-200" />

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger className="gap-3 hover:bg-slate-100 px-2 bg-transparent border-none rounded-md inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
              <Avatar className="size-9 ring-2 ring-amber-500/20">
                <AvatarFallback className="bg-gradient-to-br from-amber-500 to-orange-600 text-white font-semibold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold">{userName || 'Manager'}</p>
                <p className="text-xs text-muted-foreground">Landing Page Manager</p>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div>
                  <p className="font-medium">{userName || 'Manager'}</p>
                  <p className="text-xs text-muted-foreground font-normal">Landing Page Manager</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push('/manager/settings')}>
                <User className="size-4 mr-2" />
                Profile Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push('/manager/settings')}>
                <Settings className="size-4 mr-2" />
                Account Settings
              </DropdownMenuItem>
              <DropdownMenuItem>
                <HelpCircle className="size-4 mr-2" />
                Help & Support
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600 focus:bg-red-50">
                <LogOut className="size-4 mr-2" />
                Log Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

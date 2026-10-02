'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'

export function ManagerHeader({ userName }: { userName?: string | null }) {
  const router = useRouter()
  
  const handleLogout = async () => {
    // TODO: Implement logout
    router.push('/events/login')
  }

  const initials = userName
    ? userName.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'M'

  return (
    <header className="border-b bg-background">
      <div className="flex h-16 items-center justify-between px-6">
        <div>
          <h1 className="text-lg font-semibold">Manager Dashboard</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Avatar>
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          
          <div className="hidden sm:block">
            <p className="text-sm font-medium">{userName || 'Manager'}</p>
            <p className="text-xs text-muted-foreground">Landing Page Manager</p>
          </div>
          
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <h1 className="text-9xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            404
          </h1>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900 mb-4">
          Page not found
        </h2>
        
        <p className="text-slate-600 mb-8">
          Sorry, we couldn't find the page you're looking for. It may have been moved or doesn't exist.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/events">
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 w-full sm:w-auto">
              <Home className="size-4 mr-2" />
              Go to homepage
            </Button>
          </Link>
          
          <Link href="/events/menu">
            <Button variant="outline" className="w-full sm:w-auto">
              <Search className="size-4 mr-2" />
              Browse menu
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200">
          <p className="text-sm text-slate-500">
            Need help? <Link href="/events/contact" className="text-amber-600 hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

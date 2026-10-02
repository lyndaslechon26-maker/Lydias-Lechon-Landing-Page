import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-amber-100 p-6">
            <ShieldAlert className="size-12 text-amber-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Access Denied
        </h1>
        
        <p className="text-slate-600 mb-8">
          You don't have permission to access this page. This area is restricted to authorized personnel only.
        </p>
        
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg mb-8">
          <p className="text-sm text-amber-800">
            If you believe you should have access, please contact your administrator.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/events">
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 w-full sm:w-auto">
              <Home className="size-4 mr-2" />
              Go to homepage
            </Button>
          </Link>
          
          <Button
            variant="outline"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto"
          >
            <ArrowLeft className="size-4 mr-2" />
            Go back
          </Button>
        </div>
      </div>
    </div>
  )
}

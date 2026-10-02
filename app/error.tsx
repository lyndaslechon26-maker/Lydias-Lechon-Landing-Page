'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6 flex justify-center">
          <div className="rounded-full bg-red-100 p-6">
            <AlertCircle className="size-12 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          Something went wrong
        </h1>
        
        <p className="text-slate-600 mb-8">
          We encountered an error while loading this page. This has been logged and we'll look into it.
        </p>
        
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-left">
            <p className="text-sm font-mono text-red-800 break-all">
              {error.message}
            </p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            className="bg-gradient-to-r from-amber-600 to-orange-600"
          >
            Try again
          </Button>
          
          <Button
            variant="outline"
            onClick={() => window.location.href = '/events'}
          >
            Go to homepage
          </Button>
        </div>
      </div>
    </div>
  )
}

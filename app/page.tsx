import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect root to /events (main landing page)
  redirect('/events')
}

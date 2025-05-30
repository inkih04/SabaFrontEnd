// app/page.js
import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirigir automáticamente a issueList
  redirect('/issueList')
}
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LoadingSpinner } from "@/components/loading-spinner"

export default function HomePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    if (!isMounted) return

    const timer = setTimeout(() => {
      router.push("/home")
    }, 3000)

    return () => clearTimeout(timer)
  }, [isMounted, router])

  if (!isMounted || isLoading) {
    return <LoadingSpinner onComplete={() => setIsLoading(false)} />
  }

  return null
}

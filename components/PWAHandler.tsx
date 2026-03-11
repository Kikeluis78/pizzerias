'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"

export default function PWAHandler() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  const [showFallback, setShowFallback] = useState(false)

  useEffect(() => {
    // Verificar si ya está instalada como PWA
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true)
      return
    }

    // Escuchar evento de instalación
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setIsInstallable(true)
      setShowFallback(false)
      console.log('beforeinstallprompt event fired')
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    // Escuchar cambios en el modo de visualización
    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches)
      if (e.matches) {
        setIsInstallable(false)
      }
    }

    mediaQuery.addEventListener('change', handleDisplayModeChange)

    // Mostrar fallback después de 2 segundos si no se dispara beforeinstallprompt
    const fallbackTimer = setTimeout(() => {
      if (!deferredPrompt) {
        setShowFallback(true)
        console.log('Showing PWA fallback button')
      }
    }, 2000)

    return () => {
      clearTimeout(fallbackTimer)
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      mediaQuery.removeEventListener('change', handleDisplayModeChange)
    }
  }, [deferredPrompt])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      // Fallback para navegadores que no soportan beforeinstallprompt
      if (navigator.share) {
        navigator.share({
          title: 'Richard Pizza',
          text: 'Instala nuestra app para una mejor experiencia',
          url: window.location.href,
        })
      } else {
        alert('Para instalar esta app:\n1. En Chrome: Menú (⋮) > Instalar app\n2. En Safari: Compartir > Añadir a pantalla de inicio')
      }
      return
    }

    try {
      deferredPrompt.prompt()
      const { outcome } = await deferredPrompt.userChoice
      
      if (outcome === 'accepted') {
        console.log('Usuario aceptó instalar la PWA')
        setIsInstallable(false)
      } else {
        console.log('Usuario rechazó instalar la PWA')
      }
    } catch (error) {
      console.error('Error durante la instalación:', error)
    }
    
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setIsInstallable(false)
    setShowFallback(false)
    setDeferredPrompt(null)
  }

  // No mostrar si ya está instalada
  if (isStandalone) return null

  // Detectar iOS para mostrar instrucciones diferentes
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

  // Mostrar si es instalable DIRECTAMENTE o en fallback
  const shouldShow = isInstallable || showFallback

  if (!shouldShow) return null

  if (isIOS || isSafari) {
    return (
      <div className="fixed top-24 right-4 z-[999] animate-in slide-in-from-top-8">
        <div className="bg-white rounded-lg shadow-2xl p-5 max-w-xs border-2 border-primary">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-lg text-gray-900">📱 Instalar App</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-6 w-6 text-gray-600 hover:bg-gray-100"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-gray-700 mb-3 font-medium">
            Para instalar esta app en tu iPhone/iPad:
          </p>
          <ol className="text-sm space-y-2 mb-4 text-gray-700 bg-gray-50 p-3 rounded">
            <li className="font-medium">1. Toca el botón Compartir</li>
            <li className="font-medium">2. Desplázate hacia abajo</li>
            <li className="font-medium">3. Toca "Añadir a pantalla de inicio"</li>
          </ol>
          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={handleDismiss} className="text-gray-700 border-gray-300 hover:bg-gray-100">
              Entendido
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Para Android/Chrome
  return (
    <div className="fixed top-24 right-4 z-[999] animate-in slide-in-from-top-8">
      <div className="bg-white rounded-lg shadow-2xl p-5 max-w-xs border-l-4 border-l-primary">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 flex-1">
            <div className="p-3 bg-primary rounded-lg">
              <Download className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-gray-900">Instalar App</h3>
              <p className="text-sm text-gray-600">Acceso rápido a tu app</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-6 w-6 text-gray-600 hover:bg-gray-100"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleInstallClick} className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold rounded-md">
            Instalar ahora
          </Button>
          <Button variant="outline" onClick={handleDismiss} className="border-gray-300 text-gray-700 hover:bg-gray-50">
            Más tarde
          </Button>
        </div>
      </div>
    </div>
  )
}
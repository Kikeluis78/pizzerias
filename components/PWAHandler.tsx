'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"

export default function PWAHandler() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isInstallable, setIsInstallable] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

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

    // El service worker lo registra next-pwa automáticamente

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
      mediaQuery.removeEventListener('change', handleDisplayModeChange)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

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
    setDeferredPrompt(null)
  }

  // No mostrar si ya está instalada o en iOS (manejo diferente)
  if (isStandalone || !isInstallable) return null

  // Detectar iOS para mostrar instrucciones diferentes
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)

  if (isIOS || isSafari) {
    return (
      <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-8">
        <div className="bg-background border rounded-lg shadow-lg p-4 max-w-xs">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold">Instalar App</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDismiss}
              className="h-6 w-6"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Para instalar esta app en tu iPhone/iPad:
          </p>
          <ol className="text-sm space-y-1 mb-3">
            <li>1. Toca el botón Compartir</li>
            <li>2. Desplázate hacia abajo</li>
            <li>3. Toca &quot;Añadir a pantalla de inicio&quot;</li>
          </ol>
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleDismiss}>
              Entendido
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Para Android/Chrome
  return (
    <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-8">
      <div className="bg-background border rounded-lg shadow-lg p-4 max-w-xs">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Download className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold">Instalar App</h3>
              <p className="text-sm text-muted-foreground">Acceso rápido desde tu pantalla principal</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleInstallClick} className="flex-1">
            Instalar ahora
          </Button>
          <Button variant="outline" onClick={handleDismiss}>
            Más tarde
          </Button>
        </div>
      </div>
    </div>
  )
}
"use client"

import { useMemo } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, ArrowRight, Sparkles } from "lucide-react"
import * as VisuallyHidden from "@radix-ui/react-visually-hidden"
import { paquetes } from "@/config/menu.config"

interface PromoMesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PromoMesModal({ isOpen, onClose }: PromoMesModalProps) {
  const router = useRouter()
  const promoPackage = useMemo(() => paquetes.find((p) => p.id === "pkg-promo-mes") || null, [])

  const handleGoToPaquetes = () => {
    router.push("/paquetes")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md border-0 bg-gradient-to-br from-orange-50 to-red-50 shadow-2xl">
        <VisuallyHidden.Root>
          <DialogTitle>Promo del Mes</DialogTitle>
        </VisuallyHidden.Root>
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {promoPackage ? (
          <div className="space-y-6 pt-2">
            {/* Header con icono */}
            <div className="text-center space-y-2">
              <div className="flex justify-center">
                <div className="bg-gradient-to-br from-orange-500 to-red-500 p-3 rounded-full">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                ¡Promo del Mes!
              </h2>
              <p className="text-sm text-muted-foreground">
                Aprovecha nuestros mejores descuentos
              </p>
            </div>

            {/* Contenido promo */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-orange-100">
              <div className="space-y-3">
                <p className="text-sm font-semibold text-orange-600 uppercase tracking-wide">
                  Paquete especial
                </p>
                <div>
                  <p className="text-xl font-bold text-foreground">{promoPackage.name}</p>
                  <p className="text-sm text-muted-foreground mt-1">{promoPackage.description}</p>
                </div>
                <div className="pt-3 border-t border-gray-100">
                  <p className="text-xs text-muted-foreground mb-1">Desde</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                    ${promoPackage.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="h-12 rounded-xl font-semibold border-gray-300 hover:bg-gray-50"
              >
                Cerrar
              </Button>
              <Button
                onClick={handleGoToPaquetes}
                className="h-12 rounded-xl font-semibold bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white shadow-lg flex items-center justify-center gap-2"
              >
                Ver Paquetes
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 text-center py-4">
            <p className="text-muted-foreground">
              No hay promo disponible en este momento
            </p>
            <Button className="w-full" onClick={handleGoToPaquetes}>
              Ver Paquetes
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

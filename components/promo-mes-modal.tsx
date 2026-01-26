"use client"

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { paquetes } from "@/config/menu.config"

interface PromoMesModalProps {
  isOpen: boolean
  onClose: () => void
}

export function PromoMesModal({ isOpen, onClose }: PromoMesModalProps) {
  const router = useRouter()
  const [code, setCode] = useState("")

  const promoPackage = useMemo(() => paquetes.find((p) => p.id === "pkg-promo-mes") || null, [])

  useEffect(() => {
    if (!isOpen) setCode("")
  }, [isOpen])

  const handleHideToday = () => {
    const today = new Date().toISOString().slice(0, 10)
    localStorage.setItem("promoMesHiddenDate", today)
    onClose()
  }

  const handleGoToPaquetes = () => {
    router.push("/paquetes")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">Promo del Mes</DialogTitle>
          <DialogDescription className="text-center">
            Descuentos especiales por temporada.
          </DialogDescription>
        </DialogHeader>

        {promoPackage ? (
          <div className="space-y-4">
            <div className="rounded-lg border bg-card p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Paquete destacado</p>
                  <p className="text-lg font-bold">{promoPackage.name}</p>
                  <p className="text-sm text-muted-foreground">{promoPackage.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Desde</p>
                  <p className="text-2xl font-bold text-primary">${promoPackage.price}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium">Ir a Paquetes</p>
              <div className="flex gap-2">
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Escribe OK y presiona Ir"
                />
                <Button onClick={handleGoToPaquetes} disabled={code.trim().toLowerCase() !== "ok"}>
                  Ir
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Tip: escribe <span className="font-semibold">OK</span> para habilitar el botón.
              </p>
            </div>

            <Button variant="outline" className="w-full" onClick={onClose}>
              Cerrar
            </Button>
            <Button variant="ghost" className="w-full" onClick={handleHideToday}>
              No mostrar hoy
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              No se encontró la Promo del Mes en la lista de paquetes.
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

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useCart } from "@/hooks/use-cart"
import Swal from "sweetalert2"
import { Pizza, ShoppingBag, ArrowRight } from "lucide-react"

interface PizzaSelectionModalProps {
  isOpen: boolean
  onClose: () => void
  pizza: {
    name: string
    ingredients: string
    prices: { CH: number; MED: number; GDE: number; FAM: number }
  } | null
  allEspecialidades: string[]
}

type SelectionMode = "select-mode" | "single-config"

export function PizzaSelectionModal({ isOpen, onClose, pizza, allEspecialidades }: PizzaSelectionModalProps) {
  const router = useRouter()
  const { addItem } = useCart()
  const [mode, setMode] = useState<SelectionMode>("select-mode")
  const [size, setSize] = useState<"CH" | "MED" | "GDE" | "FAM">("MED")
  const [notes, setNotes] = useState("")
  const [pizzaType, setPizzaType] = useState<"completa" | "mitad-y-mitad">("completa")
  const [secondHalf, setSecondHalf] = useState("")

  if (!pizza) return null

  const isPizzaSize = (val: string): val is "CH" | "MED" | "GDE" | "FAM" =>
    val === "CH" || val === "MED" || val === "GDE" || val === "FAM"

  const isPizzaType = (val: string): val is "completa" | "mitad-y-mitad" => val === "completa" || val === "mitad-y-mitad"

  const getSinglePrice = () => {
    const base = pizza.prices[size]
    const discounted = base * 0.6
    const halfExtra = pizzaType === "mitad-y-mitad" ? 25 : 0
    return Math.round((discounted + halfExtra) * 100) / 100
  }

  const handleModeSelect = (selectedMode: "2x1" | "single") => {
    if (selectedMode === "2x1") {
      // Guardar selección y navegar a 2x1
      localStorage.setItem("selectedPizza", pizza.name)
      onClose()
      router.push("/2x1")
    } else {
      setMode("single-config")
    }
  }

  const handleAddToCart = () => {
    if (pizzaType === "mitad-y-mitad" && !secondHalf) {
      Swal.fire({
        icon: "warning",
        title: "Faltan datos",
        text: "Por favor selecciona la segunda mitad de tu pizza",
      })
      return
    }

    const price = getSinglePrice()
    
    // Generar ID determinista para permitir agrupación
    const cleanId = (str: string) => str.replace(/[^a-z0-9]/gi, '-').toLowerCase()
    const notesPart = notes.trim() ? `-${cleanId(notes)}` : ''
    const secondHalfPart = pizzaType === "mitad-y-mitad" ? `-${cleanId(secondHalf)}` : ''
    const itemId = `single-${cleanId(pizza.name)}-${size}${secondHalfPart}${notesPart}`
    
    let description = `Tamaño: ${size}\n`
    description += `Precio base: $${pizza.prices[size]}\n`
    description += `Descuento pizza sola (-40%): $${(pizza.prices[size] * 0.4).toFixed(2)}\n`
    
    if (pizzaType === "mitad-y-mitad") {
      description += `Mitad y Mitad:\n`
      description += `• ${pizza.name}\n`
      description += `• ${secondHalf}\n`
      description += `Extra mitad y mitad: +$25\n`
    } else {
      description += `Ingredientes: ${pizza.ingredients}\n`
    }

    if (notes.trim()) {
      description += `Notas: ${notes}`
    }

    addItem({
      id: itemId,
      name: `Pizza ${pizzaType === "mitad-y-mitad" ? `${pizza.name} / ${secondHalf}` : pizza.name}`,
      description,
      price,
      image: "/delicious-pizza.png",
    })

    handleClose()

    Swal.fire({
      icon: "success",
      title: "Agregada al carrito",
      text: `Pizza agregada correctamente`,
      timer: 1500,
      showConfirmButton: false,
    })
  }

  const handleClose = () => {
    setMode("select-mode")
    setNotes("")
    setSize("MED")
    setPizzaType("completa")
    setSecondHalf("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center text-primary">
            {mode === "select-mode" ? "¿Cómo la prefieres?" : `Configura tu ${pizza.name}`}
          </DialogTitle>
          <DialogDescription className="text-center">
            {mode === "select-mode" 
              ? `Has seleccionado la especialidad ${pizza.name}`
              : pizza.ingredients
            }
          </DialogDescription>
        </DialogHeader>

        {mode === "select-mode" ? (
          <div className="grid grid-cols-1 gap-4 py-4">
            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-primary hover:bg-primary/5 transition-all group"
              onClick={() => handleModeSelect("2x1")}
            >
              <div className="flex items-center gap-2">
                <Pizza className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-lg font-bold">Promoción 2x1</span>
              </div>
              <span className="text-sm text-muted-foreground">Llévate dos pizzas al precio de una</span>
            </Button>

            <Button
              variant="outline"
              className="h-24 flex flex-col items-center justify-center gap-2 border-2 hover:border-primary hover:bg-primary/5 transition-all group"
              onClick={() => handleModeSelect("single")}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-lg font-bold">Solo una Pizza</span>
              </div>
              <span className="text-sm text-muted-foreground">Elige tamaño y ordena individualmente</span>
            </Button>
          </div>
        ) : (
          <div className="space-y-6 py-2">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Selecciona el tamaño</Label>
              <RadioGroup
                value={size}
                onValueChange={(val) => {
                  if (isPizzaSize(val)) setSize(val)
                }}
                className="grid grid-cols-2 gap-2"
              >
                {Object.entries(pizza.prices).map(([key, price]) => (
                  <div key={key}>
                    <RadioGroupItem value={key} id={key} className="peer sr-only" />
                    <Label
                      htmlFor={key}
                      className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:text-primary cursor-pointer transition-all"
                    >
                      <span className="font-bold">{key}</span>
                      <span className="text-sm">${price}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-3 pt-2 border-t">
               <Label className="text-base font-semibold text-primary">Tipo de Pizza</Label>
               <RadioGroup
                 value={pizzaType}
                 onValueChange={(v) => {
                   if (isPizzaType(v)) setPizzaType(v)
                 }}
                 className="flex gap-4"
               >
                 <div className="flex items-center space-x-2">
                   <RadioGroupItem value="completa" id="type-completa" />
                   <Label htmlFor="type-completa">Completa</Label>
                 </div>
                 <div className="flex items-center space-x-2">
                   <RadioGroupItem value="mitad-y-mitad" id="type-mitad" />
                   <Label htmlFor="type-mitad">Mitad y Mitad</Label>
                 </div>
               </RadioGroup>

               {pizzaType === "mitad-y-mitad" && (
                 <div className="animate-fadeIn mt-2 p-3 bg-muted/50 rounded-lg">
                   <p className="text-xs text-primary font-semibold mb-2">Mitad y mitad tiene un costo extra de $25</p>
                   <p className="text-sm text-muted-foreground mb-2">Primera mitad: <strong>{pizza.name}</strong></p>
                   <Label className="text-sm mb-1.5 block">Elige la segunda mitad:</Label>
                   <Select value={secondHalf} onValueChange={setSecondHalf}>
                     <SelectTrigger className="w-full bg-background">
                       <SelectValue placeholder="Selecciona una especialidad" />
                     </SelectTrigger>
                     <SelectContent>
                       {allEspecialidades.map((esp) => (
                         <SelectItem key={esp} value={esp}>
                           {esp}
                         </SelectItem>
                       ))}
                     </SelectContent>
                   </Select>
                 </div>
               )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-base font-semibold">Notas adicionales</Label>
              <Textarea
                id="notes"
                placeholder="Sin cebolla, bien dorada, etc..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="resize-none"
              />
            </div>

            <div className="pt-2">
              <Button className="w-full text-lg h-12" onClick={handleAddToCart}>
                Agregar al Carrito - ${getSinglePrice()}
              </Button>
              <Button variant="ghost" className="w-full mt-2" onClick={() => setMode("select-mode")}>
                Volver
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

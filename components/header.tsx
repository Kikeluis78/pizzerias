"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ShoppingCart, Settings, Pizza, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/hooks/use-cart"
import { pizzeriaConfig } from "@/config/pizzeria.config"

export function Header() {
  const { items } = useCart()
  const [mounted, setMounted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Cerrar menú al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsMenuOpen(false)
  }

  // Cerrar menú al presionar Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false)
    }

    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  const itemCount = mounted ? items.reduce((sum, item) => sum + item.quantity, 0) : 0

  const navLinks = [
    { href: "/home", label: "Inicio" },
    { href: "/2x1", label: "Pizzas 2x1" },
    { href: "/paquetes", label: "Paquetes" },
    { href: "/complementos", label: "Complementos" },
    { href: "/recompensas", label: "Recompensas" },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/home" className="flex items-center gap-2">
            <Pizza className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-foreground">{pizzeriaConfig.nombre}</span>
          </Link>

          {/* Menú para desktop - oculto en móvil */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Botón hamburguesa para móvil - solo visible en móvil */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {isMenuOpen ? <X className="!h-9 !w-9" /> : <Menu className="!h-9 !w-9" />}
            </Button>

            {/* Carrito y Ajustes - solo visibles en desktop */}
            <div className="hidden md:flex items-center gap-2">
              <Link href="/carrito">
                <Button variant="ghost" size="icon" className="relative">
                  <ShoppingCart className="h-5 w-5" />
                  {mounted && itemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="absolute -right-1 -top-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Button>
              </Link>
              <Link href="/ajustes">
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Menú móvil desplegable */}
      <div
        className={`
          fixed inset-0 z-40 md:hidden
          ${isMenuOpen ? "visible" : "invisible"}
          transition-all duration-300
        `}
      >
        {/* Overlay */}
        <div
          className={`
            absolute inset-0 bg-black/50
            ${isMenuOpen ? "opacity-100" : "opacity-0"}
            transition-opacity duration-300
          `}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Panel del menú */}
        <div
          className={`
            absolute right-0 top-0 h-full w-64 bg-background shadow-lg
            ${isMenuOpen ? "translate-x-0" : "translate-x-full"}
            transition-transform duration-300 ease-in-out
          `}
        >
          <div className="flex flex-col p-6">
            <div className="mb-8 flex items-center justify-between">
              <Link
                href="/home"
                className="flex items-center gap-2"
                onClick={handleLinkClick}
              >
                <Pizza className="h-8 w-8 text-primary" />
                <span className="text-xl font-bold text-foreground">
                  {pizzeriaConfig.nombre}
                </span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(false)}
                aria-label="Cerrar menú"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={handleLinkClick}
                  className="py-3 text-lg font-medium text-foreground hover:text-primary transition-colors border-b last:border-b-0"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Carrito y Ajustes solo en menú móvil */}
            <div className="mt-8 pt-6 border-t">
              <div className="flex flex-col gap-4">
                <Link
                  href="/carrito"
                  className="flex items-center justify-between py-3"
                  onClick={handleLinkClick}
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="text-sm font-medium">Carrito</span>
                  </div>
                  {mounted && itemCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {itemCount}
                    </Badge>
                  )}
                </Link>
                <Link
                  href="/ajustes"
                  className="flex items-center gap-3 py-3"
                  onClick={handleLinkClick}
                >
                  <Settings className="h-5 w-5" />
                  <span className="text-sm font-medium">Ajustes</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
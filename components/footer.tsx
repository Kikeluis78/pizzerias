"use client"

import { Facebook, Instagram, MapPin, Youtube, FileText, Cookie, Shield } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { pizzeriaConfig } from "@/config/pizzeria.config"

export function Footer() {
  const [isVisible, setIsVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false)
      } else {
        setIsVisible(true)
      }

      setLastScrollY(currentScrollY)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => window.removeEventListener("scroll", handleScroll)
  }, [lastScrollY])

  return (
    <footer
      className={`border-t bg-gradient-to-br from-primary/10 via-card to-accent/10 transition-all duration-500 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
    >
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Siguenos */}
          <div className="animate-fadeIn">
            <h3 className="font-bold text-lg mb-4 text-primary">Siguenos</h3>
            <div className="flex gap-4">
              <Link
                href={pizzeriaConfig.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-125"
              >
                <Facebook className="h-6 w-6" />
              </Link>
              <Link
                href={pizzeriaConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-125"
              >
                <Instagram className="h-6 w-6" />
              </Link>
              <Link
                href={pizzeriaConfig.social.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-125"
              >
                <Youtube className="h-6 w-6" />
              </Link>
              <Link
                href={pizzeriaConfig.social.x}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-200 hover:scale-125"
              >
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Contacto */}
          <div className="animate-fadeIn">
            <h3 className="font-bold text-lg mb-4 text-primary">Contacto</h3>
            <div className="space-y-2 text-muted-foreground">
              {pizzeriaConfig.telefonos.map((tel, idx) => (
                <p key={idx} className="hover:text-primary transition-colors">
                  Tel: {tel}
                </p>
              ))}
              <Link
                href={`https://maps.google.com/?q=${pizzeriaConfig.coordenadas}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-primary transition-colors"
              >
                <MapPin className="h-5 w-5" />
                <span>{pizzeriaConfig.ciudad}</span>
                <span>{pizzeriaConfig.ubicacion}</span>
              </Link>
            </div>
          </div>

          {/* Enlaces utiles */}
          <div className="animate-fadeIn">
            <h3 className="font-bold text-lg mb-4 text-primary">Enlaces</h3>
            <div className="space-y-2">
              <Link
                href="/nosotros"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <FileText className="h-4 w-4" />
                Sobre Nosotros
              </Link>
              <Link
                href="/menu-completo"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <FileText className="h-4 w-4" />
                Menu Completo
              </Link>
              <Link
                href="/sucursales"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <FileText className="h-4 w-4" />
                Nuestras Sucursales
              </Link>
              <Link
                href="/trabaja-con-nosotros"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <FileText className="h-4 w-4" />
                Trabaja con Nosotros
              </Link>
            </div>
          </div>

          {/* Politicas */}
          <div className="animate-fadeIn">
            <h3 className="font-bold text-lg mb-4 text-primary">Informacion Legal</h3>
            <div className="space-y-2">
              <Link
                href="/privacidad"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Shield className="h-4 w-4" />
                Politica de Privacidad
              </Link>
              <Link
                href="/cookies"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Cookie className="h-4 w-4" />
                Politica de Cookies
              </Link>
              <Link
                href="/terminos"
                className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <FileText className="h-4 w-4" />
                Terminos y Condiciones
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} {pizzeriaConfig.nombre}. Todos los derechos reservados
          </p>
          <p className="text-xs text-muted-foreground mt-2">Desarrollado por {pizzeriaConfig.desarrollador}</p>
        </div>
      </div>
    </footer>
  )
}

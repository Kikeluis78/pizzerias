"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pizza } from "lucide-react"
import Swal from "sweetalert2"

interface UserAccount {
  name: string
  email: string
  phone: string
  createdAt: string
}

export default function AuthPage() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isLogin, setIsLogin] = useState(false)
  const [existingAccount, setExistingAccount] = useState<UserAccount | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const account = localStorage.getItem("userAccount")
    if (account) {
      setExistingAccount(JSON.parse(account))
      setIsLogin(true)
    }
  }, [mounted])

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone || !formData.password) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor completa todos los campos",
      })
      return
    }

    const account: UserAccount = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      createdAt: new Date().toISOString(),
    }

    localStorage.setItem("userAccount", JSON.stringify(account))
    localStorage.setItem("userPassword", formData.password)

    Swal.fire({
      icon: "success",
      title: "Cuenta creada",
      text: "Tu cuenta ha sido creada exitosamente",
      timer: 2000,
      showConfirmButton: false,
    })

    setTimeout(() => {
      router.push("/home")
    }, 2000)
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()

    const storedPassword = localStorage.getItem("userPassword")

    if (formData.password === storedPassword) {
      Swal.fire({
        icon: "success",
        title: "Bienvenido",
        text: `Hola ${existingAccount?.name}`,
        timer: 1500,
        showConfirmButton: false,
      })

      setTimeout(() => {
        router.push("/home")
      }, 1500)
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Contraseña incorrecta",
      })
    }
  }

  const handleContinueWithoutLogin = () => {
    Swal.fire({
      icon: "info",
      title: "Modo Invitado",
      text: "Podrás ordenar sin crear una cuenta",
      timer: 1500,
      showConfirmButton: false,
    })

    setTimeout(() => {
      router.push("/home")
    }, 1500)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Pizza className="h-12 w-12 text-primary animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Pizza className="h-16 w-16 text-primary" />
          </div>
          <CardTitle className="text-2xl">{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</CardTitle>
          <CardDescription>
            {isLogin ? "Ingresa tu contraseña para continuar" : "Regístrate para hacer tus pedidos"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={isLogin ? handleLogin : handleRegister} className="space-y-4">
            {!isLogin ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Pérez"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Correo electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="correo@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="5512345678"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
              </>
            ) : (
              <div className="space-y-2">
                <Label>Usuario</Label>
                <p className="text-sm font-medium p-2 bg-muted rounded-md">{existingAccount?.name}</p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <Button type="submit" className="w-full" size="lg">
              {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full bg-transparent"
              onClick={handleContinueWithoutLogin}
            >
              Continuar sin cuenta
            </Button>

            {isLogin && (
              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  localStorage.removeItem("userAccount")
                  localStorage.removeItem("userPassword")
                  setExistingAccount(null)
                  setIsLogin(false)
                  setFormData({ name: "", email: "", phone: "", password: "" })
                }}
              >
                Crear nueva cuenta
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

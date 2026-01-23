"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { MapPin, Plus, Edit, Trash2, Check } from "lucide-react"
import { useRouter } from "next/navigation"
import Swal from "sweetalert2"

interface Address {
  id: string
  userName: string
  addressType: "casa" | "departamento" | "oficina" | "trabajo" | "otro"
  street: string
  number: string
  neighborhood: string
  postalCode: string
  phone: string
  references: string
  isMain: boolean
}

export function AddressManager() {
  const router = useRouter()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Omit<Address, "id" | "isMain">>({
    userName: "",
    addressType: "casa",
    street: "",
    number: "",
    neighborhood: "",
    postalCode: "",
    phone: "",
    references: "",
  })

  useEffect(() => {
    const savedAddresses = localStorage.getItem("deliveryAddresses")
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses))
    }

    const userAccount = localStorage.getItem("userAccount")
    if (userAccount) {
      const account = JSON.parse(userAccount)
      setFormData((prev) => ({ ...prev, userName: account.name, phone: account.phone }))
    }
  }, [])

  const saveAddresses = (newAddresses: Address[]) => {
    setAddresses(newAddresses)
    localStorage.setItem("deliveryAddresses", JSON.stringify(newAddresses))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (
      !formData.userName ||
      !formData.street ||
      !formData.number ||
      !formData.neighborhood ||
      !formData.postalCode ||
      !formData.phone
    ) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Por favor completa todos los campos obligatorios",
      })
      return
    }

    if (editingId) {
      const updatedAddresses = addresses.map((addr) =>
        addr.id === editingId ? { ...formData, id: addr.id, isMain: addr.isMain } : addr,
      )
      saveAddresses(updatedAddresses)
      setEditingId(null)
      Swal.fire({
        icon: "success",
        title: "Dirección actualizada",
        timer: 1500,
        showConfirmButton: false,
      })
    } else {
      const newAddress: Address = {
        ...formData,
        id: Date.now().toString(),
        isMain: addresses.length === 0,
      }
      saveAddresses([...addresses, newAddress])
      Swal.fire({
        icon: "success",
        title: "Dirección guardada",
        timer: 1500,
        showConfirmButton: false,
      })
    }

    setShowForm(false)
    resetForm()
  }

  const resetForm = () => {
    const userAccount = localStorage.getItem("userAccount")
    const account = userAccount ? JSON.parse(userAccount) : {}
    setFormData({
      userName: account.name || "",
      addressType: "casa",
      street: "",
      number: "",
      neighborhood: "",
      postalCode: "",
      phone: account.phone || "",
      references: "",
    })
  }

  const handleEdit = (address: Address) => {
    setFormData({
      userName: address.userName,
      addressType: address.addressType,
      street: address.street,
      number: address.number,
      neighborhood: address.neighborhood,
      postalCode: address.postalCode,
      phone: address.phone,
      references: address.references,
    })
    setEditingId(address.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "¿Eliminar dirección?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        const newAddresses = addresses.filter((addr) => addr.id !== id)
        saveAddresses(newAddresses)
        Swal.fire({
          icon: "success",
          title: "Dirección eliminada",
          timer: 1500,
          showConfirmButton: false,
        })
      }
    })
  }

  const handleSetMain = (id: string) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isMain: addr.id === id,
    }))
    saveAddresses(updatedAddresses)
  }

  const handleUseLast = () => {
    if (addresses.length > 0) {
      const lastAddress = addresses[addresses.length - 1]
      localStorage.setItem("selectedAddress", JSON.stringify(lastAddress))
      router.push("/pizzas")
    }
  }

  const handleContinue = () => {
    if (addresses.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Sin dirección",
        text: "Por favor agrega una dirección de entrega",
      })
      return
    }

    const mainAddress = addresses.find((addr) => addr.isMain) || addresses[0]
    localStorage.setItem("selectedAddress", JSON.stringify(mainAddress))
    router.push("/pizzas")
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Saved Addresses */}
      {addresses.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Direcciones Guardadas</h2>
          {addresses.map((address) => (
            <Card key={address.id} className={address.isMain ? "border-primary border-2" : ""}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-primary" />
                      <span className="font-semibold text-card-foreground">{address.userName}</span>
                      <span className="text-sm text-muted-foreground capitalize">({address.addressType})</span>
                      {address.isMain && (
                        <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Principal</span>
                      )}
                    </div>
                    <p className="text-sm text-card-foreground">
                      {address.street} #{address.number}, {address.neighborhood}
                    </p>
                    <p className="text-sm text-muted-foreground">CP: {address.postalCode}</p>
                    <p className="text-sm text-muted-foreground">Tel: {address.phone}</p>
                    {address.references && (
                      <p className="text-sm text-muted-foreground mt-1">Ref: {address.references}</p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {!address.isMain && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSetMain(address.id)}
                        title="Establecer como principal"
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="icon" onClick={() => handleEdit(address)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(address.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex gap-3">
            <Button onClick={handleUseLast} variant="outline" className="flex-1 bg-transparent">
              Usar Última Dirección
            </Button>
            <Button onClick={handleContinue} className="flex-1">
              Continuar con Dirección Principal
            </Button>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showForm ? (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Editar Dirección" : "Nueva Dirección"}</CardTitle>
            <CardDescription>Completa los datos de tu dirección de entrega</CardDescription>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="userName">Nombre del usuario *</Label>
                  <Input
                    id="userName"
                    value={formData.userName}
                    onChange={(e) => setFormData({ ...formData, userName: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="addressType">Tipo de dirección *</Label>
                  <Select
                    value={formData.addressType}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        addressType: value as Address["addressType"],
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="casa">Casa</SelectItem>
                      <SelectItem value="departamento">Departamento</SelectItem>
                      <SelectItem value="oficina">Oficina</SelectItem>
                      <SelectItem value="trabajo">Trabajo</SelectItem>
                      <SelectItem value="otro">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="street">Calle *</Label>
                  <Input
                    id="street"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número *</Label>
                  <Input
                    id="number"
                    value={formData.number}
                    onChange={(e) => setFormData({ ...formData, number: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="neighborhood">Colonia *</Label>
                  <Input
                    id="neighborhood"
                    value={formData.neighborhood}
                    onChange={(e) => setFormData({ ...formData, neighborhood: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="postalCode">Código Postal *</Label>
                  <Input
                    id="postalCode"
                    value={formData.postalCode}
                    onChange={(e) => setFormData({ ...formData, postalCode: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="references">Referencias del domicilio</Label>
                  <Textarea
                    id="references"
                    value={formData.references}
                    onChange={(e) => setFormData({ ...formData, references: e.target.value })}
                    placeholder="Ej: Entre calle X y Y, casa de color azul"
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingId(null)
                    resetForm()
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  {editingId ? "Actualizar" : "Guardar Dirección"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button onClick={() => setShowForm(true)} className="w-full" size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Nueva Dirección
        </Button>
      )}
    </div>
  )
}

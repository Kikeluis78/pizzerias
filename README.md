# 🍕 Della Casa - Sistema de Pedidos de Pizzería

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/kikeluis78s-projects/v0-shopping-cart-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/sWfCFFoeW7s)

## 📋 Descripción

Sistema completo de pedidos online para pizzerías locales en México. Plantilla reutilizable que permite personalizar fácilmente para cualquier negocio de pizzas modificando solo archivos de configuración.

## ✨ Características Principales

- 🍕 **Promociones 2x1** con personalización completa
- 🎨 **Pizzas Mitad y Mitad** - combina especialidades
- 📝 **Anotaciones personalizadas** - sin ingredientes, extras, etc.
- 🛒 **Carrito de compras** con persistencia
- 💳 **Múltiples métodos de pago** - efectivo, tarjeta, transferencia, vales
- 🎫 **Sistema de cupones** de descuento
- 📍 **Gestión de direcciones** de entrega
- 🏪 **Recoger en restaurante** o entrega a domicilio
- 👤 **Con o sin cuenta** - pedidos como invitado
- 🎁 **Sistema de recompensas** por redes sociales
- 📱 **WhatsApp integration** - envío automático de pedidos
- 🌙 **Modo oscuro/claro**
- 📱 **Responsive design** - optimizado para móviles

## 🚀 Tecnologías

- **Next.js 16** - App Router
- **React 19** - Server & Client Components
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Styling
- **shadcn/ui** - UI Components
- **Zustand** - State management
- **SweetAlert2** - Notifications
- **LocalStorage** - Data persistence

## 📁 Estructura del Proyecto

```
├── app/                    # Pages y rutas
│   ├── 2x1/               # Pizzas promoción 2x1
│   ├── paquetes/          # Paquetes de comida
│   ├── complementos/      # Bebidas y extras
│   ├── carrito/           # Carrito de compras
│   ├── direccion/         # Gestión de direcciones
│   ├── confirmar-pedido/  # Confirmación y WhatsApp
│   └── recompensas/       # Sistema de puntos
├── components/            # Componentes reutilizables
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Navegación principal
│   ├── footer.tsx        # Footer con links
│   └── ...
├── config/               # 🔧 ARCHIVOS DE CONFIGURACIÓN
│   ├── pizzeria.config.ts # Datos del negocio
│   ├── menu.config.ts     # Menú y productos
│   └── theme.config.ts    # Colores y tema
├── hooks/                # Custom hooks
└── public/              # Imágenes y assets
```

## 🔧 Configuración para Tu Pizzería

### 1. Información del Negocio (`config/pizzeria.config.ts`)

```typescript
export const pizzeriaConfig = {
  name: "Tu Pizzería",  // Cambia el nombre
  phones: ["55 1234-5678"],  // Tus teléfonos
  whatsapp: "525512345678",  // Tu WhatsApp
  social: {
    facebook: "tu-url",
    instagram: "tu-url",
    // ...
  },
}
```

### 2. Menú (`config/menu.config.ts`)

```typescript
export const menuConfig = {
  especialidades: [
    {
      name: "Hawaiana",
      ingredients: "Piña, jamón y queso",
      prices: { CH: 199, MED: 279, GDE: 309, FAM: 349 },
    },
    // Agrega tus especialidades
  ],
  paquetes: [...],  // Tus paquetes
  cupones: {...},   // Tus cupones
}
```

### 3. Tema (`config/theme.config.ts` y `app/globals.css`)

Cambia los colores en las variables CSS para tu marca.

### 4. Imágenes

Reemplaza en `/public`:
- Logo
- Fotos de productos
- Imágenes de paquetes

## 🔄 Flujo de Usuario

1. **Landing** → Spinner de carga animado
2. **Home** → Banner con paquetes destacados
3. **Menú** → Especialidades 2x1, Paquetes, Complementos
4. **Personalización** → Mitad y mitad, anotaciones, complementos
5. **Carrito** → Cupones de descuento, métodos de pago
6. **Dirección** → Entrega o recoger en restaurante
7. **Confirmación** → Datos del cliente (con/sin cuenta)
8. **WhatsApp** → Envío automático del pedido

## 📱 Deployment

```bash
# Instalar dependencias
npm install

# Desarrollo
npm run dev

# Build
npm run build

# Deploy en Vercel
vercel --prod
```

**Live Site**: [https://vercel.com/kikeluis78s-projects/v0-shopping-cart-app](https://vercel.com/kikeluis78s-projects/v0-shopping-cart-app)

## 🎯 Uso como Plantilla

Esta app está diseñada para ser reutilizable. Para crear una nueva app para otra pizzería:

1. Clona el repositorio
2. Modifica **solo** los archivos en `/config`
3. Reemplaza imágenes en `/public`
4. Actualiza el número de WhatsApp
5. Deploy

**Ver documentación completa**: `PLANTILLA-README.md`

## 💡 Características Técnicas

- **SSR & CSR** - Server y Client Components optimizados
- **Persistencia** - LocalStorage para carrito y preferencias
- **Hidratación segura** - Sin errores de mismatch
- **Optimización móvil** - Touch-friendly, responsive
- **SEO friendly** - Metadata optimizado
- **Performance** - Code splitting, lazy loading
- **Accesibilidad** - ARIA labels, keyboard navigation

## 📞 Contacto

Desarrollado para pizzerías locales en México y Estado de México.

---

**Built with ❤️ using [v0.app](https://v0.app/chat/sWfCFFoeW7s)**

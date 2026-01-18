# 🍕 Plantilla de App de Pizzería - Configuración

Esta es una plantilla reutilizable para crear aplicaciones de pedidos para pizzerías locales en México. Solo necesitas modificar los archivos de configuración para personalizar la app para cada negocio.

## 📋 Archivos de Configuración

### 1. `config/pizzeria.config.ts`

Contiene toda la información del negocio:

```typescript
export const pizzeriaConfig = {
  // Información básica
  name: "Della Casa",  // Nombre de la pizzería
  slogan: "Pensando en usted",  // Slogan

  // Contacto
  phones: ["55 2621-2166", "55 5634-7708"],  // Teléfonos de contacto
  email: "contacto@dellacasa.com",
  address: "Ciudad de México, México",

  // Redes sociales (para recompensas)
  social: {
    facebook: "https://facebook.com/dellacasa",
    instagram: "https://instagram.com/dellacasa",
    twitter: "https://twitter.com/dellacasa",
    youtube: "https://youtube.com/dellacasa",
  },

  // WhatsApp para pedidos (formato: 52 + lada + número)
  whatsapp: "525526212166",

  // Horarios
  schedule: {
    weekdays: "10:00 AM - 11:00 PM",
    weekends: "10:00 AM - 12:00 AM",
  },
}
```

### 2. `config/menu.config.ts`

Define todo el menú de productos:

```typescript
export const menuConfig = {
  // Especialidades 2x1
  especialidades: [
    {
      name: "Hawaiana",
      ingredients: "Piña, jamón y queso",
      prices: { CH: 199, MED: 279, GDE: 309, FAM: 349 },
    },
    // ... más especialidades
  ],

  // Paquetes
  paquetes: [
    {
      name: "Spaguetti Alla Bolognese",
      description: "Salsa, carne molida y queso",
      price: 109,
      image: "/spaguetti-bolognese.jpg",
    },
    // ... más paquetes
  ],

  // Complementos
  complementos: {
    bebidas: [
      { name: "Refresco de Sabor 2 Lts", price: 45 },
      { name: "Coca Cola 2 Lts", price: 49 },
      { name: "Refresco de Lata", price: 28 },
    ],
  },

  // Cupones de descuento
  cupones: {
    "PZD-50": { discount: 50, description: "50% de descuento" },
    "PZD-25": { discount: 25, description: "25% de descuento" },
    "PZD-10": { discount: 10, description: "10% de descuento" },
  },
}
```

### 3. `config/theme.config.ts`

Personalización visual:

```typescript
export const themeConfig = {
  colors: {
    primary: "hsl(16, 85%, 55%)", // Color principal
    secondary: "hsl(38, 90%, 50%)", // Color secundario
    accent: "hsl(0, 75%, 50%)", // Color de acento
  },

  fonts: {
    sans: "Geist",
    mono: "Geist Mono",
  },

  logo: {
    text: "Della Casa",
    icon: "🍕",
  },
}
```

### 4. `app/globals.css`

Ajusta los colores del tema en las variables CSS:

```css
:root {
  --primary: 16 85% 55%;  /* Naranja/rojo cálido */
  --secondary: 38 90% 50%;  /* Amarillo dorado */
  --accent: 0 75% 50%;  /* Rojo intenso */
  /* ... más variables */
}
```

## 🎨 Personalización por Pizzería

### Paso 1: Información del Negocio

1. Edita `config/pizzeria.config.ts`
2. Cambia el nombre, teléfonos, redes sociales
3. **IMPORTANTE**: Actualiza el número de WhatsApp

### Paso 2: Menú de Productos

1. Edita `config/menu.config.ts`
2. Modifica las especialidades con sus precios
3. Ajusta paquetes y complementos
4. Define cupones de descuento personalizados

### Paso 3: Colores y Tema

1. Edita `config/theme.config.ts` y `app/globals.css`
2. Cambia los colores primarios según la marca
3. Ajusta fuentes si es necesario

### Paso 4: Imágenes

Reemplaza las imágenes en `/public`:
- Logo de la pizzería
- Fotos de productos
- Imágenes de paquetes

### Paso 5: Número de WhatsApp

Busca y reemplaza en estos archivos:
- `app/confirmar-pedido/page.tsx` (línea con phoneNumber)
- `config/pizzeria.config.ts`

Formato: `521` + `lada` + `número`
Ejemplo: `5215526212166` para 55-2621-2166

## ✨ Características

- ✅ Pedidos con o sin cuenta
- ✅ Promociones 2x1 con pizzas mitad y mitad
- ✅ Personalización de pizzas (anotaciones)
- ✅ Múltiples métodos de pago
- ✅ Sistema de cupones de descuento
- ✅ Gestión de direcciones de entrega
- ✅ Sistema de recompensas por redes sociales
- ✅ Envío automático por WhatsApp
- ✅ Modo oscuro/claro
- ✅ Responsive design

## 🚀 Despliegue

1. Actualiza todos los archivos de configuración
2. Reemplaza imágenes en `/public`
3. Despliega en Vercel
4. Comparte el link con tus clientes

## 📱 Flujo de Usuario

1. **Entrada**: Spinner de carga → Home
2. **Navegación**: Ver pizzas 2x1, paquetes o complementos
3. **Selección**: Personalizar productos y agregar al carrito
4. **Checkout**: Aplicar cupón, seleccionar método de pago
5. **Entrega**: Agregar dirección o recoger en tienda
6. **Confirmación**: Revisar pedido y enviar por WhatsApp

## 🛠️ Tecnologías

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui
- Zustand (state management)
- SweetAlert2 (notifications)

## 📞 Soporte

Para personalizar esta plantilla para tu pizzería, contacta al desarrollador.

---

**Nota**: Esta plantilla está optimizada para pizzerías en México y Estado de México, pero puede adaptarse fácilmente para otros lugares.

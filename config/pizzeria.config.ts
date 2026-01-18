// Define el tipo primero
interface PizzeriaConfig {
  // Información básica
  nombre: string;
  slogan: string;
  desarrollador: string;
  
  // Contacto
  telefonos: string[];
  email: string;
  ubicacion: string;
  ciudad: string;
  coordenadas: string;
  whatsapp: string;  // <-- WhatsApp está aquí en nivel raíz
  
  // Redes sociales
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    youtube: string;
    x: string;
  };
  
  // Horarios
  schedule: {
    weekdays: string;
    weekends: string;
  };
  
  // Políticas
  policies: {
    privacy: string;
    cookies: string;
    terms: string;
  };
}

// Luego exportas con el tipo
export const pizzeriaConfig: PizzeriaConfig = {
  // Información básica
  nombre: "Della Casa",
  slogan: "Pensando en usted",
  desarrollador: "Enrique Vargas",

  // Contacto
  telefonos: ["55 2621-2166", "55 5634-7708"],
  email: "contacto@dellacasa.com",
  ubicacion: "Calle: Colonia:",
  ciudad: "Ciudad de Mexico",
  coordenadas: "",

  // WhatsApp para pedidos
  whatsapp: "5611001627",

  // Redes sociales
  social: {
    facebook: "https://facebook.com/dellacasa",
    instagram: "https://instagram.com/dellacasa",
    twitter: "https://twitter.com/dellacasa",
    youtube: "https://youtube.com/dellacasa",
    x: "https://twitter.com/dellacasa",
  },

  // Horarios
  schedule: {
    weekdays: "10:00 AM - 11:00 PM",
    weekends: "10:00 AM - 12:00 AM",
  },

  // Políticas
  policies: {
    privacy: "/politicas/privacidad",
    cookies: "/politicas/cookies",
    terms: "/politicas/terminos",
  },
};
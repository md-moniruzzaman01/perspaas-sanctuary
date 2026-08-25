// Single WhatsApp business number shared across the PersPaaS ecosystem;
// supplied via env before launch (digits only, country code included).
export const WHATSAPP_NUMBER = import.meta.env["VITE_WHATSAPP_NUMBER"] ?? "";

const DEMO_MESSAGE =
  "Hola, estoy interesado en la licencia individual de Sanctuary. Soy de Latinoamérica. Mi nombre es ___.";

export const whatsAppDemoLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEMO_MESSAGE)}`;

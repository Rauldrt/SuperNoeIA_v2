
// --- CONFIGURACIÓN DEL CLIENTE (MARCA BLANCA) ---
// Modifica este archivo para personalizar la app para un nuevo cliente.

export const CLIENT_CONFIG = {
  // IDENTIDAD
  name: "Supermercado Noelia", // Nombre del negocio
  shortName: "Noelia AI",      // Nombre corto para móvil
  botName: "Asistente Virtual", // Nombre del bot en el chat
  
  // LOGO: Puede ser una URL remota o una ruta local (ej: '/logos/cliente1.png')
  logoUrl: "https://cdn-icons-png.flaticon.com/512/3081/3081559.png", 
  
  // COLORES
  // El color principal de la marca. La app generará automáticamente la paleta (50-900).
  primaryColor: "#ec4899", // Por defecto: Rosa Noelia (#ec4899). 
  // Ejemplos: Azul Farmacia (#2563eb), Verde Verdulería (#16a34a), Naranja Ferretería (#ea580c)

  // TEXTOS
  welcomeTitle: "Bienvenido a Supermercado Noelia",
  welcomeSubtitle: "Soy tu asistente virtual. Consulta precios, horarios y recetas al instante.",
  inputPlaceholder: "Pregunta por precios, ofertas o recetas...",
  footerText: "IA potenciada por Gemini. Verifica la información.",
  
  // BASE DE CONOCIMIENTO (CSV)
  // Archivo > Compartir > Publicar en la web > CSV
  csvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vS8v6EfTn5QfJPDmaCZRfFaAmkdopFrYPBh9N0s3ifH3_q257I_zgXxNz-GJUByuQbAgc0kfeXLZEJZ/pub?gid=1147648108&single=true&output=csv",

  // META (SEO Básico)
  metaDescription: "Asistente Virtual de Noelia Supermercado. Consulta precios, recetas y horarios con IA.",

  // CONFIGURACIÓN INICIAL DEL BOT
  defaultSystemPrompt: "Eres el asistente IA de {CLIENT_NAME}. Tu objetivo es ayudar con información precisa basada en los documentos provistos. REGLA VISUAL: Siempre que listes precios o productos, no utilices Tablas Markdown. Sé amable y conciso."
};

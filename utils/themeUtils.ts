
import { CLIENT_CONFIG } from '../clientConfig';

/**
 * Convierte un color Hex a RGB.
 */
const hexToRgb = (hex: string): string => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)} ${parseInt(result[2], 16)} ${parseInt(result[3], 16)}`
    : '0 0 0';
};

/**
 * Genera variaciones de luminosidad para simular la paleta de Tailwind (50-900)
 * Esta es una aproximación simple para evitar librerías pesadas de color.
 */
const adjustColor = (hex: string, factor: number): string => {
    // Lógica simplificada: mezclamos con blanco (tint) o negro (shade)
    // Nota: Para una implementación perfecta se usaría HSL, pero esto funciona visualmente bien para UI.
    // Como Tailwind usa variables RGB para la opacidad, aquí solo necesitamos devolver el RGB base modificado.
    
    // Convertimos a RGB primero
    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    if (factor > 0) {
        // TINT (Mezclar con blanco) - Factor 0 a 1
        r = Math.round(r + (255 - r) * factor);
        g = Math.round(g + (255 - g) * factor);
        b = Math.round(b + (255 - b) * factor);
    } else {
        // SHADE (Mezclar con negro) - Factor 0 a -1
        r = Math.round(r * (1 + factor));
        g = Math.round(g * (1 + factor));
        b = Math.round(b * (1 + factor));
    }

    return `${r} ${g} ${b}`;
};

/**
 * Aplica el tema al documento HTML.
 * Inyecta variables CSS que Tailwind consumirá.
 */
export const applyClientTheme = () => {
  const root = document.documentElement;
  const primary = CLIENT_CONFIG.primaryColor;

  // Actualizar Título
  document.title = CLIENT_CONFIG.name;
  
  // Actualizar Meta Description
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) {
      metaDesc.setAttribute('content', CLIENT_CONFIG.metaDescription);
  }

  // Generar Paleta 'brand' dinámica
  // 500 es el color base.
  // 50-400 son tints (más claros).
  // 600-900 son shades (más oscuros).
  
  const palette = {
      50: adjustColor(primary, 0.95),
      100: adjustColor(primary, 0.9),
      200: adjustColor(primary, 0.7),
      300: adjustColor(primary, 0.5),
      400: adjustColor(primary, 0.3),
      500: hexToRgb(primary),       // Base
      600: adjustColor(primary, -0.1),
      700: adjustColor(primary, -0.3),
      800: adjustColor(primary, -0.5),
      900: adjustColor(primary, -0.7),
  };

  // Inyectar variables CSS
  Object.entries(palette).forEach(([key, value]) => {
      root.style.setProperty(`--color-brand-${key}`, value);
  });
};

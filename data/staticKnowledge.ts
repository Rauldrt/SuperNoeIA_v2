
import { KnowledgeDocument } from '../types';

// ESTRATEGIA HÍBRIDA - PARTE 1: DATOS DUROS (ESENCIALES)
// Estos datos siempre están disponibles, no dependen de internet ni de Sheets.

const POLICIES_TEXT = `
--- INFORMACIÓN INSTITUCIONAL DE NOELIA SUPERMERCADO ---

1. UBICACIÓN Y HORARIOS:
   - Dirección: Agustin Albert y Plusunski - Bº Nva Argentina - Wanda - Misiones.
   - Lunes a Viernes: 08:00 a 12 y 16:30 a 20:30.
   - Sabado : 07:00 a 12:00.
   - Sabado por la tarde y Domingo cerrado.

2. MEDIOS DE PAGO ACEPTADOS:
   - Efectivo (importantes descuentos en productos seleccionados).
   - Tarjetas de Débito y Crédito (Visa, Master, Cabal).
   - Mercado Pago (Transferencia).

3. ENVÍOS A DOMICILIO:
   - Gratis para compras superiores a $150.000 (Wanda).
   - Los pedidos se toman por WhatsApp hasta las 11:00 hs, se entrega por la tarde.

4. POLÍTICA DE DEVOLUCIONES:
   - Se aceptan cambios dentro de las 72hs con ticket de compra.
   - IMPORTANTE: Productos de heladera/freezer NO tienen cambio por corte de cadena de frío.
`.trim();

export const STATIC_DOCUMENTS: KnowledgeDocument[] = [
  {
    id: 'sys-policies-core',
    title: 'Políticas y Horarios (Esencial)',
    content: POLICIES_TEXT,
    addedAt: Date.now(),
    tokensEstimated: Math.ceil(POLICIES_TEXT.length / 4),
    isSystem: true
  }
];

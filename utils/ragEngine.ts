
import { KnowledgeDocument } from '../types';

/**
 * Motor RAG del lado del cliente.
 * Optimizado para Gemini Flash (Ventana de contexto de 1 Millón de tokens).
 */
export const prepareContext = (
  query: string,
  documents: KnowledgeDocument[],
  maxContextTokens: number = 1000000, // AUMENTADO: De 30k a 1M para soportar CSVs grandes
  strictMode: boolean = true
): { contextString: string; usedDocIds: string[] } => {
  
  if (documents.length === 0) {
    return { contextString: '', usedDocIds: [] };
  }

  // 1. Tokenización
  const queryTerms = query.toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 1); 

  // 2. Puntuar documentos
  const scoredDocs = documents.map(doc => {
    let score = 0;
    const docTextLower = doc.content.toLowerCase();
    
    // Coincidencia de términos
    queryTerms.forEach(term => {
      if (docTextLower.includes(term)) score += 1;
    });

    // Bonus título
    queryTerms.forEach(term => {
      if (doc.title.toLowerCase().includes(term)) score += 3;
    });

    // BONUS CRÍTICO: Si es el CSV del sistema, le damos un puntaje base mínimo
    // para asegurar que se considere si el modo estricto está activado.
    if (doc.id === 'sys-csv-dynamic') score += 0.5;

    return { ...doc, score };
  });

  // 3. Estrategia de Selección:
  const totalTokensAllDocs = documents.reduce((acc, doc) => acc + doc.tokensEstimated, 0);
  let docsToProcess = [];

  // Si todo cabe en 1 Millón de tokens (casi siempre cierto para PYMES), enviamos TODO.
  // Esto es "Full Context RAG" y es lo más preciso.
  if (totalTokensAllDocs < maxContextTokens) {
    docsToProcess = [...documents]; 
  } else {
    // Si superamos el millón (raro), filtramos por relevancia
    docsToProcess = scoredDocs
        .filter(doc => doc.score > 0)
        .sort((a, b) => b.score - a.score);
  }

  // 4. Construir String final
  let currentTokens = 0;
  let contextParts: string[] = [];
  const usedDocIds: string[] = [];

  for (const doc of docsToProcess) {
    // CORRECCIÓN CRÍTICA:
    // Antes, si el doc era mas grande que el espacio restante, se hacía 'break' y se ignoraba.
    // Ahora, si es el PRIMER documento y no cabe, lo metemos igual (Gemini lo truncará si es necesario, pero no lo perdemos).
    const fits = (currentTokens + doc.tokensEstimated < maxContextTokens);
    const isFirstAndCrucial = (contextParts.length === 0);

    if (fits || isFirstAndCrucial) {
      contextParts.push(`--- FUENTE: ${doc.title} ---\n${doc.content}\n`);
      currentTokens += doc.tokensEstimated;
      usedDocIds.push(doc.id);
    } else {
      // Si ya tenemos info y este doc no cabe, paramos.
      break; 
    }
  }

  // 5. Construir Prompt del Sistema
  let preamble = "";
  
  if (strictMode) {
    preamble = `
INSTRUCCIONES DE CONTEXTO ESTRICTO:
1. Tu fuente principal de verdad son las 'FUENTES' de abajo (especialmente la Lista de Precios).
2. Si te preguntan un precio, BÚSCALO en la tabla provista.
3. Si la tabla es grande, revisa con atención todas las filas.
4. ESTRUCTURA: NO uses tablas Markdown para la respuesta final. Usa listas claras (ej: "Producto: $Precio").
`.trim();
  } else {
    preamble = `
INSTRUCCIONES DE CONTEXTO HÍBRIDO:
Utiliza la siguiente información de contexto para enriquecer tu respuesta.
`.trim();
  }

  const contextString = contextParts.length > 0
    ? `${preamble}\n\n=== COMIENZO DE FUENTES (DATA REAL) ===\n${contextParts.join('\n')}\n=== FIN DE FUENTES ===\n`
    : (strictMode ? "ADVERTENCIA: No se cargaron documentos de contexto. Responde que no tienes información disponible." : "");

  return { contextString, usedDocIds };
};

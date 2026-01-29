
import { KnowledgeDocument } from '../types';
import { STATIC_DOCUMENTS } from '../data/staticKnowledge';

export const loadSystemKnowledge = async (url: string): Promise<KnowledgeDocument[]> => {
  // Si no hay URL configurada, devolvemos los estáticos inmediatamente
  if (!url || url.trim() === '') {
      console.log("⚠️ No Remote URL configured, using local defaults.");
      return STATIC_DOCUMENTS;
  }

  try {
    console.log(`📡 Intentando cargar base de conocimiento desde: ${url}`);
    
    // Timeout de 5 segundos
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    // Agregamos un timestamp para evitar cache agresivo si NO es jsDelivr
    // Si es jsDelivr, idealmente usamos la URL limpia, pero para desarrollo el timestamp ayuda.
    // Para producción con jsDelivr, el usuario debería manejar versiones en la URL.
    const fetchUrl = url.includes('jsdelivr') ? url : `${url}?t=${Date.now()}`;

    const response = await fetch(fetchUrl, { 
        signal: controller.signal,
        // 'no-cache' le dice al navegador que verifique con el servidor, 
        // pero jsDelivr ignorará esto si usa su propio cache interno.
        cache: 'no-cache' 
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();

    // Validación básica: Debe ser un array
    if (!Array.isArray(data)) {
        throw new Error('El formato del JSON remoto no es un array válido');
    }

    // Mapeo seguro para asegurar que tengan la flag isSystem
    const validDocs: KnowledgeDocument[] = data.map((doc: any) => ({
        id: doc.id || crypto.randomUUID(),
        title: doc.title || 'Documento Remoto',
        content: doc.content || '',
        addedAt: doc.addedAt || Date.now(),
        tokensEstimated: doc.tokensEstimated || Math.ceil((doc.content?.length || 0) / 4),
        isSystem: true // Forzamos que sean de sistema
    }));

    console.log(`✅ Base de conocimiento remota cargada: ${validDocs.length} documentos.`);
    return validDocs;

  } catch (error) {
    console.warn("⚠️ Falló la carga remota, usando base de datos local (Fallback).", error);
    // Si falla, devolvemos los estáticos que ya tenemos en el código
    return STATIC_DOCUMENTS;
  }
};

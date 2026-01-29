
import { KnowledgeDocument } from '../types';

/**
 * Detecta automáticamente el delimitador más probable (, o ;)
 */
const detectDelimiter = (text: string): string => {
    const firstLine = text.split('\n')[0];
    const commaCount = (firstLine.match(/,/g) || []).length;
    const semicolonCount = (firstLine.match(/;/g) || []).length;
    return semicolonCount > commaCount ? ';' : ',';
};

/**
 * Limpia caracteres invisibles como BOM (\uFEFF) y espacios extra
 */
const cleanStr = (str: string): string => {
    return str.trim().replace(/^\ufeff/, '').replace(/^"|"$/g, '');
};

const csvToMarkdownTable = (csvText: string): string => {
    if (!csvText || csvText.trim().length === 0) return '';

    const delimiter = detectDelimiter(csvText);
    console.log(`📊 CSV Loader: Detectado delimitador '${delimiter}'`);

    const lines = csvText.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length === 0) return '';

    // Procesar Encabezados
    let rawHeaders = lines[0].split(delimiter).map(cleanStr);
    
    // MAPEO INTELIGENTE: Normalizamos a minúsculas para comparar
    // Esto es CRUCIAL para que la IA entienda la columna 'DescripcionLargaBase' como 'Producto'
    const headerMap: Record<string, string> = {
        // Estructura Nueva
        'descripcionlargabase': 'Producto',
        'preciofinal': 'Precio',
        'listapresentacion': 'Presentación',
        'fechaactualizacion': 'Actualizado',
        'fracciones': 'Venta Fraccionada',
        
        // Casos borde (por si faltan comas o hay errores de tipeo en el CSV origen)
        'listapresentacionfechaactualizacion': 'Presentación/Fecha', 
        
        // Estructuras Viejas / Genericas
        'producto': 'Producto',
        'precio': 'Precio',
        'presentacion': 'Presentación',
        'marca': 'Marca',
        'rubro': 'Categoría'
    };

    const headers = rawHeaders.map(h => {
        // Quitamos espacios y pasamos a minusculas para buscar en el mapa
        const normalized = h.toLowerCase().replace(/[\s_.]+/g, '');
        return headerMap[normalized] || h; 
    });

    console.log("📊 CSV Loader: Headers procesados:", headers);

    // Crear tabla Markdown
    const separator = headers.map(() => '---');
    let md = `| ${headers.join(' | ')} |\n| ${separator.join(' | ')} |`;

    let rowCount = 0;
    
    for (let i = 1; i < lines.length; i++) {
        let cells: string[] = [];
        
        if (delimiter === ',') {
             // Regex para separar por comas pero ignorar las que están dentro de comillas
             // Ej: "Arroz, Gallo" -> Se mantiene junto
             cells = lines[i].split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(cleanStr);
        } else {
             cells = lines[i].split(';').map(cleanStr);
        }

        // Solo procesamos filas que tengan contenido real
        if (cells.length > 0 && cells.some(c => c !== '')) {
             // Rellenar huecos si la fila vino incompleta
             while (cells.length < headers.length) cells.push('-');
             
             // Asegurarnos de no tener más celdas que encabezados
             const safeCells = cells.slice(0, headers.length);
             
             md += `\n| ${safeCells.join(' | ')} |`;
             rowCount++;
        }
    }

    console.log(`📊 CSV Loader: ${rowCount} filas procesadas.`);
    return md;
};

export const fetchCsvKnowledge = async (url: string): Promise<KnowledgeDocument | null> => {
    if (!url || !url.includes('http')) return null;

    try {
        console.log(`fetching csv from: ${url}`);
        // Cache: 'no-cache' fuerza a buscar la versión nueva en Google Sheets
        const response = await fetch(url, { cache: 'no-cache' });
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const csvText = await response.text();
        const markdownContent = csvToMarkdownTable(csvText);

        if (!markdownContent) return null;

        return {
            id: 'sys-csv-dynamic',
            title: 'Base de Datos de Precios',
            content: `--- LISTA OFICIAL DE PRECIOS Y PRODUCTOS ---\nUsa esta tabla para responder consultas de precio.\n\n${markdownContent}`,
            addedAt: Date.now(),
            tokensEstimated: Math.ceil(markdownContent.length / 4),
            isSystem: true
        };

    } catch (error) {
        console.error("Error fetching CSV knowledge:", error);
        throw error;
    }
};

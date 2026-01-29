
export interface KnowledgeDocument {
  id: string;
  title: string;
  content: string;
  addedAt: number;
  tokensEstimated: number; // Estimación simple: caracteres / 4
  isSystem?: boolean; // TRUE si es un documento base (read-only), FALSE si es subido por el usuario
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
  isStreaming?: boolean;
  usedDocuments?: string[]; // IDs de documentos usados para esta respuesta
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface AppConfig {
  systemInstructions: string;
  model: string;
  thinkingBudget: number; // 0 para desactivar
  useSearchGrounding: boolean;
  strictMode: boolean; // TRUE: Solo usa documentos. FALSE: Usa conocimiento general si falta info.
  publicCsvUrl: string; // URL pública del CSV de Google Sheets (Publicar en la web)
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

export type Theme = 'light' | 'dark' | 'system';

// Model Constants
export const DEFAULT_MODEL = 'gemini-3-flash-preview';
export const REASONING_MODEL = 'gemini-3-pro-preview';

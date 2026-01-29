
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';
import { AppConfig } from '../types';

const CONFIG_COLLECTION = 'app_settings';
const CONFIG_DOC_ID = 'global_config';

export interface GlobalConfig {
  publicCsvUrl: string;
  systemPolicies: string;
  updatedAt: number;
  updatedBy: string;
}

/**
 * Obtiene la configuración global desde Firebase.
 * Si no existe, devuelve null (y la app usará los defaults hardcodeados).
 */
export const fetchGlobalConfig = async (): Promise<GlobalConfig | null> => {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data() as GlobalConfig;
    } else {
      console.log("No global config found in Firestore, using defaults.");
      return null;
    }
  } catch (error) {
    console.error("Error fetching global config:", error);
    return null;
  }
};

/**
 * Guarda la configuración global en Firebase.
 * Esto impactará a todos los usuarios.
 */
export const saveGlobalConfig = async (csvUrl: string, policies: string): Promise<void> => {
  try {
    const docRef = doc(db, CONFIG_COLLECTION, CONFIG_DOC_ID);
    const data: GlobalConfig = {
      publicCsvUrl: csvUrl,
      systemPolicies: policies,
      updatedAt: Date.now(),
      updatedBy: 'admin'
    };
    await setDoc(docRef, data, { merge: true });
    console.log("Global config saved successfully.");
  } catch (error) {
    console.error("Error saving global config:", error);
    throw error;
  }
};

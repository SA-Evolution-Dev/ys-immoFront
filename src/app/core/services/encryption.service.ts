import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  // Clé secrète - À stocker dans les variables d'environnement
  private readonly ENCRYPTION_KEY = this.generateSecretKey();
  
  constructor() {
    console.log('🔐 [ENCRYPTION SERVICE] Service initialisé');
  }

  /**
   * Générer une clé secrète basée sur des informations uniques
   * En production, utilisez une clé depuis vos variables d'environnement
   */
  private generateSecretKey(): string {
    // En production, récupérez depuis environment.encryptionKey
    const baseKey = environment.encryptionKey;
    const browserFingerprint = this.getBrowserFingerprint();
    return `${baseKey}-${browserFingerprint}`;
  }

  /**
   * Obtenir une empreinte unique du navigateur
   */
  private getBrowserFingerprint(): string {
    const navigator = window.navigator;
    const screen = window.screen;
    
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.colorDepth,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset()
    ].join('|');
    
    return CryptoJS.MD5(fingerprint).toString();
  }

  /**
   * Crypter une donnée
   */
  encrypt(data: string): string {
    try {
      if (!data) {
        console.warn('[ENCRYPTION] Données vides, pas de cryptage');
        return '';
      }

      const encrypted = CryptoJS.AES.encrypt(data, this.ENCRYPTION_KEY).toString();
      return encrypted;
    } catch (error) {
      console.error('[ENCRYPTION] Erreur lors du cryptage:', error);
      throw new Error('Échec du cryptage des données');
    }
  }

  /**
   * Décrypter une donnée
   */
  decrypt(encryptedData: string): string {
    try {
      if (!encryptedData) {
        console.warn('[ENCRYPTION] Données cryptées vides, pas de décryptage');
        return '';
      }

      const decrypted = CryptoJS.AES.decrypt(encryptedData, this.ENCRYPTION_KEY);
      const result = decrypted.toString(CryptoJS.enc.Utf8);
      
      if (!result) {
        console.error('[ENCRYPTION] Échec du décryptage - Clé incorrecte ou données corrompues');
        throw new Error('Échec du décryptage');
      }

      return result;
    } catch (error) {
      console.error('[ENCRYPTION] Erreur lors du décryptage:', error);
      throw new Error('Échec du décryptage des données');
    }
  }

  /**
   * Crypter un objet JSON
   */
  encryptObject(obj: any): string {
    try {
      const jsonString = JSON.stringify(obj);
      return this.encrypt(jsonString);
    } catch (error) {
      console.error('[ENCRYPTION] Erreur lors du cryptage de l\'objet:', error);
      throw new Error('Échec du cryptage de l\'objet');
    }
  }

  /**
   * Décrypter vers un objet JSON
   */
  decryptObject<T>(encryptedData: string): T | null {
    try {
      const decryptedString = this.decrypt(encryptedData);
      if (!decryptedString) return null;
      
      return JSON.parse(decryptedString) as T;
    } catch (error) {
      console.error('[ENCRYPTION] Erreur lors du décryptage de l\'objet:', error);
      return null;
    }
  }

  /**
   * Hasher une donnée (pour les mots de passe par exemple)
   */
  hash(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  /**
   * Générer un hash MD5
   */
  md5(data: string): string {
    return CryptoJS.MD5(data).toString();
  }

  /**
   * Crypter avec une clé personnalisée
   */
  encryptWithKey(data: string, customKey: string): string {
    try {
      return CryptoJS.AES.encrypt(data, customKey).toString();
    } catch (error) {
      console.error('[ENCRYPTION] Erreur lors du cryptage avec clé personnalisée:', error);
      throw error;
    }
  }

  /**
   * Décrypter avec une clé personnalisée
   */
  decryptWithKey(encryptedData: string, customKey: string): string {
    try {
      const decrypted = CryptoJS.AES.decrypt(encryptedData, customKey);
      return decrypted.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('[ENCRYPTION] Erreur lors du décryptage avec clé personnalisée:', error);
      throw error;
    }
  }
}

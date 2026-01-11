/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║  INTERFACE : Option pour le Multi-Select                                   ║
 * ║  OBJECTIF  : Définir la structure d'une option sélectionnable              ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
export interface MultiSelectOption {
  /** Valeur unique de l'option (envoyée au backend) */
  value: string | number;
  
  /** Texte affiché à l'utilisateur */
  label: string;
  
  /** Option désactivée (grisée, non cliquable) */
  disabled?: boolean;
  
  /** Icône optionnelle (classe Font Awesome) */
  icon?: string;
  
  /** Couleur du badge (classe Phoenix : primary, success, danger, etc.) */
  badgeColor?: string;
}

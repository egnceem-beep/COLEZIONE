
export interface CarModel {
  id: string;
  Anno: string;
  "Marca della macchina": string;
  Modello: string;
  Colore: string;
  Tipo: string;
  Piloti: string;
  Materiale: string;
  "Marca dello modellino": string;
  Numero: string;
  Pilota: string;
  Tema: string;
  Colezione: string;
  Fascicolo: string;
  Codice: string;
  Scala: string;
  Stato: string;
  Osservazione: string;
  imageUrl?: string;
}

export type ViewType = 'collection' | 'import' | 'reports';

export const ITALIAN_LABELS: (keyof Omit<CarModel, 'id' | 'imageUrl'>)[] = [
  "Anno",
  "Marca della macchina",
  "Modello",
  "Colore",
  "Tipo",
  "Piloti",
  "Materiale",
  "Marca dello modellino",
  "Numero",
  "Pilota",
  "Tema",
  "Colezione",
  "Fascicolo",
  "Codice",
  "Scala",
  "Stato",
  "Osservazione"
];

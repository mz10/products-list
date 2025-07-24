export interface Game {
    shortcut: string;
    name: string;
    loaded?: boolean;
    imgCount?: number;
    handTranslation?: boolean;
    completeEdited?: boolean;
    version?: string;
    numDl?: boolean;
    changed?: Date;
    added?: Date;
    autors?: string;
    autor?: number;
    rank?: number;
    category: number;
    size: number;
    hiddenWeb: boolean;
    translationType: Number;
}

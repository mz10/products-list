export const gameState = ["*", "Funkční", "Nefunkční", "V přípravě", "Zrušeno"];
export const interest = ["*", "Indie", "Indie", "Menší", "Menší", "Střední", "Střední", "Velká", "Velká", "Hype", "Hype"];
export const category = ["*",
    "Akční", "RPG", "Adventura", "Strategie", "Závodní", "Simulace", "Sportovní", 
    "Online RPG", "Online akční", "Plošinovka", "Skákačka", "Bojová", "Jiná", "Erotická", "Online",
    "Střílečka", "FPS", "Arkáda", "Horor", "Stealth", "Survival", "Interaktivní film", "Vizuální román", "Detektivní", 
    "Logická", "Tahová", "Budovatelská", "Taktická", "Tower Defence", "Dětská", "Virtuálni realita"
];
export const gameSorting = ["*", "Počet stažení", "Datum aktualizace", "Datum přidání", "Pořadí", "A-Z", "Z-A"];

export const gameGraphics = ["*", "Ray-Tracing", "Skutečná", "Temná", "Komixová", "Kreslená", "Anime", "Pixel Art", "Retro"];
export const gameAngle = ["*", "3D", "FPS", "3. osoba", "Z vrchu (3D)", "Z vrchu (2D)", "2D"];

export const interestObj = {
    "*": 0,
    "Indie": 2,
    "Menší": 4,
    "Střední": 6,
    "Velká": 8,
    "Hype": 10
}

export const sections = {
    "hry-info": "Popis hry",
    "navody": "Návody",
    "ai-preklad": "AI překlad",
    "rucni-preklad": "Ruční překlad",
    "hry": "Hry",
    "mody": "Módy",
    
    "novinky": "Novinky",
    "pc": "Počítače",
    "zajimavosti": "Zajímavosti",
    "info": "Informace",
    "ostatni": "Ostatní",
}

export const translationType = {
    "*": 0,
    "AI bez editací": 1,
    "Editovaný překlad": 2,
    "Zcela editovaný": 3,
    "Ruční překlad": 4,
    "KP Překladač": 5,
}

export const showHidden = {
    "*": 0,
    "I skryté": 1,
    "Jen skryté": 2,
}
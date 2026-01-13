export interface Quartier {
  value: string;
  label: string;
  category: string;
}

export const VILLES_QUARTIERS: Record<string, Quartier[]> = {
  abidjan: [
    // COCODY (Quartiers résidentiels et huppés)
    { value: 'cocody riviera 3', label: 'Cocody - Riviera 3', category: 'Cocody' },
    { value: 'cocody riviera 2', label: 'Cocody - Riviera 2', category: 'Cocody' },
    { value: 'cocody deux-plateaux', label: 'Cocody - Deux Plateaux', category: 'Cocody' },
    { value: 'cocody angre', label: 'Cocody - Angré', category: 'Cocody' },
    { value: 'cocody blockhaus', label: 'Cocody - Blockhaus', category: 'Cocody' },
    { value: 'cocody 7eme tranche', label: 'Cocody - 7ème Tranche', category: 'Cocody' },
    { value: 'cocody ambassades', label: 'Cocody - Quartier des Ambassades', category: 'Cocody' },
    { value: 'cocody faya', label: 'Cocody - Faya', category: 'Cocody' },
    { value: 'cocody danga', label: 'Cocody - Danga', category: 'Cocody' },
    { value: 'cocody vallon', label: 'Cocody - Vallon', category: 'Cocody' },
    { value: 'cocody mbadon', label: 'Cocody - M\'Badon', category: 'Cocody' },
    { value: 'cocody mermoz', label: 'Cocody - Mermoz', category: 'Cocody' },
    { value: 'cocody attoban', label: 'Cocody - Attoban', category: 'Cocody' },
    { value: 'cocody bonoumin', label: 'Cocody - Bonoumin', category: 'Cocody' },

    // YOPOUGON (Zone populaire et résidentielle)
    { value: 'yopougon niangon', label: 'Yopougon - Niangon', category: 'Yopougon' },
    { value: 'yopougon selmer', label: 'Yopougon - Selmer', category: 'Yopougon' },
    { value: 'yopougon sicogi', label: 'Yopougon - SICOGI', category: 'Yopougon' },
    { value: 'yopougon ananeraie', label: 'Yopougon - Ananeraie', category: 'Yopougon' },
    { value: 'yopougon toits-rouges', label: 'Yopougon - Toits Rouges', category: 'Yopougon' },
    { value: 'yopougon mamie-adjoua', label: 'Yopougon - Mamie Adjoua', category: 'Yopougon' },
    { value: 'yopougon niangon-nord', label: 'Yopougon - Niangon Nord', category: 'Yopougon' },
    { value: 'yopougon niangon-sud', label: 'Yopougon - Niangon Sud', category: 'Yopougon' },
    { value: 'yopougon port', label: 'Yopougon - Port', category: 'Yopougon' },
    { value: 'yopougon sogefiha', label: 'Yopougon - Sogefiha', category: 'Yopougon' },
    { value: 'yopougon wassakara', label: 'Yopougon - Wassakara', category: 'Yopougon' },

    // ABOBO (Zone populaire)
    { value: 'abobo pk18', label: 'Abobo - PK18', category: 'Abobo' },
    { value: 'abobo anador', label: 'Abobo - Anador', category: 'Abobo' },
    { value: 'abobo avocatier', label: 'Abobo - Avocatier', category: 'Abobo' },
    { value: 'abobo baule', label: 'Abobo - Baoulé', category: 'Abobo' },
    { value: 'abobo sagbe', label: 'Abobo - Sagbé', category: 'Abobo' },
    { value: 'abobo banco2', label: 'Abobo - Banco 2', category: 'Abobo' },
    { value: 'abobo te', label: 'Abobo - Té', category: 'Abobo' },
    { value: 'abobo derriere-rails', label: 'Abobo - Derrière Rails', category: 'Abobo' },
    { value: 'abobo gare', label: 'Abobo - Gare', category: 'Abobo' },
    { value: 'abobo dokui', label: 'Abobo - Dokoui', category: 'Abobo' },

    // PLATEAU (Centre des affaires)
    { value: 'plateau centre', label: 'Plateau - Centre', category: 'Plateau' },
    { value: 'plateau zone1', label: 'Plateau - Zone 1', category: 'Plateau' },
    { value: 'plateau zone2', label: 'Plateau - Zone 2', category: 'Plateau' },
    { value: 'plateau zone3', label: 'Plateau - Zone 3', category: 'Plateau' },
    { value: 'plateau zone4', label: 'Plateau - Zone 4', category: 'Plateau' },

    // MARCORY (Zone mixte)
    { value: 'marcory zone3', label: 'Marcory - Zone 3', category: 'Marcory' },
    { value: 'marcory zone4', label: 'Marcory - Zone 4', category: 'Marcory' },
    { value: 'marcory remblais', label: 'Marcory - Remblais', category: 'Marcory' },
    { value: 'marcory biafra', label: 'Marcory - Biafra', category: 'Marcory' },
    { value: 'marcory anoumabo', label: 'Marcory - Anoumabo', category: 'Marcory' },
    { value: 'marcory gendarmerie', label: 'Marcory - Gendarmerie', category: 'Marcory' },

    // TREICHVILLE (Zone populaire et commerciale)
    { value: 'treichville zone1', label: 'Treichville - Zone 1', category: 'Treichville' },
    { value: 'treichville zone2', label: 'Treichville - Zone 2', category: 'Treichville' },
    { value: 'treichville zone3', label: 'Treichville - Zone 3', category: 'Treichville' },
    { value: 'treichville zone4', label: 'Treichville - Zone 4', category: 'Treichville' },
    { value: 'treichville arras', label: 'Treichville - Arras', category: 'Treichville' },
    { value: 'treichville vridi', label: 'Treichville - Vridi', category: 'Treichville' },

    // KOUMASSI (Zone industrielle et résidentielle)
    { value: 'koumassi grand-campement', label: 'Koumassi - Grand Campement', category: 'Koumassi' },
    { value: 'koumassi remblais', label: 'Koumassi - Remblais', category: 'Koumassi' },
    { value: 'koumassi zone-industrielle', label: 'Koumassi - Zone Industrielle', category: 'Koumassi' },
    { value: 'koumassi sicogi', label: 'Koumassi - SICOGI', category: 'Koumassi' },
    { value: 'koumassi cite-douane', label: 'Koumassi - Cité Douane', category: 'Koumassi' },

    // PORT-BOUËT (Zone côtière)
    { value: 'port-bouet vridi', label: 'Port-Bouët - Vridi', category: 'Port-Bouët' },
    { value: 'port-bouet cite-phare', label: 'Port-Bouët - Cité du Phare', category: 'Port-Bouët' },
    { value: 'port-bouet gonzagueville', label: 'Port-Bouët - Gonzagueville', category: 'Port-Bouët' },
    { value: 'port-bouet aeroport', label: 'Port-Bouët - Aéroport', category: 'Port-Bouët' },
    { value: 'port-bouet petit-bassam', label: 'Port-Bouët - Petit Bassam', category: 'Port-Bouët' },

    // ATTÉCOUBÉ (Zone mixte)
    { value: 'attecoube akeikoi', label: 'Attécoubé - Akéikoi', category: 'Attécoubé' },
    { value: 'attecoube locodjoro', label: 'Attécoubé - Locodjoro', category: 'Attécoubé' },
    { value: 'attecoube sagbe', label: 'Attécoubé - Sagbé', category: 'Attécoubé' },
    { value: 'attecoube banco', label: 'Attécoubé - Banco', category: 'Attécoubé' },

    // ADJAMÉ (Zone commerciale)
    { value: 'adjame 220-logements', label: 'Adjamé - 220 Logements', category: 'Adjamé' },
    { value: 'adjame liberty', label: 'Adjamé - Liberté', category: 'Adjamé' },
    { value: 'adjame bracodi', label: 'Adjamé - Bracodi', category: 'Adjamé' },
    { value: 'adjame williamsville', label: 'Adjamé - Williamsville', category: 'Adjamé' },
    { value: 'adjame sogefiha', label: 'Adjamé - Sogefiha', category: 'Adjamé' },

    // SONGON (Zone périphérique)
    { value: 'songon gbagbe', label: 'Songon - Gbagbé', category: 'Songon' },
    { value: 'songon mbrago', label: 'Songon - M\'Brago', category: 'Songon' },
    { value: 'songon yaosse', label: 'Songon - Yaossé', category: 'Songon' },

    // BINGERVILLE (Ville satellite)
    { value: 'bingerville centre', label: 'Bingerville - Centre', category: 'Bingerville' },
    { value: 'bingerville nouveau-quartier', label: 'Bingerville - Nouveau Quartier', category: 'Bingerville' },

    // ANYAMA (Ville satellite)
    { value: 'anyama centre', label: 'Anyama - Centre', category: 'Anyama' },
    { value: 'anyama nouveau-quartier', label: 'Anyama - Nouveau Quartier', category: 'Anyama' }
  ],
  yamoussoukro: [
    { value: 'centre', label: 'Centre-ville', category: 'centre' }
  ]
};

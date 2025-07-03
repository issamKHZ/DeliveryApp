
import { Sieges } from "../modele/entreprise/Sieges";

export const secteursList: { label: string, code: string }[] = [
    { "code": "logistique", "label": "Transport et logistique" },
    { "code": "ecommerce", "label": "E-commerce" },
    { "code": "restauration", "label": "Restauration" },
    { "code": "sante", "label": "Santé / Pharmaceutique" },
    { "code": "agroalimentaire", "label": "Agroalimentaire" },
    { "code": "distribution", "label": "Distribution de colis" },
    { "code": "commerce", "label": "Commerce de détail" },
    { "code": "fleurs", "label": "Fleurs et cadeaux" },
    { "code": "meubles", "label": "Meubles et électroménagers" },
    { "code": "materiaux", "label": "Matériaux de construction" },
    { "code": "electronique", "label": "Produits électroniques" },
    { "code": "coursiers", "label": "Services de coursiers express" },
    { "code": "carburant", "label": "Carburant / Gaz" },
    { "code": "demenagement", "label": "Déménagement" },
    { "code": "postaux", "label": "Services postaux" },
    { "code": "textile", "label": "Textile / Habillement" },
    { "code": "blanchisserie", "label": "Blanchisserie / Pressing" },
    { "code": "agricole", "label": "Produits agricoles" },
    { "code": "cosmetiques", "label": "Beauté / Cosmétiques" },
    { "code": "marketplace", "label": "Marketplaces locales" }
];

export const SiegesTypes: { code: string, label: string }[] = [
    { "code": "magasin", "label": "Magasin de vente" },
    { "code": "entrepot", "label": "Entrepôt logistique" },
    { "code": "atelier", "label": "Atelier de fabrication" },
    { "code": "boutique_en_ligne", "label": "Boutique en ligne (e-commerce)" },
    { "code": "restaurant", "label": "Restaurant / Fast-food" },
    { "code": "point_retrait", "label": "Point de retrait / Click & Collect" },
    { "code": "plateforme_logistique", "label": "Plateforme logistique" }
];

export const SiegesStatus: { code: string, label: string}[] = [
    { "code": "ACT", "label": "En service" },
    { "code": "MTN", "label": "En maintenance" },
    { "code": "CLSDT", "label": "Fermé temp" },
    
];


export const siegesList: Sieges[] = [
    new Sieges({
        id: '1',
        type: SiegesTypes[0],
        adresse: '123 Rue du Commerce',
        villePays: 'Paris, France',
        status: {label: 'En service', code: 'ACT'},
        email: 'magasin1@example.com',
        phone: '+33 1 23 45 67 89',
        editStorage: false,
        isDest: false
    }),
    new Sieges({
        id: '2',
        type: SiegesTypes[1],
        adresse: '456 Avenue des Entrepôts',
        villePays: 'Lyon, France',
        status: {label: 'En service', code: 'ACT'},
        email: 'entrepot@example.com',
        phone: '+33 1 23 45 67 89',
        editStorage: false,
        isDest: true
    }),
    new Sieges({
        id: '3',
        type: SiegesTypes[2],
        adresse: '789 Rue Industrielle',
        villePays: 'Marseille, France',
        status: {label: 'En maintenance', code: 'MTN'},
        email: 'atelier@example.com',
        phone: '+33 1 23 45 67 89',
        editStorage: false,
        isDest: false
    }),
    new Sieges({
        id: '4',
        type: SiegesTypes[3],
        adresse: '1010 Web Avenue',
        villePays: 'Remote, International',
        status: {label: 'En service', code: 'ACT'},
        email: 'ecommerce@example.com',
        phone: '+33 1 23 45 67 89',
        editStorage: false,
        isDest: false
    }),
    new Sieges({
        id: '5',
        type: SiegesTypes[4],
        adresse: '2020 Food Street',
        villePays: 'Nice, France',
        status: {label: 'Fermé temp', code: 'CLSDT'},
        email: 'restaurant@example.com',
        phone: '+33 1 23 45 67 89',
        editStorage: false,
        isDest: false
    }),
    new Sieges({
        id: '6',
        type: SiegesTypes[5],
        adresse: '3030 Pickup Road',
        villePays: 'Toulouse, France',
        status: {label: 'En maintenance', code: 'MTN'},
        email: 'pickup@example.com',
        phone: '+33 1 23 45 67 89',
        editStorage: false,
        isDest: true
    })
];

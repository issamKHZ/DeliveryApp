
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

export enum RoutesEnum {

    /* Authentification */
    AUTH = "auth",
    LOGIN = "login",
    REGISTER = "register",
    OPTIONS = 'options',

    /* les pages de validations */
    VALIDATION = "validation",
    MAIL = "mail",    

    /* Principal routes */
    ENTREPRISE = "entreprise",
    LIVREUR = "livreur",    
    PROFILE_ENTREPRISE = "profile/entreprise",
    PROFILE_LIVREUR = "profile/livreur",

    

    /* ENTREPRISE routes */
    LIVREURS = "livreurs",

    /* LIVREUR routes */
    POSTULER = "postuler",
    EN_COURS = "en-cours",

    /* COMMUN routes */
    ORDERS = "orders",
    DISCUSSION = "discussion",

    /* Profile routes */
    GENERAL ="general",
    ADMINISTRAIF = "administratif",
    SIEGES = "sieges",
    STATISTICS = "statistics",
    SETTINGS = "settings",
    PREFERENCES = "preferences",
    NOTIFICATIONS = "notifications",
    NOTALLOWED = "notallowed",

    PERSO = "personel",
    DISPO = "disponibility",
    HISTORICS = "historics",
    EVAL = "eval",


    ERROR = "error",
    TEST = "test",

    /* PAGES CONTENT ENTREPRISE */
    COMMADES = "commandes"

}
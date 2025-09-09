// Entreprise profile side bar tabs

import { TranslateService } from "@ngx-translate/core";
import { CommonService } from "../services/utils/common.service";
import { RoutesEnum } from "../modele/enumerate/routes";

export const createEntrepSideBarTabs = (translate: TranslateService, tabsCodes: any, commonService: CommonService) => [
    {
        label: translate.instant('app.profil.entreprise.side-bar.tabs.general'),
        icon: "pi pi-list",
        route: commonService.composeRoute([RoutesEnum.PROFILE_ENTREPRISE, RoutesEnum.GENERAL]),        
        code: tabsCodes.GENERAL
      },
      {
        label: translate.instant('app.profil.entreprise.side-bar.tabs.admin'),
        icon: "pi pi-building-columns",
        route: commonService.composeRoute([RoutesEnum.PROFILE_ENTREPRISE, RoutesEnum.ADMINISTRAIF]),
        code: tabsCodes.ADMIN
      },
      {
        label: translate.instant('app.profil.entreprise.side-bar.tabs.sieges'),
        icon: "pi pi-map-marker",
        route: commonService.composeRoute([RoutesEnum.PROFILE_ENTREPRISE, RoutesEnum.SIEGES]), 
        code: tabsCodes.SIEGES
      },
      {
        label: translate.instant('app.profil.entreprise.side-bar.tabs.notifications'),
        icon: "pi pi-bell",
        route: commonService.composeRoute([RoutesEnum.PROFILE_ENTREPRISE, RoutesEnum.NOTIFICATIONS]), 
        code: tabsCodes.NOTIF
      },
      {
        label: translate.instant('app.profil.entreprise.side-bar.tabs.statistic'),
        icon: "pi pi-chart-bar",
        route: commonService.composeRoute([RoutesEnum.PROFILE_ENTREPRISE, RoutesEnum.STATISTICS]), 
        code: tabsCodes.STATISTIC
      },
      {
        label: translate.instant('app.profil.entreprise.side-bar.tabs.preferences'),
        icon: "pi pi-star",
        route: commonService.composeRoute([RoutesEnum.PROFILE_ENTREPRISE, RoutesEnum.PREFERENCES]), 
        code: tabsCodes.PREFERENCES
      },
      {
        label: translate.instant('app.profil.entreprise.side-bar.tabs.settings'),
        icon: "pi pi-wrench",
        route: commonService.composeRoute([RoutesEnum.PROFILE_ENTREPRISE, RoutesEnum.SETTINGS]), 
        code: tabsCodes.SETTINGS
      }
];

export const createLivreurSideBarTabs = (translate: TranslateService, tabsCodes: any, commonService: CommonService) => [
    {
        label: translate.instant('app.profil.livreur.side-bar.tabs.perso'),
        icon: "pi pi-list",
        route: commonService.composeRoute([RoutesEnum.PROFILE_LIVREUR, RoutesEnum.PERSO]),
        code: tabsCodes.PERSO
    },
    {
        label: translate.instant('app.profil.livreur.side-bar.tabs.dispo'),
        icon: "pi pi-calendar",
        route: commonService.composeRoute([RoutesEnum.PROFILE_LIVREUR, RoutesEnum.DISPO]),
        code: tabsCodes.DISPO
    },
    {
        label: translate.instant('app.profil.livreur.side-bar.tabs.statistics'),
        icon: "pi pi-chart-bar",
        route: commonService.composeRoute([RoutesEnum.PROFILE_LIVREUR, RoutesEnum.STATISTICS]),
        code: tabsCodes.STATS
    },
    {
        label: translate.instant('app.profil.livreur.side-bar.tabs.notif'),
        icon: "pi pi-bell",
        route: commonService.composeRoute([RoutesEnum.PROFILE_LIVREUR, RoutesEnum.NOTIFICATIONS]),
        code: tabsCodes.NOTIF
    },
    {
        label: translate.instant('app.profil.livreur.side-bar.tabs.historics'),
        icon: "pi pi-history",
        route: commonService.composeRoute([RoutesEnum.PROFILE_LIVREUR, RoutesEnum.HISTORICS]),
        code: tabsCodes.HISTO
    },
    {
        label: translate.instant('app.profil.livreur.side-bar.tabs.eval'),
        icon: "pi pi-star",
        route: commonService.composeRoute([RoutesEnum.PROFILE_LIVREUR, RoutesEnum.EVAL]),
        code: tabsCodes.EVAL
    },
    {
        label: translate.instant('app.profil.livreur.side-bar.tabs.settings'),
        icon: "pi pi-wrench",
        route: commonService.composeRoute([RoutesEnum.PROFILE_LIVREUR, RoutesEnum.SETTINGS]),
        code: tabsCodes.SETTINGS
    }
];
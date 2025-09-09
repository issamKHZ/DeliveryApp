import { Routes } from '@angular/router';
import { RoutesEnum } from './shared/modele/enumerate/routes';
import { ComponentsKeyEnum } from './shared/modele/enumerate/ComponentsKey';
import { NoAuthGuard } from './shared/guards/no-auth.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { HomeRedirectGuard } from './shared/guards/home-redirect.guard';
import { EntrepriseProfileResolver } from './shared/resolvers/profile.entreprise.resolver';
import { LivreurProfileResolver } from './shared/resolvers/Livreur/profile.livreur.resolver';
import { profileStatusEntrepGuard } from './shared/guards/profile.status.entrep.guard';
import { profileStatusLivGuard } from './shared/guards/profile.status.liv.guard';
import { DisponibilityResolver } from './shared/resolvers/Livreur/disponibility.resolver';


const routesEndpoints = RoutesEnum;

enum ComposedRoutes {
    VALIDATION_EMAIL = "validation/mail",
    PROFILE_ENTREPRISE = "profile/entreprise",
    ENTREPRISE_COMMANDES = "entreprise/commandes"
}

export const routes: Routes = [
    {
        path: '',
        canActivate: [HomeRedirectGuard],
        loadComponent: () =>
            import('./shared/components/utils/empty/empty.component').then(m => m.EmptyComponent)
    },

    {
        path: routesEndpoints.AUTH,
        loadComponent: () =>
            import('./content/auth/auth.component').then(m => m.AuthComponent),
        canActivate: [NoAuthGuard],
        children: [
            {
                path: routesEndpoints.LOGIN,
                loadComponent: () =>
                    import('./content/auth/login/login.component').then(m => m.LoginComponent),
                data: { id: routesEndpoints.LOGIN }
            },
            {
                path: routesEndpoints.REGISTER,
                loadComponent: () =>
                    import('./content/auth/register/register.component').then(m => m.RegisterComponent),
                children: [
                    {
                        path: routesEndpoints.OPTIONS,
                        loadComponent: () =>
                            import('./shared/components/register/register-options/register-options.component').then(m => m.RegisterOptionsComponent),
                    },
                    {
                        path: routesEndpoints.ENTREPRISE,
                        loadComponent: () =>
                            import('./shared/components/register/register-entreprise/register-entreprise.component').then(m => m.RegisterEntrepriseComponent),
                    },
                    {
                        path: routesEndpoints.LIVREUR,
                        loadComponent: () =>
                            import('./shared/components/register/register-livreur/register-livreur.component').then(m => m.RegisterLivreurComponent),
                    },
                    { path: '', redirectTo: routesEndpoints.OPTIONS, pathMatch: 'full' }
                ]
            },
            { path: '*', redirectTo: routesEndpoints.LOGIN, pathMatch: 'full' },
            { path: '', redirectTo: routesEndpoints.LOGIN, pathMatch: 'full' }
        ]
    },
    {
        path: ComposedRoutes.VALIDATION_EMAIL,
        loadComponent: () =>
            import('./shared/components/email-validation/email-validation.component').then(m => m.EmailValidationComponent),
        canActivate: [NoAuthGuard]
    },
    {
        path: routesEndpoints.PROFILE_ENTREPRISE,
        loadComponent: () =>
            import('./content/profile/profil-entreprise/profil-entreprise.component').then(m => m.ProfilEntrepriseComponent),
        canActivate: [AuthGuard],
        resolve: {
            profile: EntrepriseProfileResolver,            
        },
        children: [
            {
                path: routesEndpoints.GENERAL,
                loadComponent: () =>
                    import('./shared/components/profiles/entreprise/general/general.component').then(m => m.GeneralComponent),
            },
            {
                path: routesEndpoints.ADMINISTRAIF,
                loadComponent: () =>
                    import('./shared/components/profiles/entreprise/info-administratif/info-administratif.component').then(m => m.InfoAdministratifComponent),
            },
            {
                path: routesEndpoints.SIEGES,
                loadComponent: () =>
                    import('./shared/components/profiles/entreprise/sites-coordinates/sites-coordinates.component').then(m => m.SitesCoordinatesComponent),
                canActivate: [profileStatusEntrepGuard]
            },
            {
                path: routesEndpoints.STATISTICS,
                loadComponent: () =>
                    import('./shared/components/profiles/entreprise/statistics-histo/statistics-histo.component').then(m => m.StatisticsHistoComponent),
                canActivate: [profileStatusEntrepGuard]
            },
            {
                path: routesEndpoints.PREFERENCES,
                loadComponent: () =>
                    import('./shared/components/profiles/entreprise/preferencies/preferencies.component').then(m => m.PreferenciesComponent),
                canActivate: [profileStatusEntrepGuard]
            },
            {
                path: routesEndpoints.NOTIFICATIONS,
                loadComponent: () =>
                    import('./shared/components/profiles/notifications-page/notifications-page.component').then(m => m.NotificationsPageComponent),
                canActivate: [profileStatusEntrepGuard]
            },
            {
                path: routesEndpoints.SETTINGS,
                loadComponent: () =>
                    import('./shared/components/profiles/entreprise/settings/settings.component').then(m => m.SettingsComponent),
                canActivate: [profileStatusEntrepGuard]
            },
            {
                path: routesEndpoints.NOTALLOWED,
                loadComponent: () =>
                    import('./shared/components/profiles/profile-not-accessible/profile-not-accessible.component').then(m => m.ProfileNotAccessibleComponent),
            },
            {
                path: '**',
                redirectTo: routesEndpoints.GENERAL,
                pathMatch: 'full'
            }
        ],
        data: { component: ComponentsKeyEnum.ENTREPRISE_PROFILE }
    },
    {
        path: routesEndpoints.PROFILE_LIVREUR,
        loadComponent: () =>
            import('./content/profile/profil-livreur/profil-livreur.component').then(m => m.ProfilLivreurComponent),
        canActivate: [AuthGuard],
        resolve: {
            profile: LivreurProfileResolver
        },
        children: [
            {
                path: routesEndpoints.PERSO,
                loadComponent: () =>
                    import('./shared/components/profiles/livreur/info-perso/info-perso.component').then(m => m.InfoPersoComponent),
            },
            {
                path: routesEndpoints.DISPO,
                loadComponent: () =>
                    import('./shared/components/profiles/livreur/disponibility/disponibility.component').then(m => m.DisponibilityComponent),
                canActivate: [profileStatusLivGuard],
                resolve: {
                    disponibility: DisponibilityResolver
                }
            },
            {
                path: routesEndpoints.STATISTICS,
                loadComponent: () =>
                    import('./shared/components/profiles/livreur/statistics/statistics.component').then(m => m.StatisticsComponent),
                canActivate: [profileStatusLivGuard]
            },
            {
                path: routesEndpoints.NOTIFICATIONS,
                loadComponent: () =>
                    import('./shared/components/profiles/notifications-page/notifications-page.component').then(m => m.NotificationsPageComponent),
                canActivate: [profileStatusLivGuard]
            },
            {
                path: routesEndpoints.HISTORICS,
                loadComponent: () =>
                    import('./shared/components/profiles/livreur/historics/historics.component').then(m => m.HistoricsComponent),
                canActivate: [profileStatusLivGuard]
            },
            {
                path: routesEndpoints.EVAL,
                loadComponent: () =>
                    import('./shared/components/profiles/livreur/evaluations/evaluations.component').then(m => m.EvaluationsComponent),
                canActivate: [profileStatusLivGuard]
            },
            {
                path: routesEndpoints.SETTINGS,
                loadComponent: () =>
                    import('./shared/components/profiles/livreur/settings/settings.component').then(m => m.SettingsComponent),
                canActivate: [profileStatusLivGuard]
            },
            {
                path: routesEndpoints.NOTALLOWED,
                loadComponent: () =>
                    import('./shared/components/profiles/profile-not-accessible/profile-not-accessible.component').then(m => m.ProfileNotAccessibleComponent),
            },
            {
                path: '**',
                redirectTo: routesEndpoints.PERSO,
                pathMatch: 'full'
            }
        ],
        data: { component: ComponentsKeyEnum.LIVREUR_PROFILE }
    },

    {
        path: ComposedRoutes.ENTREPRISE_COMMANDES,
        loadComponent: () => 
            import('./content/Entreprise/commandes.entreprise/commandes.entreprise.component').then(m => m.CommandesEntrepriseComponent),
    },

    {
        path: routesEndpoints.ERROR,
        loadComponent: () =>
            import('./content/error/error.component').then(m => m.ErrorComponent),
    },

    {
        path: '**',
        redirectTo: routesEndpoints.ERROR,
        pathMatch: 'full'
    },
];

import { Routes } from '@angular/router';
import { RoutesEnum } from './shared/modele/enumerate/routes';
import { ComponentsKeyEnum } from './shared/modele/enumerate/ComponentsKey';
import { NoAuthGuard } from './shared/guards/no-auth.guard';
import { AuthGuard } from './shared/guards/auth.guard';
import { HomeRedirectGuard } from './shared/guards/home-redirect.guard';


const routesEndpoints = RoutesEnum;

enum ComposedRoutes {
    VALIDATION_EMAIL = "validation/mail",
    PROFILE_ENTREPRISE = "profile/entreprise"
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
            },
            {
                path: routesEndpoints.STATISTICS,
                loadComponent: () =>
                    import('./shared/components/profiles/entreprise/statistics-histo/statistics-histo.component').then(m => m.StatisticsHistoComponent),
            },
            {
                path: routesEndpoints.PREFERENCES,
                loadComponent: () =>
                    import('./shared/components/profiles/entreprise/preferencies/preferencies.component').then(m => m.PreferenciesComponent),
            },
            {
                path: routesEndpoints.NOTIFICATIONS,
                loadComponent: () =>
                    import('./shared/components/profiles/notifications-page/notifications-page.component').then(m => m.NotificationsPageComponent),
            },
            {
                path: routesEndpoints.SETTINGS,
                loadComponent: () =>
                    import('./shared/components/profiles/entreprise/settings/settings.component').then(m => m.SettingsComponent),
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
        children: [

        ],
        data: { component: ComponentsKeyEnum.LIVREUR_PROFILE }
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

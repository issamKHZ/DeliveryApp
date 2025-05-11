import { Routes } from '@angular/router';
import { RoutesEnum } from './shared/modele/enumerate/routes';

const routesEndpoints = RoutesEnum;

export const routes: Routes = [
    {
        path: '',
        redirectTo: routesEndpoints.TEST,
        pathMatch: 'full'        
    },

    {
        path: routesEndpoints.AUTH,
        loadComponent: () =>
            import('./content/auth/auth.component').then(m => m.AuthComponent),  
        children: [
            {
              path: routesEndpoints.LOGIN,
              loadComponent: () =>
                import('./content/auth/login/login.component').then(m => m.LoginComponent),   
              data: {id: routesEndpoints.LOGIN}           
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
        path: routesEndpoints.TEST,
        loadComponent: () =>
                          import('./shared/components/email-validation/email-validation.component').then(m => m.EmailValidationComponent),                                      
    },

    {
        path: '**',
        redirectTo: routesEndpoints.AUTH,
        pathMatch: 'full'  
    },
];

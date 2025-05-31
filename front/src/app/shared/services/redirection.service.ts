import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { UserRoles } from '../modele/enumerate/userRoles';
import { RoutesEnum } from '../modele/enumerate/routes';

@Injectable({
  providedIn: 'root'
})
export class RedirectionService {

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  
}

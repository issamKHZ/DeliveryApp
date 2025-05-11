import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly SESSION_USER_KEY = 'currentUser';

  login(username: string, password: string): boolean {
    if (username === 'admin' && password === 'admin') {
      const user = { username, role: 'admin' };
      sessionStorage.setItem(this.SESSION_USER_KEY, JSON.stringify(user));
      return true;
    }
    return false;
  }

  logout(): void {
    sessionStorage.removeItem(this.SESSION_USER_KEY);
  }

  getCurrentUser(): any {
    const userJson = sessionStorage.getItem(this.SESSION_USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getCurrentUser();
  }
}

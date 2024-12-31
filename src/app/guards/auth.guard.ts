import { Injectable } from '@angular/core';
import { CanMatch, Router } from '@angular/router';
import { UserService } from '../services/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanMatch {
  constructor(private userService: UserService, private router: Router) { }

  async canMatch(): Promise<boolean> {
    console.log("AuthGuard");

    const isAuthenticated = await this.userService.isAuthenticated()
    if (!isAuthenticated) {
      this.router.navigateByUrl('/auth', { replaceUrl: true });
    }
    else {
      await this.userService.setLoginInfo()
    }
    return isAuthenticated

  }
}

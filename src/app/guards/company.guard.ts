import { Injectable } from '@angular/core';
import { CanMatch, Router } from '@angular/router';
import { UserService } from '../services/user/user.service';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CompanyGuard implements CanMatch {
  constructor(private loadingController: LoadingController, private userService: UserService, private router: Router) { }

  async canMatch(): Promise<boolean> {

    let loading;
    try {
      loading = await this.loadingController.create({
        message: 'Cargando datos...',
      });

      loading.present();
      await this.userService.SetCompany()
      return true
    } catch (error) {
      this.router.navigateByUrl('/login', { replaceUrl: true });
      return false
    } finally {
      if (loading)
        loading.dismiss()

    }

  }
}

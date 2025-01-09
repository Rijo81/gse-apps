import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'segments',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule)

  },

  {
    path: 'segments',
    loadComponent: () => import('./segments/segments.component').then(m => m.SegmentsComponent),
    canMatch: [AuthGuard]
  },
  {
    path: 'state',
    loadComponent: () => import('./state/list-states/list-states.component').then(m => m.ListStatesComponent),
    canMatch: [AuthGuard]
  },
  {
    path: 'categories',
    loadComponent: () => import('./categories/list-categories/list-categories.component').then(m => m.ListCategoriesComponent),
    canMatch: [AuthGuard]
  },
  {
    path: 'groups',
    loadComponent: () => import('./groups/group/group.component').then(m => m.GroupComponent),
    canMatch: [AuthGuard]
  },
  {
    path: 'rols',
    loadComponent: () => import('./auth/rolls/rolls.component').then(m => m.RollsComponent),
    canMatch: [AuthGuard]
  },
  {
    path: 'requests',
    loadComponent: () => import('./requests/requestss/requestss.component').then(m => m.RequestssComponent),
    canMatch: [AuthGuard]
  },
  {
    path: 'typerequests',
    loadComponent: () => import('./requests/typerequests/typerequests.component').then(m => m.TyperequestsComponent),
    canMatch: [AuthGuard]
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

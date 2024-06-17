import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { userResolver } from './services/user.resolver';

export const AppRotas: Routes = [
  {
    path: '',
    redirectTo: 'player',
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./pages/login/login.module').then((mod) => mod.LoginModule),
  },
  {
    path: 'player',
    loadChildren: () =>
      import('./pages/player/player.module').then((mod) => mod.PlayerModule),
    canLoad: [authGuard],
    resolve: {
      user: userResolver,
    },
  },
];

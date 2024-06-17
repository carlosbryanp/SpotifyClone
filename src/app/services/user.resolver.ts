import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from '@angular/router';
import { IUser } from '../interfaces/IUser';
import { SpotifyService } from './spotify.service';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class userResolver implements Resolve<IUser> {
  constructor(private spotifyService: SpotifyService) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<IUser> {
    const token = localStorage.getItem('access-token');
    return this.spotifyService.getProfile(token);
  }
}

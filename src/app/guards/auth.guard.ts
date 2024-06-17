import { Injectable } from '@angular/core';
import { CanLoad, Route, Router, UrlSegment } from '@angular/router';
import { SpotifyService } from '../services/spotify.service';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class authGuard implements CanLoad {
  constructor(private router: Router, private spotifyService: SpotifyService) {}

  canLoad(router: Route, segments: UrlSegment[]): Observable<boolean> {
    const token = localStorage.getItem('access-token');

    if (!token) {
      return this.notAuthenticated();
    }
  }

  private notAuthenticated(): Observable<boolean> {
    localStorage.clear();
    this.router.navigate(['/login']);
    return of(false);
  }
}

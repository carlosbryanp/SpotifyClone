import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SpotifyConfiguration } from '../../environments/environment';
import { Buffer } from 'buffer';
import { IUser } from '../interfaces/IUser';
import { map } from 'rxjs';
import { IPlaylist } from '../interfaces/IPlaylist';
import { Router } from '@angular/router';
import { IArtist } from '../interfaces/IArtist';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private authEndPoint = SpotifyConfiguration.authEndpoint;
  private baseApi = SpotifyConfiguration.baseApi;
  private clientId = SpotifyConfiguration.clientId;
  private clientSecret = SpotifyConfiguration.clientSecret;
  private redirectUrl = SpotifyConfiguration.redirectUrl;
  private scopes = SpotifyConfiguration.scopes;

  deviceId: string;
  user: IUser;

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const params = new HttpParams({
      fromObject: {
        response_type: 'code',
        client_id: this.clientId,
        scope: this.scopes,
        redirect_uri: this.redirectUrl,
      },
    });
    const authUrl = `${this.authEndPoint}?${params.toString()}`;
    return authUrl;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getToken(authorizationCode: string) {
    const credentials = `${this.clientId}:${this.clientSecret}`;
    const encodedCredentials = Buffer.from(credentials).toString('base64');
    const body = new HttpParams()
      .set('grant_type', 'authorization_code')
      .set('code', authorizationCode)
      .set('redirect_uri', this.redirectUrl);
    const headers = new HttpHeaders({
      'content-type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${encodedCredentials}`,
    });
    return this.http.post<any>(`https://accounts.spotify.com/api/token`, body, {
      headers,
    });
  }

  getProfile(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const userData = this.http
      .get<any>(`${this.baseApi}v1/me`, { headers })
      .pipe(map((response) => this.mapToUserData(response)));
    userData.subscribe((data) => {
      this.user = data;
    });
    return userData;
  }

  private mapToUserData(response: any): IUser {
    return {
      name: response.display_name,
      id: response.id,
      imageUrl: response.images.pop().url,
    };
  }

  getUserPlaylist(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get<any>(
        `${this.baseApi}v1/users/${this.user.id}/playlists?limit=30&offset=0`,
        {
          headers,
        }
      )
      .pipe(map((response) => this.mapToUserPlaylists(response.items)));
  }

  private mapToUserPlaylists(playlists: any[]): IPlaylist[] {
    return playlists.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      imageUrl: playlist.images.length > 0 ? playlist.images[0].url : '',
    }));
  }

  getTopRead(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get<any>(
        'https://api.spotify.com/v1/me/top/artists?time_range=medium_term&limit=1&offset=0',
        { headers }
      )
      .pipe(map((response) => this.mapToTopArtist(response.items)));
  }

  private mapToTopArtist(artists: any[]): IArtist[] {
    return artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images.length > 0 ? artist.images[0].url : '',
    }));
  }
}
//   getPlaybackState(token: string) {
//     const headers = new HttpHeaders({
//       Authorization: `Bearer ${token}`,
//     });
//     return this.http
//       .get<any>('https://api.spotify.com/v1/me/player', { headers })
//       .subscribe((result) => {
//         this.deviceId = result.device.id;
//       });
//   }
// }

// skipToPrevious(token: string) {
//   const headers = new HttpHeaders({
//     Authorization: `Bearer ${token}`,
//   });
//   const body = new HttpParams().set('device_id', this.deviceId);
//   return this.http.post(`${this.baseApi}v1/me/player/previous`, body, {
//     headers,
//   });
// }

// skipToNext(token: string) {
//   const headers = new HttpHeaders({
//     Authorization: `Bearer ${token}`,
//   });
//   const body = new HttpParams().set('device_id', this.deviceId);
//   return this.http.post(`${this.baseApi}v1/me/player/next`, body, {
//     headers,
//   });
// }

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, throwError } from 'rxjs';

import { SpotifyConfiguration } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Buffer } from 'buffer';
import { IUser } from '../interfaces/IUser';
import {
  mapToUserPlaylists,
  mapToSavedTracks,
  mapToTopArtist,
  mapToUserData,
} from '../common/spotifyHelper';

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
      .get<any>(`${this.baseApi}v1/me/`, { headers })
      .pipe(map((response) => mapToUserData(response)));
    userData.subscribe((data) => {
      this.user = data;
    });
    return userData;
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
      .pipe(map((response) => mapToUserPlaylists(response.items)));
  }

  getTopRead(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get<any>(
        `${this.baseApi}v1/me/top/artists?time_range=medium_term&limit=1&offset=0`,
        { headers }
      )
      .pipe(map((response) => mapToTopArtist(response.items)));
  }

  getSavedTracks(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get<any>(`${this.baseApi}v1/me/tracks?market=BR&limit=50&offset=0`, {
        headers,
      })
      .pipe(map((response) => mapToSavedTracks(response.items)));
  }

  getPlaybackState(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    return this.http
      .get<any>('https://api.spotify.com/v1/me/player', { headers })
      .subscribe((result) => {
        this.deviceId = result.device.id;
      });
  }

  addToQueue(token: string, musicId: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    const params = new HttpParams()
      .set('uri', musicId)
      .set('device_id', this.deviceId);
    this.http
      .post(`${this.baseApi}v1/me/player/queue`, null, { headers, params })
      .subscribe((r) => r);
  }

  skipToNext(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    // const body = new HttpParams().set('device_id', this.deviceId);
    this.http
      .post(`${this.baseApi}v1/me/player/next`, null, {
        headers,
      })
      .subscribe((r) => r);
  }

  skipToPrevious(token: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    // const body = new HttpParams().set('device_id', this.deviceId);
    this.http
      .post(`${this.baseApi}v1/me/player/previous`, null, {
        headers,
      })
      .subscribe((r) => r);
  }
}

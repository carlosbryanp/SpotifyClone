import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom, map, take } from 'rxjs';

import { SpotifyConfiguration } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Buffer } from 'buffer';
import { IUser } from '../interfaces/IUser';
import {
  mapToUserPlaylists,
  mapToSavedTracks,
  mapToTopArtist,
  mapToUserData,
  mapToCurrentTrack,
  mapToTopTracks,
} from '../common/spotifyHelper';
import { IMusic } from '../interfaces/IMusic';

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
  currentTrack: IMusic;

  constructor(private http: HttpClient, private router: Router) {}

  private createAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

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

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  getProfile(token: string) {
    const headers = this.createAuthHeaders(token);
    const userData = this.http
      .get<any>(`${this.baseApi}v1/me/`, { headers })
      .pipe(map((response) => mapToUserData(response)))
      .pipe(take(1));
    userData.subscribe((data) => {
      this.user = data;
    });
    return userData;
  }

  getUserPlaylist(token: string) {
    const headers = this.createAuthHeaders(token);
    return this.http
      .get<any>(
        `${this.baseApi}v1/users/${this.user.id}/playlists?limit=30&offset=0`,
        {
          headers,
        }
      )
      .pipe(map((response) => mapToUserPlaylists(response.items)));
  }

  getPlaylist(token: string, playlistId: string) {
    const headers = this.createAuthHeaders(token);
    return this.http
      .get<any>(`${this.baseApi}v1/playlists/${playlistId}`, { headers })
      .pipe(take(1));
  }

  getPlaylistItems(token: string, playlistId: string) {
    const headers = this.createAuthHeaders(token);
    return this.http
      .get<any>(`${this.baseApi}v1/playlists/${playlistId}/tracks`, { headers })
      .pipe(
        take(1),
        map((r) => mapToSavedTracks(r.items))
      );
  }

  getTopRead(token: string) {
    const headers = this.createAuthHeaders(token);
    return this.http
      .get<any>(
        `${this.baseApi}v1/me/top/artists?time_range=medium_term&limit=5&offset=0`,
        { headers }
      )
      .pipe(map((response) => mapToTopArtist(response.items)));
  }

  getArtist(token: string, artistId: string) {
    const headers = this.createAuthHeaders(token);
    return this.http
      .get<any>(`${this.baseApi}v1/artists/${artistId}`, { headers })
      .pipe(
        take(1),
        map((response) => response)
      );
  }

  getArtistTracks(token: string, artistId: string) {
    const headers = this.createAuthHeaders(token);
    return this.http
      .get<any>(`${this.baseApi}v1/artists/${artistId}/top-tracks`, { headers })
      .pipe(
        take(1),
        map((response) => mapToTopTracks(response.tracks))
      );
  }

  getSavedTracks(token: string) {
    const headers = this.createAuthHeaders(token);
    return this.http
      .get<any>(`${this.baseApi}v1/me/tracks?market=BR&limit=50&offset=0`, {
        headers,
      })
      .pipe(map((response) => mapToSavedTracks(response.items)));
  }

  addToQueue(token: string, musicId: string) {
    const headers = this.createAuthHeaders(token);
    const params = new HttpParams().set('uri', musicId);
    this.http
      .post(`${this.baseApi}v1/me/player/queue`, null, { headers, params })
      .pipe(take(1))
      .subscribe((r) => r);
  }

  skipToNext(token: string) {
    const headers = this.createAuthHeaders(token);
    this.http
      .post(`${this.baseApi}v1/me/player/next`, null, {
        headers,
      })
      .pipe(take(1))
      .subscribe((r) => r);
  }

  pausePlayback(token: string) {
    const headers = this.createAuthHeaders(token);
    this.http
      .put(`${this.baseApi}v1/me/player/pause`, null, { headers })
      .pipe(take(1))
      .subscribe((response) => response);
  }

  resumePlayback(token: string) {
    const headers = this.createAuthHeaders(token);
    this.http
      .put(`${this.baseApi}v1/me/player/play`, null, { headers })
      .pipe(take(1))
      .subscribe((response) => response);
  }

  playTopArtist(token: string, tracksArray: string[]) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });
    const body = {
      uris: tracksArray,
    };
    this.http
      .put(`${this.baseApi}v1/me/player/play`, body, { headers })
      .pipe(take(1))
      .subscribe((response) => response);
  }

  skipToPrevious(token: string) {
    const headers = this.createAuthHeaders(token);
    this.http
      .post(`${this.baseApi}v1/me/player/previous`, null, {
        headers,
      })
      .pipe(take(1))
      .subscribe((r) => r);
  }

  async getCurrentTrack(token: string): Promise<IMusic> {
    const headers = this.createAuthHeaders(token);
    const music$ = this.http
      .get<any>(`${this.baseApi}v1/me/player/currently-playing`, { headers })
      .pipe(map((response) => mapToCurrentTrack(response.item)));
    const music = await firstValueFrom(music$);
    return music;
  }

  getPlayerStatus(token: string) {
    const headers = this.createAuthHeaders(token);
    return this.http
      .get<any>(`${this.baseApi}v1/me/player/currently-playing`, { headers })
      .pipe(map((response) => response.actions.disallows));
  }
}

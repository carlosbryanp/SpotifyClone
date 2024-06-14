import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { SpotifyConfiguration } from '../../environments/environment';
import { Buffer } from 'buffer';

@Injectable({
  providedIn: 'root',
})
export class SpotifyService {
  private authEndPoint = SpotifyConfiguration.authEndpoint;
  private baseApi = 'https://accounts.spotify.com/';
  private clientId = SpotifyConfiguration.clientId;
  private clientSecret = SpotifyConfiguration.clientSecret;
  private redirectUrl = SpotifyConfiguration.redirectUrl;
  private scopes = SpotifyConfiguration.scopes;

  // accesToken: string = '';
  // refreshToken: string = '';

  constructor(private http: HttpClient) {}

  login() {
    const params = new HttpParams({
      fromObject: {
        response_type: 'code',
        client_id: this.clientId,
        scope: 'user-top-read',
        redirect_uri: this.redirectUrl,
      },
    });
    const authUrl = `${this.authEndPoint}?${params.toString()}`;
    return authUrl;
  }

  getToken() {
    console.log(this.scopes);
    const authorizationCode = window.location.href.split('=')[1];
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

    return this.http.post<any>(`${this.baseApi}api/token`, body, { headers });
  }

  getProfiles() {
    let accessToken = localStorage.getItem('access-token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get('https://api.spotify.com/v1/me', { headers });
  }

  getTopRead() {
    let accessToken = localStorage.getItem('access-token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(
      'https://api.spotify.com/v1/me/top/artists?time_range=short_term&limit=20&offset=0',
      { headers }
    );
  }
}

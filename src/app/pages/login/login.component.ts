import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  accesToken: string = '';
  sub: Subscription;

  constructor(private spotifyService: SpotifyService, private router: Router) {}

  ngOnInit() {
    this.getTokenCallback();
  }

  onLogin() {
    window.location.href = this.spotifyService.login();
  }

  getTokenCallback() {
    const authorizationCode = window.location.href.split('=')[1];
    if (!!authorizationCode) {
      this.sub = this.spotifyService
        .getToken(authorizationCode)
        .subscribe((r) => {
          this.accesToken = r.access_token;
          localStorage.setItem('access-token', r.access_token);
          localStorage.setItem('refresh-token', r.refresh_token);
          this.router.navigate(['/player/home']);
        });
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

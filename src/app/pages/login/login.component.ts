import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  accesToken: string = '';

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
      this.spotifyService.getToken(authorizationCode).subscribe((r) => {
        this.accesToken = r.access_token;
        localStorage.setItem('access-token', r.access_token);
        localStorage.setItem('refresh-token', r.refresh_token);
        this.router.navigate(['/player/home']);
      });
    }
  }

  onGetProfile() {
    // this.spotifyService.getTopRead(this.accesToken);
    //   .subscribe((r) => console.log(r));
  }

  onPreviousTrack() {
    // this.spotifyService.skipToPrevious(this.accesToken).subscribe((r) => r);
  }

  // onNextTrack() {
  //   this.spotifyService.skipToPrevious(this.accesToken).subscribe((r) => r);
  // }
}

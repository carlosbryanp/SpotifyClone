import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  accesToken: string = '';
  refreshToken: string = '';
  profileData: any;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {}

  onLogin() {
    window.location.href = this.spotifyService.login();
  }

  onGetToken() {
    this.spotifyService.getToken();
    this.spotifyService.getToken().subscribe((r) => {
      this.accesToken = r.access_token;
      this.refreshToken = r.refresh_token;
      console.log(r);
      localStorage.setItem('access-token', r.access_token);
      localStorage.setItem('refresh-token', r.refresh_token);
    });
  }

  onGetProfile() {
    // this.spotifyService.getProfiles().subscribe((r) => {
    //   console.log(r);
    // });

    this.spotifyService.getTopRead().subscribe((r) => {
      console.log(r);
    });
  }
}

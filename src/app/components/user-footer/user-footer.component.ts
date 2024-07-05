import { Component, OnInit } from '@angular/core';

import { SpotifyService } from '../../services/spotify.service';
import { IUser } from '../../interfaces/IUser';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-user-footer',
  templateUrl: './user-footer.component.html',
  styleUrl: './user-footer.component.scss',
})
export class UserFooterComponent implements OnInit {
  exitIcon = faSignOutAlt;
  user: IUser = null;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.user = this.spotifyService.user;
  }

  logout() {
    this.spotifyService.logout();
  }
}

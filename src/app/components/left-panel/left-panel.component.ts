import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import {
  faGuitar,
  faHome,
  faMusic,
  faSearch,
} from '@fortawesome/free-solid-svg-icons';
import { IPlaylist } from '../../interfaces/IPlaylist';
import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-left-panel',
  templateUrl: './left-panel.component.html',
  styleUrl: './left-panel.component.scss',
})
export class LeftPanelComponent implements OnInit, OnDestroy {
  menuSelected = 'Home';
  playlists: IPlaylist[] = [];
  sub: Subscription;

  constructor(private spotifyService: SpotifyService, private router: Router) {}

  ngOnInit(): void {
    this.getPlaylists();
  }

  homeIcone = faHome;
  searchIcon = faSearch;
  artistIcon = faGuitar;
  playlistIcon = faMusic;

  clickButton(playlistId: string) {
    this.menuSelected = playlistId;
    this.router.navigate(['player/home']);
  }

  clickPlaylist(playlistId: string) {
    this.menuSelected = playlistId;
    this.router.navigate([`player/list/playlist/${playlistId}`]);
  }

  getPlaylists() {
    const token = localStorage.getItem('access-token');
    this.sub = this.spotifyService
      .getUserPlaylist(token)
      .subscribe((userPlaylist) => {
        this.playlists = userPlaylist;
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

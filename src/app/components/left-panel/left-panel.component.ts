import { Component, OnInit } from '@angular/core';
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
export class LeftPanelComponent implements OnInit {
  menuSelected = 'Home';
  playlists: IPlaylist[] = [];

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.getPlaylists();
  }

  //Icons
  homeIcone = faHome;
  searchIcon = faSearch;
  artistIcon = faGuitar;
  playlistIcon = faMusic;

  clickButton(button: string) {
    this.menuSelected = button;
  }

  getPlaylists() {
    const token = localStorage.getItem('access-token');
    this.spotifyService.getUserPlaylist(token).subscribe((userPlaylist) => {
      this.playlists = userPlaylist;
    });
  }
}

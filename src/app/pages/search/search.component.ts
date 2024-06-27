import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { IMusic } from '../../interfaces/IMusic';
import { IArtist } from '../../interfaces/IArtist';
import { IPlaylist } from '../../interfaces/IPlaylist';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit {
  artists: IArtist[] = [];
  playlists: IPlaylist[] = [];
  musics: IMusic[] = [];

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.loadInfo();
  }

  loadInfo() {
    this.artists = this.spotifyService.artistsSearched;
    this.playlists = this.spotifyService.playlistsSearched;
    this.musics = this.spotifyService.musicsSearched;
    console.log(this.artists);
    console.log(this.playlists);
    console.log(this.musics);
  }
}

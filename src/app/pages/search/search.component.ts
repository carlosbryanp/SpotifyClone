import { Component, OnDestroy, OnInit } from '@angular/core';

import { IMusic } from '../../interfaces/IMusic';
import { IArtist } from '../../interfaces/IArtist';
import { IPlaylist } from '../../interfaces/IPlaylist';
import { Router } from '@angular/router';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { PlayerService } from '../../services/player.service';
import { SpotifyService } from '../../services/spotify.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.scss',
})
export class SearchComponent implements OnInit, OnDestroy {
  artists: IArtist[] = [];
  playlists: IPlaylist[] = [];
  musics: IMusic[] = [];
  currentTrack: IMusic;
  subs: Subscription[] = [];

  playIcon = faPlay;

  constructor(
    private router: Router,
    private playerService: PlayerService,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    this.loadInfo();
    this.getCurrentTrack();
  }

  loadInfo() {
    const artistsSearched = localStorage.getItem('artists');
    const playlistsSearched = localStorage.getItem('playlists');
    const musicsSearched = localStorage.getItem('musics');
    if (artistsSearched && playlistsSearched && musicsSearched) {
      this.artists = JSON.parse(artistsSearched);
      this.playlists = JSON.parse(playlistsSearched);
      this.musics = JSON.parse(musicsSearched);
    }
  }

  getCurrentTrack() {
    const subCurrent = this.playerService.currentTrack.subscribe((music) => {
      this.currentTrack = music;
    });
    this.subs.push(subCurrent);
  }

  playlistClick(playlistId: string) {
    this.router.navigate([`/player/list/playlist/${playlistId}`]);
  }

  artistClick(artistId: string) {
    this.router.navigate([`player/list/artist/${artistId}`]);
  }

  getArtist(music: IMusic) {
    return music.artists.map((artist) => artist.name).join(',');
  }

  onPlayTrack(music: IMusic) {
    const token = localStorage.getItem('access-token');
    const subPlayTrack = this.spotifyService
      .addToQueueAndSkip(token, music.id)
      .subscribe(() => {
        this.playerService.defineCurrentTrack(music);
      });
    this.subs.push(subPlayTrack);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}

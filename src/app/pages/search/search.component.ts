import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, of, Subscription } from 'rxjs';

import { IMusic } from '../../interfaces/IMusic';
import { SpotifyService } from '../../services/spotify.service';
import { PlayerService } from '../../services/player.service';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  musics: IMusic[] = [];
  currentTrack: IMusic;
  subs: Subscription[] = [];
  error: string = null;

  playIcon = faPlay;

  constructor(
    private playerService: PlayerService,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    this.loadInfo();
    this.getCurrentTrack();
  }

  loadInfo() {
    const musicsSearched = localStorage.getItem('musics');
    if (musicsSearched) {
      this.musics = JSON.parse(musicsSearched);
    }
  }

  getCurrentTrack() {
    const subCurrent = this.playerService.currentTrack.subscribe((music) => {
      this.currentTrack = music;
    });
    this.subs.push(subCurrent);
  }

  getArtist(music: IMusic) {
    return music.artists.map((artist) => artist.name).join(',');
  }

  onPlayTrack(music: IMusic) {
    const token = localStorage.getItem('access-token');
    const subPlayTrack = this.spotifyService
      .addToQueueAndSkip(token, music.id)
      .pipe(
        catchError((error) => {
          this.error =
            'É necessário estar com um dispositivo conectado ao spotify.';
          return of(null);
        })
      )
      .subscribe(() => {
        this.playerService.defineCurrentTrack(music);
      });
    this.subs.push(subPlayTrack);
  }

  onHandleError() {
    this.error = null;
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}

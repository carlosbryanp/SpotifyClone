import { Component, OnDestroy, OnInit } from '@angular/core';
import { catchError, of, Subscription } from 'rxjs';

import { SpotifyService } from '../../services/spotify.service';
import { PlayerService } from '../../services/player.service';
import { IMusic } from '../../interfaces/IMusic';
import { newMusic } from '../../common/factories';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  musics: IMusic[] = [];
  currentTrack: IMusic = newMusic();
  playIcon = faPlay;
  error: string = null;
  subs: Subscription[] = [];

  constructor(
    private spotifyService: SpotifyService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.getTracks();
    this.getCurrentTrack();
  }

  getTracks() {
    const token = this.getToken();
    const subTracks = this.spotifyService
      .getSavedTracks(token)
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            console.error(
              'É necessário estar com um dispositivo conectado ao spotify.'
            );
          } else {
            console.error('Erro inesperado:', error);
          }
          return of(null);
        })
      )
      .subscribe((music) => {
        this.musics = music;
      });
    this.subs.push(subTracks);
  }

  getArtist(music: IMusic) {
    return music.artists.map((artist) => artist.name).join(', ');
  }

  getCurrentTrack() {
    const subCurrentTrack = this.playerService.currentTrack.subscribe(
      (music) => {
        this.currentTrack = music;
      }
    );
    this.subs.push(subCurrentTrack);
  }

  onPlayTrack(music: IMusic) {
    const token = this.getToken();
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

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  onHandleError() {
    this.error = null;
  }

  private getToken(): string | null {
    return localStorage.getItem('access-token');
  }
}

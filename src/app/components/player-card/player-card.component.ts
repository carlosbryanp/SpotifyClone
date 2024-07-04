import { Component, OnDestroy, OnInit } from '@angular/core';
import { IMusic } from '../../interfaces/IMusic';
import { IPlayerStatus } from '../../interfaces/IPlayerStatus';
import { PlayerService } from '../../services/player.service';
import {
  faBackward,
  faForward,
  faPause,
  faPlay,
} from '@fortawesome/free-solid-svg-icons';
import { SpotifyService } from '../../services/spotify.service';
import { catchError, of, Subscription, take } from 'rxjs';
import { newMusic } from '../../common/factories';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.scss',
})
export class PlayerCardComponent implements OnInit, OnDestroy {
  currentTrack: IMusic = newMusic(); // apagar
  subs: Subscription[] = [];
  playerStatus: IPlayerStatus;
  isPlaying: boolean = true;
  error: string = null;

  playIcon = faPlay;
  pauseIcon = faPause;
  previousIcon = faBackward;
  nextIcon = faForward;

  constructor(
    private playerService: PlayerService,
    private spotifyService: SpotifyService
  ) {}

  ngOnInit(): void {
    this.getCurrentTrack();
    this.getPlayerStatus();
  }

  getCurrentTrack() {
    const sub = this.playerService.currentTrack.subscribe((track) => {
      this.currentTrack = track || newMusic();
    });
    this.subs.push(sub);
  }

  getPlayerStatus() {
    const token = this.getToken();
    const playerSub = this.spotifyService
      .getPlayerStatus(token)
      .pipe(
        catchError((error) => {
          this.error =
            'É necessário estar com um dispositivo conectado ao spotify.';
          return of(null);
        })
      )
      .subscribe((status) => {
        this.playerStatus = status;
        if (status && typeof status.pausing !== 'undefined') {
          this.isPlaying = !status.pausing;
        } else if (status && typeof status.resuming !== 'undefined') {
          this.isPlaying = !status.resuming;
        } else {
          this.isPlaying = false;
        }
      });
    this.subs.push(playerSub);
  }

  onHandleError() {
    this.error = null;
  }

  onPrevious() {
    const token = this.getToken();
    this.spotifyService.skipToPrevious(token);
    this.isPlaying = true;
  }

  onNext() {
    const token = this.getToken();
    this.spotifyService.skipToNext(token);
    this.isPlaying = true;
  }

  onPause() {
    const token = this.getToken();
    if (this.isPlaying) {
      this.spotifyService
        .pausePlayback(token)
        .pipe(
          take(1),
          catchError((error) => {
            this.error =
              'É necessário estar com um dispositivo conectado ao spotify.';
            return of(null);
          })
        )
        .subscribe((r) => r);
    } else {
      this.spotifyService
        .resumePlayback(token)
        .pipe(
          take(1),
          catchError((error) => {
            this.error =
              'É necessário estar com um dispositivo conectado ao spotify.';
            return of(null);
          })
        )
        .subscribe((r) => r);
    }
    this.isPlaying = !this.isPlaying;
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  private getToken(): string | null {
    return localStorage.getItem('access-token');
  }
}

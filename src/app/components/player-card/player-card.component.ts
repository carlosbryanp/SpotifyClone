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
import { catchError, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.scss',
})
export class PlayerCardComponent implements OnInit, OnDestroy {
  currentTrack: IMusic;
  subs: Subscription[] = [];
  playerStatus: IPlayerStatus;
  isPlaying: boolean = false;

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
      this.currentTrack = track;
    });
    this.subs.push(sub);
  }

  getPlayerStatus() {
    const token = this.getToken();
    const playerSub = this.spotifyService
      .getPlayerStatus(token)
      .pipe(
        catchError((error) => {
          console.error(
            'Necessário estar com o spotify ativo em um dispositivo.',
            error
          );
          return of(null);
        })
      )
      .subscribe((status) => {
        this.playerStatus = status;
        this.isPlaying = !status.pausing;
      });
    this.subs.push(playerSub);
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
      this.spotifyService.pausePlayback(token);
    } else {
      this.spotifyService.resumePlayback(token);
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

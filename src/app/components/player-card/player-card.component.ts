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
import { Subscription } from 'rxjs';

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

  onPrevious() {
    const token = localStorage.getItem('access-token');
    this.spotifyService.skipToPrevious(token);
    this.isPlaying = true;
  }

  getPlayerStatus() {
    const token = localStorage.getItem('access-token');
    const playerSub = this.spotifyService
      .getPlayerStatus(token)
      .subscribe((status) => {
        this.playerStatus = status;
        this.isPlaying = !status.pausing;
      });
    this.subs.push(playerSub);
  }

  onNext() {
    const token = localStorage.getItem('access-token');
    this.spotifyService.skipToNext(token);
    this.isPlaying = true;
  }

  onPause() {
    const token = localStorage.getItem('access-token');
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
}

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMusic } from '../interfaces/IMusic';
import { SpotifyService } from './spotify.service';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  currentTrack = new BehaviorSubject<IMusic>(null);
  timerId = null;

  constructor(private spotifyService: SpotifyService) {
    this.getCurrentTrack();
  }

  async getCurrentTrack() {
    clearTimeout(this.timerId);
    const token = localStorage.getItem('access-token');
    const music = await this.spotifyService.getCurrentTrack(token);
    this.defineCurrentTrack(music);

    setTimeout(() => {
      this.getCurrentTrack();
    }, 3000);
  }

  defineCurrentTrack(music: IMusic) {
    this.currentTrack.next(music);
  }
}

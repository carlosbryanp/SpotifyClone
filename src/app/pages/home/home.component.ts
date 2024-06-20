import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { IMusic } from '../../interfaces/IMusic';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  musics: IMusic[] = [];
  currentTrack: IMusic;
  playIcon = faPlay;

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
    const token = localStorage.getItem('access-token');
    const subTracks = this.spotifyService
      .getSavedTracks(token)
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
    const token = localStorage.getItem('access-token');
    this.spotifyService.addToQueue(token, music.id);
    this.spotifyService.skipToNext(token);
    this.playerService.defineCurrentTrack(music);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}

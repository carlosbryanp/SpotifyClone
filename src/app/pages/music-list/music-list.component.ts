import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { catchError, of, Subscription } from 'rxjs';

import { SpotifyService } from '../../services/spotify.service';
import { PlayerService } from '../../services/player.service';
import { IMusic } from '../../interfaces/IMusic';
import { newMusic } from '../../common/factories';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.component.html',
  styleUrl: './music-list.component.scss',
})
export class MusicListComponent implements OnInit, OnDestroy {
  musics: IMusic[] = [];
  currentTrack: IMusic = newMusic();
  subs: Subscription[] = [];
  bannerImage: string;
  bannerName: string;
  error: string = null;

  playIcon = faPlay;

  constructor(
    private activatedRoute: ActivatedRoute,
    private spotifyService: SpotifyService,
    private playerService: PlayerService
  ) {}

  ngOnInit(): void {
    this.getMusics();
    this.getCurrentTrack();
  }

  getMusics() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const type = params.get('type');
      const id = params.get('id');
      this.getPageData(type, id);
    });
  }

  getPageData(type: string, id: string) {
    if (type === 'playlist') this.getPlaylistData(id);
    else this.getArtistData(id);
  }

  getPlaylistData(playlistId: string) {
    const token = localStorage.getItem('access-token');
    const subPlaylistData = this.spotifyService
      .getPlaylistItems(token, playlistId)
      .subscribe((playlistTracks) => {
        this.musics = playlistTracks;
      });
    this.subs.push(subPlaylistData);
  }
  getArtistData(artistId: string) {
    const token = localStorage.getItem('access-token');
    const subGetArtist = this.spotifyService
      .getArtistTracks(token, artistId)
      .subscribe((artistTracks) => {
        this.musics = artistTracks;
      });
    this.subs.push(subGetArtist);
  }

  getArtist(music) {
    return music.artists.map((artist) => artist.name).join(', ');
  }

  getCurrentTrack() {
    const subCurrentTrack = this.playerService.currentTrack.subscribe(
      (currentTrack) => {
        this.currentTrack = currentTrack;
      }
    );
    this.subs.push(subCurrentTrack);
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

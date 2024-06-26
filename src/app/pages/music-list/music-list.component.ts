import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SpotifyService } from '../../services/spotify.service';
import { IMusic } from '../../interfaces/IMusic';
import { faPlay } from '@fortawesome/free-solid-svg-icons';
import { PlayerService } from '../../services/player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-music-list',
  templateUrl: './music-list.component.html',
  styleUrl: './music-list.component.scss',
})
export class MusicListComponent implements OnInit, OnDestroy {
  musics: IMusic[] = [];
  currentTrack: IMusic;
  sub: Subscription;
  bannerImage: string;
  bannerName: string;

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
    this.spotifyService
      .getPlaylistItems(token, playlistId)
      .subscribe((playlistTracks) => {
        this.musics = playlistTracks;
      });
  }
  getArtistData(artistId: string) {
    const token = localStorage.getItem('access-token');
    this.spotifyService
      .getArtistTracks(token, artistId)
      .subscribe((artistTracks) => {
        this.musics = artistTracks;
      });
  }

  getArtist(music) {
    return music.artists.map((artist) => artist.name).join(', ');
  }

  getCurrentTrack() {
    this.sub = this.playerService.currentTrack.subscribe((currentTrack) => {
      this.currentTrack = currentTrack;
    });
  }

  onPlayTrack(music: IMusic) {
    const token = localStorage.getItem('access-token');
    this.spotifyService.addToQueueAndSkip(token, music.id).subscribe(() => {
      this.playerService.defineCurrentTrack(music);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

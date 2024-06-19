import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { IMusic } from '../../interfaces/IMusic';
import { faPlay } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  musics: IMusic[] = [];
  playIcon = faPlay;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.getTracks();
    this.getPlaybackState();
  }

  getTracks() {
    const token = localStorage.getItem('access-token');
    this.spotifyService.getSavedTracks(token).subscribe((music) => {
      this.musics = music;
    });
  }

  getArtist(music: IMusic) {
    return music.artists.map((artist) => artist.name).join(', ');
  }

  getPlaybackState() {
    const token = localStorage.getItem('access-token');
    this.spotifyService.getPlaybackState(token);
  }

  onPlayTrack(music: IMusic) {
    const token = localStorage.getItem('access-token');
    this.spotifyService.addToQueue(token, music.id);
    this.spotifyService.skipToNext(token);
    // this.spotifyService.skipToPrevious(token);
  }
}

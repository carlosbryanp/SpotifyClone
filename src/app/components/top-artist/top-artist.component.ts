import { Component, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { IArtist } from '../../interfaces/IArtist';

@Component({
  selector: 'app-top-artist',
  templateUrl: './top-artist.component.html',
  styleUrl: './top-artist.component.scss',
})
export class TopArtistComponent implements OnInit {
  topArtist: IArtist;

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.getTopArtist();
  }

  getTopArtist() {
    const token = localStorage.getItem('access-token');
    this.spotifyService.getTopRead(token).subscribe((userTopArtist) => {
      this.topArtist = userTopArtist[0];
    });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';

import { SpotifyService } from '../../services/spotify.service';
import { IArtist } from '../../interfaces/IArtist';
import { newArtist } from '../../common/factories';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-top-artist',
  templateUrl: './top-artist.component.html',
  styleUrl: './top-artist.component.scss',
})
export class TopArtistComponent implements OnInit, OnDestroy {
  topArtist: IArtist = newArtist();
  tracksArray: string[] = [];
  subs: Subscription[] = [];

  constructor(private spotifyService: SpotifyService) {}

  ngOnInit(): void {
    this.getTopArtist();
  }

  getTopArtist() {
    const token = localStorage.getItem('access-token');
    const subGetTopArtist = this.spotifyService
      .getTopRead(token)
      .subscribe((userTopArtist) => {
        this.topArtist = userTopArtist[0];
      });
    this.subs.push(subGetTopArtist);
  }

  setTopArtist(artistId) {
    const token = localStorage.getItem('access-token');
    const subSetTopArtist = this.spotifyService
      .getArtistTracks(token, artistId)
      .subscribe((response) => {
        this.tracksArray = [...response.map((track) => track.id)];
        this.spotifyService.playTopArtist(token, this.tracksArray);
      });
    this.subs.push(subSetTopArtist);
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }
}

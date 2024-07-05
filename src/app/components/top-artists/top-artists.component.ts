import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { SpotifyService } from '../../services/spotify.service';
import { IArtist } from '../../interfaces/IArtist';

@Component({
  selector: 'app-top-artists',
  templateUrl: './top-artists.component.html',
  styleUrl: './top-artists.component.scss',
})
export class TopArtistsComponent implements OnInit, OnDestroy {
  topArtists: IArtist[] = [];
  sub: Subscription;

  constructor(private spotifyService: SpotifyService, private router: Router) {}

  ngOnInit(): void {
    this.getTopArtists();
  }

  getTopArtists() {
    const token = localStorage.getItem('access-token');
    this.sub = this.spotifyService
      .getTopRead(token)
      .subscribe((userTopArtists) => {
        this.topArtists = userTopArtists;
      });
  }

  clickArtist(artistId: string) {
    this.router.navigate([`player/list/artist/${artistId}`]);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { IArtist } from '../../interfaces/IArtist';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  clickArtist(artistId: string) {
    this.router.navigate([`player/list/artist/${artistId}`]);
  }
}

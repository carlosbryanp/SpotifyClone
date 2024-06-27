import { Component, OnDestroy } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { IPlaylist } from '../../interfaces/IPlaylist';
import { IMusic } from '../../interfaces/IMusic';
import { IArtist } from '../../interfaces/IArtist';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recent-search',
  templateUrl: './recent-search.component.html',
  styleUrl: './recent-search.component.scss',
})
export class RecentSearchComponent {
  recentSearches = ['Psytrance', 'Hip-hop', 'Reggae Classics', 'Rock 00s'];
  search: string = '';

  sub: Subscription;

  constructor(private spotifyService: SpotifyService, private router: Router) {}

  defineSearch(search: string) {
    this.search = search;
  }

  onSearch() {
    const token = localStorage.getItem('access-token');
    this.spotifyService.searchItem(token, this.search);
  }
}

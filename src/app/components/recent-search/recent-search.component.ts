import { Component } from '@angular/core';
import { Subscription } from 'rxjs';

import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-recent-search',
  templateUrl: './recent-search.component.html',
  styleUrl: './recent-search.component.scss',
})
export class RecentSearchComponent {
  recentSearches = ['Psytrance', 'Hip-hop', 'Reggae Classics', 'Rock 00s'];
  search: string = '';

  constructor(private spotifyService: SpotifyService) {}

  defineSearch(search: string) {
    this.search = search;
  }

  onSearch() {
    const token = localStorage.getItem('access-token');
    this.spotifyService.searchItem(token, this.search);
  }
}

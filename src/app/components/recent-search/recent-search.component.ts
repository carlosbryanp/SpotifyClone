import { Component } from '@angular/core';

@Component({
  selector: 'app-recent-search',
  templateUrl: './recent-search.component.html',
  styleUrl: './recent-search.component.scss',
})
export class RecentSearchComponent {
  recentSearches = ['Psytrance', 'Hip-hop', 'Reggae Classics', 'Rock 00s'];

  search: string = '';

  defineSearch(search: string) {
    this.search = search;
  }

  onSearch() {}
}

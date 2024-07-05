import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SpotifyService } from '../../services/spotify.service';

@Component({
  selector: 'app-banner-list',
  templateUrl: './banner-list.component.html',
  styleUrl: './banner-list.component.scss',
})
export class BannerListComponent implements OnInit {
  bannerName: string;
  bannerImage: string;

  constructor(
    private spotifyService: SpotifyService,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getPlaylistId();
  }

  getPlaylistId() {
    this.activatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      const type = params.get('type');
      this.defineBanner(id, type);
    });
  }

  defineBanner(id: string, type: string) {
    const token = localStorage.getItem('access-token');
    if (type === 'playlist') {
      this.spotifyService.getPlaylist(token, id).subscribe((bannerData) => {
        this.bannerName = bannerData.name;
        this.bannerImage =
          bannerData.images.length > 0 ? bannerData.images[0].url : '';
      });
    } else
      this.spotifyService.getArtist(token, id).subscribe((bannerData) => {
        this.bannerName = bannerData.name;
        this.bannerImage =
          bannerData.images.length > 0 ? bannerData.images[0].url : '';
      });
  }
}

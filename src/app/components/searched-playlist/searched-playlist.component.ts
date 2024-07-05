import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { IPlaylist } from '../../interfaces/IPlaylist';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

@Component({
  selector: 'app-searched-playlist',
  templateUrl: './searched-playlist.component.html',
  styleUrl: './searched-playlist.component.scss',
})
export class SearchedPlaylistComponent implements OnInit, OnDestroy {
  playlists: IPlaylist[] = [];

  constructor(private router: Router) {}

  @ViewChild('sliderRef') sliderRef: ElementRef<HTMLElement>;
  slider: KeenSliderInstance = null;

  ngAfterViewInit() {
    this.slider = new KeenSlider(this.sliderRef.nativeElement, {
      slides: {
        perView: 5,
        spacing: 15,
      },
    });
  }

  ngOnInit(): void {
    this.loadInfo();
  }

  loadInfo() {
    const playlistsSearched = localStorage.getItem('playlists');
    if (playlistsSearched) {
      this.playlists = JSON.parse(playlistsSearched);
    }
  }

  playlistClick(playlistId: string) {
    this.router.navigate([`/player/list/playlist/${playlistId}`]);
  }

  ngOnDestroy(): void {
    if (this.slider) this.slider.destroy();
  }
}

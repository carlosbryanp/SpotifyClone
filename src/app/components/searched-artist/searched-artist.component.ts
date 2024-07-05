import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';

import { IArtist } from '../../interfaces/IArtist';
import KeenSlider, { KeenSliderInstance } from 'keen-slider';

@Component({
  selector: 'app-searched-artist',
  templateUrl: './searched-artist.component.html',
  styleUrl: './searched-artist.component.scss',
})
export class SearchedArtistComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  artists: IArtist[] = [];

  constructor(private router: Router) {}

  @ViewChild('sliderRef') sliderRef: ElementRef<HTMLElement>;
  slider: KeenSliderInstance = null;

  ngAfterViewInit() {
    this.slider = new KeenSlider(this.sliderRef.nativeElement, {
      slides: {
        perView: 9,
        spacing: 10,
      },
    });
  }

  ngOnInit(): void {
    this.loadInfo();
  }

  loadInfo() {
    const artistsSearched = localStorage.getItem('artists');
    if (artistsSearched) {
      this.artists = JSON.parse(artistsSearched);
    }
  }

  artistClick(artistId: string) {
    this.router.navigate([`player/list/artist/${artistId}`]);
  }

  ngOnDestroy(): void {
    if (this.slider) this.slider.destroy();
  }
}

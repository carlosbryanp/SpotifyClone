import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopArtistsComponent } from './top-artists.component';
import { SpotifyService } from '../../services/spotify.service';
import { DebugElement } from '@angular/core';
import { IArtist } from '../../interfaces/IArtist';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('TopArtistsComponent', () => {
  let component: TopArtistsComponent;
  let fixture: ComponentFixture<TopArtistsComponent>;
  let spotifyServiceSpy: jasmine.SpyObj<SpotifyService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    const spotifySpy = jasmine.createSpyObj('SpotifyService', ['getTopRead']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [TopArtistsComponent],
      providers: [
        { provide: SpotifyService, useValue: spotifySpy },
        { provide: Router, useValue: routerSpyObj },
      ],
    }).compileComponents();

    spotifyServiceSpy = TestBed.inject(
      SpotifyService
    ) as jasmine.SpyObj<SpotifyService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopArtistsComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    const artists: IArtist[] = [
      { id: 'Artist 1', name: 'Artist 1', imageUrl: 'http://artist1-url.com' },
      { id: 'Artist 2', name: 'Artist 2', imageUrl: 'http://artist2-url.com' },
      { id: 'Artist 3', name: 'Artist 3', imageUrl: 'http://artist3-url.com' },
      { id: 'Artist 4', name: 'Artist 4', imageUrl: 'http://artist4-url.com' },
      { id: 'Artist 5', name: 'Artist 5', imageUrl: 'http://artist5-url.com' },
    ];

    spotifyServiceSpy.getTopRead.and.returnValue(of(artists));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get top artists on init', () => {
    expect(component.topArtists.length).toBe(5);
    expect(component.topArtists[1].name).toEqual('Artist 2');
  });

  it('should navigate to artist page on click', () => {
    const artistId = 'whiptongue';
    component.clickArtist(artistId);

    expect(routerSpy.navigate).toHaveBeenCalledWith([
      'player/list/artist/whiptongue',
    ]);
  });

  it('should unsubscribe on destroy', () => {
    const subSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.sub = subSpy;
    component.ngOnDestroy();

    expect(subSpy.unsubscribe).toHaveBeenCalled();
  });

  it('should display top artists', () => {
    const artistElements = debugElement.queryAll(By.css('.artist-item'));
    expect(artistElements.length).toBe(5);

    const firstArtistName = artistElements[4].query(
      By.css('span')
    ).nativeElement;
    const firstArtistImg = artistElements[4].query(By.css('img')).nativeElement;
    expect(firstArtistName.textContent).toContain('Artist 5');
    expect(firstArtistImg.src).toContain('http://artist5-url.com');
  });
});

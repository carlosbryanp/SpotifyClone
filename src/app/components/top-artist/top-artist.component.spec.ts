import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TopArtistComponent } from './top-artist.component';
import { DebugElement } from '@angular/core';
import { SpotifyService } from '../../services/spotify.service';
import { IArtist } from '../../interfaces/IArtist';
import { newArtist, newMusic } from '../../common/factories';
import { of } from 'rxjs';
import { IMusic } from '../../interfaces/IMusic';
import { By } from '@angular/platform-browser';

describe('TopArtistComponent', () => {
  let component: TopArtistComponent;
  let fixture: ComponentFixture<TopArtistComponent>;
  let spotifyServiceSpy: jasmine.SpyObj<SpotifyService>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('SpotifyService', [
      'getTopRead',
      'getArtistTracks',
      'playTopArtist',
    ]);

    await TestBed.configureTestingModule({
      declarations: [TopArtistComponent],
      providers: [{ provide: SpotifyService, useValue: spy }],
    }).compileComponents();

    spotifyServiceSpy = TestBed.inject(
      SpotifyService
    ) as jasmine.SpyObj<SpotifyService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TopArtistComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;

    const artist: IArtist = {
      ...newArtist(),
      id: '123',
      name: 'Carlos Bryan',
      imageUrl: 'http://test-url.com',
    };

    const tracks: IMusic[] = [
      {
        id: 'track1',
        title: 'Track 1',
        artists: [{ id: 'artist1', name: 'Artist 1' }],
        album: {
          id: 'album1',
          name: 'Album 1',
          imageUrl: 'http://album1-url.com',
        },
        time: '3:30',
      },
      {
        id: 'track2',
        title: 'Track 2',
        artists: [{ id: 'artist2', name: 'Artist 2' }],
        album: {
          id: 'album2',
          name: 'Album 2',
          imageUrl: 'http://album2-url.com',
        },
        time: '4:00',
      },
    ];

    spotifyServiceSpy.getTopRead.and.returnValue(of([artist]));
    spotifyServiceSpy.getArtistTracks.and.returnValue(of(tracks));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get top artist on init', () => {
    expect(component.topArtist.id).toEqual('123');
    expect(component.topArtist.name).toEqual('Carlos Bryan');
    expect(component.topArtist.imageUrl).toEqual('http://test-url.com');
  });

  it('should call getTopArtist and playTopArtist when setTopArtist is called', () => {
    component.setTopArtist('123');
    expect(spotifyServiceSpy.getArtistTracks.calls.count()).toBe(1);
    expect(spotifyServiceSpy.playTopArtist.calls.count()).toBe(1);
    expect(component.tracksArray).toEqual(['track1', 'track2']);
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const subSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.subs = [subSpy, subSpy];
    component.ngOnDestroy();

    expect(subSpy.unsubscribe.calls.count()).toBe(2);
  });

  it('should display the top artist name and image', () => {
    const nameElement: HTMLElement = debugElement.query(
      By.css('span')
    ).nativeElement;
    const imgElement: HTMLImageElement = debugElement.query(
      By.css('img')
    ).nativeElement;

    expect(nameElement.textContent).toContain('Carlos Bryan');
    expect(imgElement.src).toContain('http://test-url.com');
  });
});

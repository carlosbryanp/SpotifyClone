import { IArtist } from '../interfaces/IArtist';
import { IMusic } from '../interfaces/IMusic';
import { IPlaylist } from '../interfaces/IPlaylist';
import { IUser } from '../interfaces/IUser';

export function mapToUserData(response: any): IUser {
  return {
    name: response.display_name,
    id: response.id,
    imageUrl: response.images.pop().url,
  };
}

export function mapToUserPlaylists(playlists: any[]): IPlaylist[] {
  return playlists.map((playlist) => ({
    id: playlist.id,
    name: playlist.name,
    imageUrl: playlist.images.length > 0 ? playlist.images[0].url : '',
  }));
}

export function mapToTopArtist(artists: any[]): IArtist[] {
  return artists.map((artist) => ({
    id: artist.id,
    name: artist.name,
    imageUrl: artist.images.length > 0 ? artist.images[0].url : '',
  }));
}

export function mapToSavedTracks(items: any[]): IMusic[] {
  return items.map((item) => ({
    id: item.track.uri,
    title: item.track.name,
    artists: item.track.artists.map((artist) => ({
      id: artist.id,
      name: artist.name,
    })),
    album: {
      id: item.track.album.id,
      name: item.track.album.name,
      imageUrl:
        item.track.album.images.length > 0
          ? item.track.album.images[0].url
          : '',
    },
    time: item.track.duration_ms,
  }));
}

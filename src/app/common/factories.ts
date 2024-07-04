import { IArtist } from '../interfaces/IArtist';
import { IMusic } from '../interfaces/IMusic';
import { IPlaylist } from '../interfaces/IPlaylist';

export function newArtist(): IArtist {
  return {
    id: '',
    imageUrl: '',
    name: '',
    musics: [],
  };
}

export function newMusic(): IMusic {
  return {
    id: '',
    album: {
      id: '',
      imageUrl: '',
      name: '',
    },
    artists: [],
    time: '',
    title: '',
  };
}

export function newPlaylist(): IPlaylist {
  return {
    id: '',
    imageUrl: '',
    name: '',
    musics: [],
  };
}

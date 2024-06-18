export const environment = {
  production: true,
};

export const SpotifyConfiguration = {
  clientId: 'f8773f99610a4add98059c6efd4c6e53',
  clientSecret: '8ac18d732bca4aa784cb46b618bbbfbd',
  baseApi: 'https://api.spotify.com/',
  authEndpoint: 'https://accounts.spotify.com/authorize',
  redirectUrl: 'http://localhost:4200/login/',
  scopes:
    'user-read-currently-playing user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-library-read playlist-read-private playlist-read-collaborative',
};

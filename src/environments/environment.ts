export const environment = {
  production: false,
};

export const SpotifyConfiguration = {
  clientId: 'f8773f99610a4add98059c6efd4c6e53',
  clientSecret: '8ac18d732bca4aa784cb46b618bbbfbd',
  authEndpoint: 'https://accounts.spotify.com/authorize',
  redirectUrl: 'http://localhost:4200/login/',
  scopes:
    'user-read-currently-playing user-read-recently-played user-read-playback-state user-top-read user-modify-playback-state user-library-read playlist-read-private playlist-read-collaborative',
};

// scopes: [
//   'user-read-currently-playing', // musica tocando agora
//   'user-read-recently-playing', // ler musicas tocadas recentemente
//   'user-read-playback-state', // ler estado do player do usuario
//   'user-top-read', // top artistas e musicas do usuario
//   'user-modify-playback-state', // alterar do player do usuario
//   'user-library-read', // ler biblioteca dos usuarios
//   'playlist-read-private', // ler playlists privadas
//   'playlist-read-collaborative', // ler playlists colaborativas
// ],

//https://accounts.spotify.com/authorize?response_type=code&client_id=f8773f99610a4add98059c6efd4c6e53&scope=user-read-currently-playing%20user-read-recently-playing%20user-read-playback-state%20user-top-read%20user-modify-playback-state%20user-library-read%20playlist-read-private%20playlist-read-collaborative&redirect_uri=http://localhost:4200/login/

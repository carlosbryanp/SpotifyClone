import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PlayerRoutes } from './player.routes';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PlayerComponent } from './player.component';
import { LeftPanelComponent } from '../../components/left-panel/left-panel.component';
import { MenuButtonComponent } from '../../components/menu-button/menu-button.component';
import { UserFooterComponent } from '../../components/user-footer/user-footer.component';
import { HomeComponent } from '../home/home.component';
import { TopArtistComponent } from '../../components/top-artist/top-artist.component';
import { RightPanelComponent } from '../../components/right-panel/right-panel.component';
import { TimeFormatPipe } from '../home/time-format.pipe';
import { RecentSearchComponent } from '../../components/recent-search/recent-search.component';
import { TopArtistsComponent } from '../../components/top-artists/top-artists.component';
import { PlayerCardComponent } from '../../components/player-card/player-card.component';
import { MusicListComponent } from '../music-list/music-list.component';
import { BannerListComponent } from '../../components/banner-list/banner-list.component';

@NgModule({
  declarations: [
    PlayerComponent,
    LeftPanelComponent,
    MenuButtonComponent,
    UserFooterComponent,
    HomeComponent,
    TopArtistComponent,
    RightPanelComponent,
    TimeFormatPipe,
    RecentSearchComponent,
    TopArtistsComponent,
    PlayerCardComponent,
    MusicListComponent,
    BannerListComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule.forChild(PlayerRoutes),
    FormsModule,
  ],
})
export class PlayerModule {}

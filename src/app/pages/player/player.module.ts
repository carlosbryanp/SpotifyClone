import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PlayerRoutes } from './player.routes';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { PlayerComponent } from './player.component';
import { LeftPanelComponent } from '../../components/left-panel/left-panel.component';
import { MenuButtonComponent } from '../../components/left-panel/menu-button/menu-button.component';

@NgModule({
  declarations: [PlayerComponent, LeftPanelComponent, MenuButtonComponent],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule.forChild(PlayerRoutes),
  ],
})
export class PlayerModule {}

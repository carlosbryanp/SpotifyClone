import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrl: './menu-button.component.scss',
})
export class MenuButtonComponent {
  @Input() description: string = '';
  @Input() selected: boolean = false;
  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }
}

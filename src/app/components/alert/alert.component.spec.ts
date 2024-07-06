import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AlertComponent } from './alert.component';
import { DebugElement } from '@angular/core';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let debugElement: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AlertComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the correct message', () => {
    component.message = 'Test Alert Message';
    fixture.detectChanges();

    const messageElement: HTMLElement = debugElement.query(
      By.css('p')
    ).nativeElement;
    expect(messageElement.textContent).toContain('Test Alert Message');
  });

  it('should emit close event when the close button is clicked', () => {
    spyOn(component.close, 'emit');

    const buttonElement = debugElement.query(By.css('button')).nativeElement;
    buttonElement.click();

    expect(component.close.emit).toHaveBeenCalled();
  });

  it('should emit close event when the backdrop is clicked', () => {
    spyOn(component.close, 'emit');

    const backdropElement = debugElement.query(
      By.css('.backdrop')
    ).nativeElement;
    backdropElement.click();

    expect(component.close.emit).toHaveBeenCalled();
  });
});

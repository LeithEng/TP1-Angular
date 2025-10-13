/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Directive, HostBinding, HostListener } from '@angular/core';

/* ************************************************************************** */
/*                                 Directive                                  */
/* ************************************************************************** */

@Directive({
  selector: 'input[appRainbowWriter]',
  standalone: true,
})
export class RainbowWriterDirective {
  private colors = [
    '#FF0000',
    '#FF7F00',
    '#FFFF00',
    '#00FF00',
    '#0000FF',
    '#4B0082',
    '#9400D3',
    '#FF1493',
    '#00CED1',
    '#FFD700',
    '#FF69B4',
    '#32CD32',
  ];

  private _currentColor = this.getRandomColor();

  /* ********************************************************************** */
  /*                            Host Bindings                               */
  /* ********************************************************************** */

  @HostBinding('style.color')
  get textColor() {
    return this._currentColor;
  }

  @HostBinding('style.border-color')
  get borderColor() {
    return this._currentColor;
  }

  @HostBinding('style.border-width')
  borderWidth = '2px';

  @HostBinding('style.border-style')
  borderStyle = 'solid';

  /* ********************************************************************** */
  /*                            Host Listeners                              */
  /* ********************************************************************** */

  @HostListener('keyup')
  onKeyUp() {
    this._currentColor = this.getRandomColor();
  }

  /* ********************************************************************** */
  /*                            Private Methods                             */
  /* ********************************************************************** */

  private getRandomColor(): string {
    const randomIndex = Math.floor(Math.random() * this.colors.length);
    return this.colors[randomIndex];
  }
}

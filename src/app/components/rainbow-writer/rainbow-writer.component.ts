/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Directives
import { RainbowWriterDirective } from '../../directives/rainbow-writer.directive';

/* ************************************************************************** */
/*                                 Component                                  */
/* ************************************************************************** */

@Component({
  selector: 'app-rainbow-writer',
  templateUrl: './rainbow-writer.component.html',
  styleUrls: ['./rainbow-writer.component.css'],
  standalone: true,
  imports: [FormsModule, RainbowWriterDirective],
})
export class RainbowWriterComponent {
  userInput = '';
  description = '';
  
  /* ********************************************************************** */
  /*                            Public Methods                              */
  /* ********************************************************************** */
  
  clearInputs(): void {
    this.userInput = '';
    this.description = '';
  }
}
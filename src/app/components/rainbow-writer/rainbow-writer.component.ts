/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Angular core
import { Component, signal, computed } from '@angular/core';
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
  userInputSignal = signal('');
  descriptionSignal = signal('');

  userInput = '';
  description = '';

  hasContent = computed(
    () =>
      this.userInputSignal().length > 0 || this.descriptionSignal().length > 0
  );

  totalChars = computed(
    () => this.userInputSignal().length + this.descriptionSignal().length
  );

  /* ********************************************************************** */
  /*                            Public Methods                              */
  /* ********************************************************************** */

  onUserInputChange(value: string): void {
    this.userInputSignal.set(value);
  }

  onDescriptionChange(value: string): void {
    this.descriptionSignal.set(value);
  }

  clearInputs(): void {
    this.userInput = '';
    this.description = '';
    this.userInputSignal.set('');
    this.descriptionSignal.set('');
  }
}

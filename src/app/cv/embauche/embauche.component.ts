/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Component, inject, Signal } from '@angular/core';

// Models
import { Cv } from '../model/cv';

// Services
import { EmbaucheService } from '../services/embauche.service';

// Components
import { ItemComponent } from '../item/item.component';

/* ************************************************************************** */
/*                                Component                                   */
/* ************************************************************************** */

@Component({
  selector: 'app-embauche',
  templateUrl: './embauche.component.html',
  styleUrls: ['./embauche.component.css'],
  standalone: true,
  imports: [ItemComponent],
})
export class EmbaucheComponent {
  
  /* ********************************************************************** */
  /*                          Private Properties                            */
  /* ********************************************************************** */

  private embaucheService = inject(EmbaucheService);

  /* ********************************************************************** */
  /*                          Public Properties                             */
  /* ********************************************************************** */

  public embauchees: Signal<Cv[]>;

  /* ********************************************************************** */
  /*                            Constructor                                 */
  /* ********************************************************************** */

  constructor() {
    this.embauchees = this.embaucheService.getEmbauchees();
    console.log(
      '🟣 [EmbaucheComponent] Initialisation - Signal embauchees:',
      this.embauchees()
    );
    console.log(
      `   → Nombre initial de personnes embauchées: ${this.embauchees().length}`
    );
  }
}

/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Injectable, signal } from '@angular/core';

// Models
import { Cv } from '../model/cv';

/* ************************************************************************** */
/*                                  Service                                   */
/* ************************************************************************** */

@Injectable({
  providedIn: 'root',
})
export class EmbaucheService {
  /* ********************************************************************** */
  /*                             Signals                                    */
  /* ********************************************************************** */

  private embauchees = signal<Cv[]>([]);

  /* ********************************************************************** */
  /*                            Constructor                                 */
  /* ********************************************************************** */

  constructor() {}

  /* ********************************************************************** */
  /*                           Public Methods                               */
  /* ********************************************************************** */
  getEmbauchees() {
    return this.embauchees.asReadonly();
  }

  embauche(cv: Cv): boolean {
    const currentEmbauchees = this.embauchees();
    if (currentEmbauchees.findIndex((c) => c.id === cv.id) === -1) {
      console.log('🟢 [EmbaucheService] Signal embauchees mis à jour');
      console.log(`   → Embauche de: ${cv.firstname} ${cv.name}`);
      this.embauchees.set([...currentEmbauchees, cv]);

      console.log(
        `   → Total personnes embauchées: ${this.embauchees().length}`
      );
      return true;
    }
    console.log(
      '🟡 [EmbaucheService] Signal NON modifié (personne déjà embauchée)'
    );
    console.log(`   → ${cv.firstname} ${cv.name} est déjà dans la liste`);
    return false;
  }
}

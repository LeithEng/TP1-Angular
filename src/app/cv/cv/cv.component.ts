/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Component, inject, signal } from '@angular/core';
import { UpperCasePipe, DatePipe } from '@angular/common';

// Models
import { Cv } from '../model/cv';

// Services
import { LoggerService } from '../../services/logger.service';
import { ToastrService } from 'ngx-toastr';
import { CvService } from '../services/cv.service';

// Components
import { ListComponent } from '../list/list.component';
import { CvCardComponent } from '../cv-card/cv-card.component';
import { EmbaucheComponent } from '../embauche/embauche.component';

/* ************************************************************************** */
/*                                Component                                   */
/* ************************************************************************** */

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css'],
  standalone: true,
  imports: [
    ListComponent,
    CvCardComponent,
    EmbaucheComponent,
    UpperCasePipe,
    DatePipe,
  ],
})
export class CvComponent {
  /* ********************************************************************** */
  /*                          Private Properties                            */
  /* ********************************************************************** */

  private logger = inject(LoggerService);
  private toastr = inject(ToastrService);

  /* ********************************************************************** */
  /*                          Public Properties                             */
  /* ********************************************************************** */

  cvService = inject(CvService);
  date = new Date();

  /* ********************************************************************** */
  /*                             Signals                                    */
  /* ********************************************************************** */

  cvs = signal<Cv[]>([]);

  /* ********************************************************************** */
  /*                            Constructor                                 */
  /* ********************************************************************** */

  constructor() {
    console.log('🔷 [CvComponent] Initialisation - Signal cvs:', this.cvs());
    this.cvService.getCvs().subscribe({
      next: (cvs) => {
        console.log('🔷 [CvComponent] Signal cvs mis à jour depuis API');
        console.log(`   → Nombre de CVs reçus: ${cvs.length}`);
        this.cvs.set(cvs);
      },
      error: () => {
        console.log(
          '🔶 [CvComponent] Erreur API - Utilisation des données fictives'
        );
        const fakeCvs = this.cvService.getFakeCvs();
        console.log(`   → Nombre de CVs fictifs: ${fakeCvs.length}`);
        this.cvs.set(fakeCvs);
        this.toastr.error(`
          Attention!! Les données sont fictives, problème avec le serveur.
          Veuillez contacter l'admin.`);
      },
    });

    this.logger.logger('je suis le cvComponent');
    this.toastr.info('Bienvenu dans notre CvTech');
  }
}

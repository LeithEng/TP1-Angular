/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Component, OnInit } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';

// Services
import { CvService } from '../services/cv.service';
import { LoggerService } from '../../services/logger.service';
import { ToastrService } from 'ngx-toastr';

// Models
import { Cv } from '../model/cv';

/* ************************************************************************** */
/*                                 Component                                  */
/* ************************************************************************** */

@Component({
  selector: 'app-cv',
  templateUrl: './cv.component.html',
  styleUrls: ['./cv.component.css'],
})
export class CvComponent implements OnInit {
  /* ********************************************************************** */
  /*                            Properties                                  */
  /* ********************************************************************** */

  cvs$!: Observable<Cv[]>;
  selectedCv$!: Observable<Cv | null>;
  date = new Date();

  /* ********************************************************************** */
  /*                            Constructor                                 */
  /* ********************************************************************** */

  constructor(
    private cvService: CvService,
    private logger: LoggerService,
    private toastr: ToastrService
  ) {
    this.logger.logger('je suis le cvComponent');
    this.toastr.info('Bienvenu dans notre CvTech');
  }

  /* ********************************************************************** */
  /*                            Lifecycle Hooks                             */
  /* ********************************************************************** */

  ngOnInit(): void {
    this.initializeCvs();
    this.initializeSelectedCv();
  }

  /* ********************************************************************** */
  /*                            Private Methods                             */
  /* ********************************************************************** */

  private initializeCvs(): void {
    this.cvs$ = this.cvService.getCvs().pipe(
      tap((cvs) => {
        this.logger.logger(`${cvs.length} CVs chargés avec succès`);
      }),
      catchError((error) => {
        console.error('Erreur lors du chargement des CVs:', error);
        this.toastr.error(
          `Attention!! Les données sont fictives, problème avec le serveur. 
          Veuillez contacter l'admin.`
        );
        return of(this.cvService.getFakeCvs());
      })
    );
  }

  private initializeSelectedCv(): void {
    this.selectedCv$ = this.cvService.selectCv$.pipe(
      tap((cv) => {
        if (cv) {
          this.logger.logger(`CV sélectionné: ${cv.firstname} ${cv.name}`);
        }
      }),
      catchError((error) => {
        console.error('Erreur lors de la sélection du CV:', error);
        this.toastr.error('Erreur lors de la sélection du CV');
        return of(null);
      })
    );
  }
}

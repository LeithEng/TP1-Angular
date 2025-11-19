/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  Subject,
  catchError,
  takeUntil,
  tap,
  map,
  switchMap,
  throwError,
} from 'rxjs';

// Services
import { CvService } from '../services/cv.service';
import { AuthService } from '../../auth/services/auth.service';
import { ToastrService } from 'ngx-toastr';

// Models
import { Cv } from '../model/cv';

// Config
import { APP_ROUTES } from '../../../config/routes.config';

/* ************************************************************************** */
/*                                 Component                                  */
/* ************************************************************************** */

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.css'],
})
export class DetailsCvComponent implements OnInit, OnDestroy {
  /* ********************************************************************** */
  /*                            Properties                                  */
  /* ********************************************************************** */

  cv$!: Observable<Cv>;
  private destroy$ = new Subject<void>();

  /* ********************************************************************** */
  /*                            Constructor                                 */
  /* ********************************************************************** */

  constructor(
    private cvService: CvService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    public authService: AuthService
  ) {}

  /* ********************************************************************** */
  /*                            Lifecycle Hooks                             */
  /* ********************************************************************** */

  ngOnInit(): void {
    this.loadCv();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ********************************************************************** */
  /*                            Private Methods                             */
  /* ********************************************************************** */

  private loadCv(): void {
    this.cv$ = this.activatedRoute.params.pipe(
      takeUntil(this.destroy$),
      map((params) => +params['id']),
      switchMap((id) => this.cvService.getCvById(id)),
      tap((cv) => {
        console.log('CV chargé:', cv);
      }),
      catchError((error) => {
        console.error('Erreur lors du chargement du CV:', error);
        this.toastr.error('CV introuvable');
        this.router.navigate([APP_ROUTES.cv]);
        return throwError(() => error);
      })
    );
  }
}

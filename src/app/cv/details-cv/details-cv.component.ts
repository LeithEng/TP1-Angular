/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

// Models
import { Cv } from '../model/cv';

// Services
import { CvService } from '../services/cv.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../auth/services/auth.service';

// Pipes
import { DefaultImagePipe } from '../pipes/default-image.pipe';

// Config
import { APP_ROUTES } from '../../../config/routes.config';

/* ************************************************************************** */
/*                                Component                                   */
/* ************************************************************************** */

@Component({
  selector: 'app-details-cv',
  templateUrl: './details-cv.component.html',
  styleUrls: ['./details-cv.component.css'],
  standalone: true,
  imports: [DefaultImagePipe],
})
export class DetailsCvComponent implements OnInit {
  /* ********************************************************************** */
  /*                          Private Properties                            */
  /* ********************************************************************** */

  private cvService = inject(CvService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private toastr = inject(ToastrService);

  /* ********************************************************************** */
  /*                          Public Properties                             */
  /* ********************************************************************** */

  authService = inject(AuthService);

  /* ********************************************************************** */
  /*                             Signals                                    */
  /* ********************************************************************** */

  cv = signal<Cv | null>(null);

  /* ********************************************************************** */
  /*                          Lifecycle Hooks                               */
  /* ********************************************************************** */

  ngOnInit() {
    const id = this.activatedRoute.snapshot.params['id'];
    this.cvService.getCvById(+id).subscribe({
      next: (cv) => {
        this.cv.set(cv);
      },
      error: (e) => {
        this.router.navigate([APP_ROUTES.cv]);
      },
    });
  }

  /* ********************************************************************** */
  /*                          Public Methods                                */
  /* ********************************************************************** */

  deleteCv(cv: Cv) {
    this.cvService.deleteCvById(cv.id).subscribe({
      next: () => {
        this.toastr.success(`${cv.name} supprimé avec succès`);
        this.router.navigate([APP_ROUTES.cv]);
      },
      error: () => {
        this.toastr.error(
          `Problème avec le serveur veuillez contacter l'admin`
        );
      },
    });
  }
}

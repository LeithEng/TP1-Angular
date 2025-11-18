import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  Validators,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { CvService } from '../services/cv.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { APP_ROUTES } from 'src/config/routes.config';
import { Cv } from '../model/cv';
import { Observable, of, Subject, timer } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  takeUntil,
} from 'rxjs/operators';

@Component({
  selector: 'app-add-cv',
  templateUrl: './add-cv.component.html',
  styleUrls: ['./add-cv.component.css'],
})
export class AddCvComponent implements OnInit, OnDestroy {
  constructor(
    private cvService: CvService,
    private router: Router,
    private toastr: ToastrService,
    private formBuilder: FormBuilder
  ) {}

  form = this.formBuilder.group(
    {
      name: ['', Validators.required],
      firstname: ['', Validators.required],
      path: [''],
      job: ['', Validators.required],
      cin: [
        '',
        {
          validators: [Validators.required, Validators.pattern('[0-9]{8}')],
          updateOn: 'blur',
        },
      ],
      age: [
        0,
        {
          validators: [Validators.required],
        },
      ],
    },
    {
      validators: [this.cinAgeCorrelationValidator.bind(this)],
    }
  );

  addCv() {
    this.cvService.addCv(this.form.value as Cv).subscribe({
      next: (cv) => {
        // clear draft on success
        localStorage.removeItem('addCv:draft');
        this.router.navigate([APP_ROUTES.cv]);
        this.toastr.success(`Le cv ${cv.firstname} ${cv.name}`);
      },
      error: (err) => {
        this.toastr.error(
          `Une erreur s'est produite, Veuillez contacter l'admin`
        );
      },
    });
  }

  get name(): AbstractControl {
    return this.form.get('name')!;
  }
  get firstname() {
    return this.form.get('firstname');
  }
  get age(): AbstractControl {
    return this.form.get('age')!;
  }
  get job() {
    return this.form.get('job');
  }
  get path() {
    return this.form.get('path');
  }
  get cin(): AbstractControl {
    return this.form.get('cin')!;
  }

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    try {
      const raw = localStorage.getItem('addCv:draft');
      if (raw) {
        const data = JSON.parse(raw);
        this.form.patchValue(data);
      }
    } catch (e) {}
    this.age.valueChanges
      .pipe(takeUntil(this.destroy$), distinctUntilChanged())
      .subscribe((val) => {
        const age = Number(val) || 0;
        if (age < 18) {
          this.path?.disable({ emitEvent: false });
          this.path?.setValue('', { emitEvent: false });
        } else {
          this.path?.enable({ emitEvent: false });
        }
      });
    this.form.valueChanges
      .pipe(debounceTime(500), takeUntil(this.destroy$))
      .subscribe((val) => {
        localStorage.setItem('addCv:draft', JSON.stringify(val));
      });
    const asyncCinValidator: AsyncValidatorFn = (control) => {
      const val = control.value;
      if (!val) return of(null);
      return timer(300).pipe(
        switchMap(() =>
          this.cvService.selectByProperty('cin', val).pipe(
            switchMap((res: any) => {
              const arr = Array.isArray(res) ? res : res.data ?? res;
              return of(arr && arr.length > 0 ? { cinTaken: true } : null);
            }),
            catchError(() => of(null))
          )
        )
      );
    };
    this.cin.setAsyncValidators(asyncCinValidator);
    this.cin.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cinAgeCorrelationValidator(group: AbstractControl): ValidationErrors | null {
    const cinVal = group.get('cin')?.value;
    const ageVal = Number(group.get('age')?.value);
    if (!cinVal || (cinVal as string).length < 2 || isNaN(ageVal)) return null;
    const firstTwo = parseInt((cinVal as string).substring(0, 2), 10);
    if (ageVal >= 60) {
      if (firstTwo >= 0 && firstTwo <= 19) return null;
      return { cinFirstCars: true };
    } else {
      if (firstTwo > 19) return null;
      return { cinFirstCars: true };
    }
  }
}

import { Component, inject } from '@angular/core';
import { FormBuilder, AbstractControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import {
  map,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  tap,
} from 'rxjs/operators';
import { CvService } from '../services/cv.service';
import { Cv } from '../model/cv';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.css'],
})
export class AutocompleteComponent {
  formBuilder = inject(FormBuilder);
  cvService = inject(CvService);
  get search(): AbstractControl {
    return this.form.get('search')!;
  }
  form = this.formBuilder.group({ search: [''] });

  suggestions$: Observable<Cv[]> = this.search.valueChanges.pipe(
    map((v) => (v ?? '').toString().trim()),
    debounceTime(300),
    distinctUntilChanged(),
    tap((term) => this.cvService.setFilter(term)),
    switchMap((term) =>
      term.length >= 2 ? this.cvService.filteredCvs$ : of([])
    )
  );
  selected: Cv | null = null;

  select(cv: Cv) {
    this.selected = cv;
    this.cvService.selectCv(cv);
    this.form.patchValue({ search: `${cv.firstname} ${cv.name}` });
  }
}

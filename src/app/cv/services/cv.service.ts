/* ************************************************************************** */
/*                                Dependencies                                */
/* ************************************************************************** */

// Lib dependencies
import { Injectable, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

// Models
import { Cv } from '../model/cv';

// Config
import { API } from '../../../config/api.config';

/* ************************************************************************** */
/*                                  Service                                   */
/* ************************************************************************** */

@Injectable({
  providedIn: 'root',
})
export class CvService {
  /* ********************************************************************** */
  /*                          Private Properties                            */
  /* ********************************************************************** */

  private http = inject(HttpClient);
  private cvs: Cv[] = [];

  /* ********************************************************************** */
  /*                             Signals                                    */
  /* ********************************************************************** */

  selectedCv = signal<Cv | null>(null);

  /* ********************************************************************** */
  /*                            Constructor                                 */
  /* ********************************************************************** */

  constructor() {
    this.cvs = [
      new Cv(1, 'aymen', 'sellaouti', 'teacher', 'as.jpg', '1234', 40),
      new Cv(2, 'skander', 'sellaouti', 'enfant', '       ', '1234', 4),
    ];
  }

  /* ********************************************************************** */
  /*                           Public Methods                               */
  /* ********************************************************************** */

  getFakeCvs(): Cv[] {
    return this.cvs;
  }

  getCvs(): Observable<Cv[]> {
    return this.http.get<Cv[]>(API.cv);
  }

  getCvById(id: number): Observable<Cv> {
    return this.http.get<Cv>(API.cv + id);
  }

  findCvById(id: number): Cv | null {
    return this.cvs.find((cv) => cv.id == id) ?? null;
  }

  addCv(cv: Cv): Observable<Cv> {
    return this.http.post<any>(API.cv, cv);
  }

  deleteCvById(id: number): Observable<any> {
    return this.http.delete<any>(API.cv + id);
  }

  deleteCv(cv: Cv): boolean {
    const index = this.cvs.indexOf(cv);
    if (index > -1) {
      this.cvs.splice(index, 1);
      return true;
    }
    return false;
  }

  selectByName(name: string) {
    const search = `{"where":{"name":{"like":"%${name}%"}}}`;
    const params = new HttpParams().set('filter', search);
    return this.http.get<any>(API.cv, { params });
  }

  selectByProperty(property: string, value: string) {
    const search = `{"where":{"${property}":"${value}"}}`;
    const params = new HttpParams().set('filter', search);
    return this.http.get<Cv[]>(API.cv, { params });
  }

  selectCv(cv: Cv): void {
    console.log('🔵 [CvService] Signal selectedCv mis à jour:', cv);
    console.log(`   → CV sélectionné: ${cv.firstname} ${cv.name} (${cv.job})`);
    this.selectedCv.set(cv);
  }
}

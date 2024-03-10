import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Suministro } from '../models/suministro.model';
import { AppSettings } from '../app.settings';

const baseUrl =  AppSettings.API_ENDPOINT + "/util";

@Injectable({
  providedIn: 'root'
})

export class SuministroService {
  constructor(private http: HttpClient) {}

  listarSuministro(): Observable<Suministro[]> {
    return this.http.get<Suministro[]>(`${baseUrl}/listaSuministro`);
  }

}

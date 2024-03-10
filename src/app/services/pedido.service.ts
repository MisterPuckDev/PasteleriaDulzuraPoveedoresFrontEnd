import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Producto} from '../models/producto.model';
import {AppSettings} from '../app.settings';
import {map} from "rxjs/operators";
import {Pedido} from "../models/pedido.model";

const baseUrl = AppSettings.API_ENDPOINT + "/pedido";
const baseUrlConsulta = AppSettings.API_ENDPOINT + "/consultaPedido";

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private http: HttpClient) {
  }

  inserta(obj: Pedido): Observable<any> {
    console.log("objBoleta2: ", obj);
    return this.http.post(baseUrl + "/registraProducto", obj);
  }

}

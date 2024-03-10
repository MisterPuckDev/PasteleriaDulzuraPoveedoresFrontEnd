import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto.model';
import { AppSettings } from '../app.settings';
import { map } from "rxjs/operators";

const baseUrl =  AppSettings.API_ENDPOINT + "/crudProducto";
const baseUrlConsulta =  AppSettings.API_ENDPOINT + "/consultaProducto";

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http:HttpClient) { }

  consultaPorNombre(filtro:string):Observable<Producto[]>{
      return  this.http.get<Producto[]>(baseUrl +"/listaProductoPorNombreLike/"+filtro);
  }

  listarProducto(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${baseUrl}/listaProducto`);
  }

  inserta(obj:Producto):Observable<any>{
      return this.http.post(baseUrl +"/registraProducto", obj);
  }

  actualiza(obj:Producto):Observable<any>{
    return this.http.put(baseUrl + "/actualizaProducto", obj);
}

  // Método para obtener los detalles de un producto específico por su ID.
  obtenerProductoPorId(productoId: number | undefined): Observable<Producto> {
    return this.http.get<Producto>(`${baseUrl}/detalleProducto/${productoId}`);
  }

  elimina(productoId:number):Observable<any>{
      return this.http.delete(baseUrl + "/eliminaProducto/"+ productoId);
  }

  //consulta
  consulta(nombre:string,
          precio:number,
          stock:number,
          ubigeoId:number,
          tipoProductoId:number):Observable<Producto[]> {

            const params = new HttpParams()
            .set("nombre", nombre)
            .set("precio", precio)
            .set("stock", stock)
            .set("ubigeoId", ubigeoId)
            .set('tipoProductoId', tipoProductoId);

    return  this.http.get<Producto[]>(baseUrlConsulta +"/consultaProductoPorParametros", {params});
  }

  generateDocumentReport(nombre:string,
                         precio:number,
                         stock:number,
                         ubigeoId:number,
                         tipoProductoId:number): Observable<any> {
              const params = new HttpParams()
              .set("nombre", nombre)
              .set("precio", precio)
              .set("stock", stock)
              .set("ubigeoId", ubigeoId)
              .set('tipoProductoId', tipoProductoId);

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http.post(baseUrlConsulta +"/reporteProductoPdf?nombre="+nombre+"&precio="+precio+"&stock="+stock+"&ubigeoId="+ubigeoId+"&tipoProductoId="+tipoProductoId,'', requestOptions).pipe(map((response)=>{
        return {
            filename: 'reporteProducto2024.pdf',
            data: new Blob([response], {type: 'application/pdf'})
        };
    }));
  }


  generateDocumentExcel(nombre:string,
                        precio:string,
                        stock:number,
                        ubigeoId:number,
                        tipoProductoId:number): Observable<any> {

        const params = new HttpParams()
        .set("nombre", nombre)
        .set("precio", precio)
        .set("stock", stock)
        .set("ubigeoId", ubigeoId)
        .set('tipoProductoId', tipoProductoId);

        let headers = new HttpHeaders();
        headers.append('Accept', 'application/vnd.ms-excel');
        let requestOptions: any = { headers: headers, responseType: 'blob' };

        return this.http.post(baseUrlConsulta +"/reporteProductoExcel?nombre="+nombre+"&precio="+precio+"&stock="+stock+"&ubigeoId="+ubigeoId+"&tipoProductoId="+tipoProductoId,'', requestOptions).pipe(map((response)=>{
        return {
        filename: 'reporteProducto2024.xlsx',
        data: new Blob([response], {type: 'application/vnd.ms-excel'})
        };
        }));
    }

}

// Importa módulos necesarios de Angular y RxJS para manejar peticiones HTTP, observables y operaciones reactivas.
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
// Importaciones locales para modelos y configuraciones de la aplicación.
import { Proveedor } from '../models/proveedor.model';
import { AppSettings } from '../app.settings';
// Importación para utilizar operadores de transformación de datos.
import { map } from "rxjs/operators";

// Definición de constantes para construir las URLs de las APIs de proveedor basadas en configuraciones globales.
const baseUrl =  AppSettings.API_ENDPOINT + "/crudProveedor";
const baseUrlConsulta =  AppSettings.API_ENDPOINT + "/consultaProveedor";

// Decorador que marca la clase como un servicio que puede ser inyectado, con un ámbito de aplicación global.
@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  // Constructor que inyecta el cliente HTTP para hacer peticiones HTTP.
  constructor(private http:HttpClient) { }

  // Método para consultar proveedores por razón social. Retorna un observable de un arreglo de proveedores.
  consultaPorRazonSocial(filtro:string):Observable<Proveedor[]>{
      return  this.http.get<Proveedor[]>(baseUrl +"/listaProveedorPorRazonSocialLike/"+filtro);
  }

  // Método para listar todos los proveedores. Retorna un observable de un arreglo de proveedores.
  listarProveedor(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${baseUrl}/listaProveedor`);
  }

  // Método para insertar un nuevo proveedor. Retorna un observable de cualquier tipo como respuesta del servidor.
  inserta(obj:Proveedor):Observable<any>{
      return this.http.post(baseUrl +"/registraProveedor", obj);
  }

  // Método para actualizar un proveedor existente. Retorna un observable de cualquier tipo como respuesta del servidor.
  actualiza(obj:Proveedor):Observable<any>{
    return this.http.put(baseUrl + "/actualizaProveedor", obj);
}

  // Método para actualizar el estado de un proveedor. Retorna un observable de cualquier tipo como respuesta del servidor.
  actualizaEstado(obj:Proveedor):Observable<any>{
  return this.http.put(baseUrl + "/actualizaEstadoProveedor", obj);
}

  // Método para obtener los detalles de un proveedor específico por su ID. Retorna un observable de un proveedor.
  obtenerProveedorPorId(proveedorId: number | undefined): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${baseUrl}/detalleProveedor/${proveedorId}`);
  }

  // Método para eliminar un proveedor por su ID. Retorna un observable de cualquier tipo como respuesta del servidor.
  elimina(proveedorId:number):Observable<any>{
      return this.http.delete(baseUrl + "/eliminaProveedor/"+ proveedorId);
  }

  // Método para consultar proveedores con filtros específicos. Retorna un observable de un arreglo de proveedores.
  consulta(razonSocial:string, ruc:string, estado:number):Observable<Proveedor[]> {
            const params = new HttpParams()
            .set("razonSocial", razonSocial)
            .set("ruc", ruc)
            .set("estado", estado);
    return  this.http.get<Proveedor[]>(baseUrlConsulta +"/consultaProveedorPorParametros", {params});
  }

  // Método para generar un informe en PDF de proveedores con filtros específicos. Retorna un observable con datos para la descarga.
  generateDocumentReport(ruc:string, razonSocial:string, estado:number): Observable<any> {
              const params = new HttpParams()
              .set("ruc", ruc)
              .set("razonSocial", razonSocial)
              .set("estado", estado);
    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };
    return this.http.post(baseUrlConsulta +"/reporteProveedorPdf?ruc="+ruc+"&razonSocial="+razonSocial+"&estado="+estado,'', requestOptions).pipe(map((response)=>{
        return {
            filename: 'reporteProveedor.pdf',
            data: new Blob([response], {type: 'application/pdf'})
        };
    }));
  }

  // Método para generar un informe en Excel de proveedores con filtros específicos. Retorna un observable con datos para la descarga.
  generateDocumentExcel(ruc:string, razonSocial:string, estado:number): Observable<any> {
        const params = new HttpParams()
        .set("ruc", ruc)
        .set("razonSocial", razonSocial)
        .set("estado", estado);
        let headers = new HttpHeaders();
        headers.append('Accept', 'application/vnd.ms-excel');
        let requestOptions: any = { headers: headers, responseType: 'blob' };
        return this.http.post(baseUrlConsulta +"/reporteProveedorExcel?ruc="+ruc+"&razonSocial="+razonSocial+"&estado="+estado,'', requestOptions).pipe(map((response)=>{
        return {
        filename: 'reporteProveedor.xlsx',
        data: new Blob([response], {type: 'application/vnd.ms-excel'})
        };
        }));
    }

}

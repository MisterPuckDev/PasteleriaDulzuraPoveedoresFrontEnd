
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../models/categoria.model';
import { AppSettings } from '../app.settings';
import { map } from "rxjs/operators";

const baseUrl =  AppSettings.API_ENDPOINT + "/crudCategoria";
const baseUrlConsulta =  AppSettings.API_ENDPOINT + "/consultaCategoria";

@Injectable({
  providedIn: 'root'
})
export class CategoriaService {

  constructor(private http:HttpClient) { }

  consultaPorCategoria(filtro:string):Observable<Categoria[]>{
      return  this.http.get<Categoria[]>(baseUrl +"/listaCategoriaPorNombreLike/"+filtro);
  }

  listarCategoria(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(`${baseUrl}/listaCategoria`);
  }

  inserta(obj:Categoria):Observable<any>{
      return this.http.post(baseUrl +"/registraCategoria", obj);
  }

  actualiza(obj:Categoria):Observable<any>{
    return this.http.put(baseUrl + "/actualizaCategoria", obj);
}

  // Método para obtener los detalles de un proveedor específico por su ID.
  obtenerCategoriaPorId(categoriaId: number | undefined): Observable<Categoria> {
    return this.http.get<Categoria>(`${baseUrl}/detalleCategoria/${categoriaId}`);
  }

  elimina(categoriaId:number):Observable<any>{
      return this.http.delete(baseUrl + "/eliminaCategoria/"+ categoriaId);
  }

  //consulta
  consulta(descripcion:string,
          nombre:string,
          ubigeoId:number,
          tipoCategoriaId:number):Observable<Categoria[]> {

            const params = new HttpParams()
            .set("descripcion", descripcion)
            .set("nombre", nombre)
            .set("ubigeoId", ubigeoId)
            .set('tipoCategoriaId', tipoCategoriaId);

    return  this.http.get<Categoria[]>(baseUrlConsulta +"/consultaCategoriaPorParametros", {params});
  }

  generateDocumentReport(descripcion:string,
                         nombre:string,
                         ubigeoId:number,
                         tipoCategoriaId:number): Observable<any> {
              const params = new HttpParams()
              .set("descripcion", descripcion)
              .set("nombre", nombre)
              .set("ubigeoId", ubigeoId)
              .set('tipoCategoriaId', tipoCategoriaId);

    let headers = new HttpHeaders();
    headers.append('Accept', 'application/pdf');
    let requestOptions: any = { headers: headers, responseType: 'blob' };

    return this.http.post(baseUrlConsulta +"/reporteCategoriaPdf?descripcion="+descripcion+"&nombre="+nombre+"&ubigeoId="+ubigeoId+"&tipoCategoriaId="+tipoCategoriaId,'', requestOptions).pipe(map((response)=>{
        return {
            filename: 'reporteCategoria20232.pdf',
            data: new Blob([response], {type: 'application/pdf'})
        };
    }));
  }


  generateDocumentExcel(descripcion:string,
                        nombre:string,
                        ubigeoId:number,
                        tipoCategoriaId:number): Observable<any> {

        const params = new HttpParams()
        .set("descripcion", descripcion)
        .set("nombre", nombre)
        .set("ubigeoId", ubigeoId)
        .set('tipoCategoriaId', tipoCategoriaId);

        let headers = new HttpHeaders();
        headers.append('Accept', 'application/vnd.ms-excel');
        let requestOptions: any = { headers: headers, responseType: 'blob' };

        return this.http.post(baseUrlConsulta +"/reporteCategoriaExcel?descripcion="+descripcion+"&nombre="+nombre+"&ubigeoId="+ubigeoId+"&tipoCategoriaId="+tipoCategoriaId,'', requestOptions).pipe(map((response)=>{
        return {
        filename: 'reporteProveedor20232.xlsx',
        data: new Blob([response], {type: 'application/vnd.ms-excel'})
        };
        }));
    }

}

import { MatPaginator } from '@angular/material/paginator';
import { Component, ViewChild } from '@angular/core';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { MatTableDataSource } from '@angular/material/table';
import { Proveedor } from 'src/app/models/proveedor.model';

@Component({
  selector: 'app-consulta-proveedor',
  templateUrl: './consulta-proveedor.component.html',
  styleUrls: ['./consulta-proveedor.component.css']
})
export class ConsultaProveedorComponent {

   dataSource:any;

   @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

   displayedColumns = ["proveedorId", "ruc", "razonSocial", "direccion", "telefono", "correo", "estado", "fechaRegistro"];

  razonSocial:string = "";
  ruc:string = "";
  estado:boolean  = true; // Asumiendo que 1 es activo y 0 inactivo

  constructor(private proveedorService: ProveedorService){
  }

  consulta(){
       this.proveedorService.consulta(this.razonSocial, this.ruc, this.estado ? 1 : 0).subscribe(
              x => {
                    this.dataSource = new MatTableDataSource<Proveedor>(x);
                    this.dataSource.paginator = this.paginator;
              }
       );
  }

  exportarPDF() {
    this.proveedorService.generateDocumentReport(this.razonSocial, this.ruc, this.estado? 1 : 0).subscribe(
          response => {
            var url = window.URL.createObjectURL(response.data);
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.setAttribute('target', 'blank');
            a.href = url;
            a.download = response.filename;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        });
  }

  exportarEXCEL() {

    this.proveedorService.generateDocumentExcel(this.ruc, this.razonSocial, this.estado ? 1 : 0).subscribe(
          response => {
            console.log(response);
            var url = window.URL.createObjectURL(response.data);
            var a = document.createElement('a');
            document.body.appendChild(a);
            a.setAttribute('style', 'display: none');
            a.setAttribute('target', 'blank');
            a.href = url;
            a.download = response.filename;
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        });
  }

}

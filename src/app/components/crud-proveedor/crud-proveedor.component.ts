import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Proveedor } from 'src/app/models/proveedor.model';
import { ProveedorService } from 'src/app/services/proveedor.service';
import Swal from 'sweetalert2'
import { CrudProveedorAddComponent } from '../crud-proveedor-add/crud-proveedor-add.component';
import { CrudProveedorUpdateComponent } from '../crud-proveedor-update/crud-proveedor-update.component';

@Component({
  selector: 'app-crud-proveedor',
  templateUrl: './crud-proveedor.component.html',
  styleUrls: ['./crud-proveedor.component.css']
})
export class CrudProveedorComponent implements OnInit {

  // Para la Grilla
  filtro: string = "";

  // Grilla
  dataSource = new MatTableDataSource<Proveedor>(); // Inicializa el dataSource

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns: string[] = ['proveedorId', 'ruc', 'razonSocial', 'direccion', 'telefono', 'correo', 'suministro', 'fechaRegistro', 'estado', 'acciones'];

  constructor(
    private formBuilder: FormBuilder,
    private dialogService: MatDialog,
    private proveedorService: ProveedorService
  ) {}

  ngOnInit(): void {
    this.refreshTable();
  }

  openAddDialog() {
    const dialogRef = this.dialogService.open(CrudProveedorAddComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  openUpdateDialog(obj: Proveedor) {
    console.log(">>> openUpdateDialog  >>");

    const dialogRef = this.dialogService.open(CrudProveedorUpdateComponent, {
      width: '400px', // O cualquier tamaño adecuado
      data: { proveedor: { ...obj } } // Clonar el objeto antes de pasarlo al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(">>> result >> " + result);
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  consultaProveedor() {
    this.refreshTable();
  }

  actualizaEstado(obj:Proveedor){
    obj.estado =   obj.estado == 1 ? 0 : 1;
    this.proveedorService.actualizaEstado(obj).subscribe();
}

  elimina(obj:Proveedor){
    Swal.fire({
      title: '¿Desea eliminar?',
      text: "Los cambios no se van a revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, elimina',
      cancelButtonText: 'No, cancelar'
    }).then((result) => {
          if (result.isConfirmed) {
              this.proveedorService.elimina(obj.proveedorId || 0).subscribe(
                    x => {
                          this.refreshTable();
                          Swal.fire('Mensaje', x.mensaje, 'info');
                    }
              );
          }
    })
}

  private refreshTable() {
    this.proveedorService.consultaPorRazonSocial(this.filtro==""?"todos":this.filtro).subscribe(
      x => {
        this.dataSource.data = x; // Asigna los datos al dataSource
        this.dataSource.paginator = this.paginator;
      }
    );
  }
}

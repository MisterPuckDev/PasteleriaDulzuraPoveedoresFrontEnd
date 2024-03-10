import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Producto } from 'src/app/models/producto.model';
import { ProductoService } from 'src/app/services/producto.service';
import Swal from 'sweetalert2'
import { CrudProductoAddComponent } from '../crud-producto-add/crud-producto-add.component';
import { CrudProductoUpdateComponent } from '../crud-producto-update/crud-producto-update.component';

@Component({
  selector: 'app-crud-producto',
  templateUrl: './crud-producto.component.html',
  styleUrls: ['./crud-producto.component.css']
})
export class CrudProductoComponent implements OnInit {

  // Para la Grilla
  filtro: string = "";

  // Grilla
  dataSource = new MatTableDataSource<Producto>(); // Inicializa el dataSource

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns: string[] = ['productoId', 'nombre', 'precio', 'stock', 'categoria', 'proveedor','acciones'];

  constructor(
    private formBuilder: FormBuilder,
    private dialogService: MatDialog,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    this.refreshTable();
  }

  openAddDialog() {
    const dialogRef = this.dialogService.open(CrudProductoAddComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  openUpdateDialog(obj: Producto) {
    console.log(">>> openUpdateDialog  >>");

    const dialogRef = this.dialogService.open(CrudProductoUpdateComponent, {
      width: '400px', // O cualquier tamaño adecuado
      data: { producto: { ...obj } } // Clonar el objeto antes de pasarlo al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(">>> result >> " + result);
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  consultaProducto() {
    this.refreshTable();
  }

  elimina(obj:Producto){
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
              this.productoService.elimina(obj.productoId || 0).subscribe(
                    x => {
                          this.refreshTable();
                          Swal.fire('Mensaje', x.mensaje, 'info');
                    }
              );
          }
    })
}

  private refreshTable() {
    this.productoService.consultaPorNombre(this.filtro==""?"todos":this.filtro).subscribe(
      x => {
        this.dataSource.data = x; // Asigna los datos al dataSource
        this.dataSource.paginator = this.paginator;
      }
    );
  }
}

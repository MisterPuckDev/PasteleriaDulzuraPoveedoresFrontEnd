import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Categoria} from 'src/app/models/categoria.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2'
import { CrudCategoriaAddComponent } from '../crud-categoria-add/crud-categoria-add.component';
import { CrudCategoriaUpdateComponent } from '../crud-categoria-update/crud-categoria-update.component';

@Component({
  selector: 'app-crud-categoria',
  templateUrl: './crud-categoria.component.html',
  styleUrls: ['./crud-categoria.component.css']
})
export class CrudCategoriaComponent implements OnInit {

  // Para la Grilla
  filtro: string = "";

  // Grilla
  dataSource = new MatTableDataSource<Categoria>(); // Inicializa el dataSource

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  displayedColumns: string[] = ['categoriaId', 'nombre', 'descripcion', 'acciones'];

  constructor(
    private formBuilder: FormBuilder,
    private dialogService: MatDialog,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.refreshTable();
  }

  openAddDialog() {
    const dialogRef = this.dialogService.open(CrudCategoriaAddComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  openUpdateDialog(obj: Categoria) {
    console.log(">>> openUpdateDialog  >>");

    const dialogRef = this.dialogService.open(CrudCategoriaUpdateComponent, {
      width: '400px', // O cualquier tamaño adecuado
      data: { categoria: { ...obj } } // Clonar el objeto antes de pasarlo al diálogo
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(">>> result >> " + result);
      if (result === 1) {
        this.refreshTable();
      }
    });
  }

  consultaCategoria() {
    this.refreshTable();
  }


  elimina(obj:Categoria){
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
              this.categoriaService.elimina(obj.categoriaId || 0).subscribe(
                    x => {
                          this.refreshTable();
                          Swal.fire('Mensaje', x.mensaje, 'info');
                    }
              );
          }
    })
}

  private refreshTable() {
    this.categoriaService.consultaPorCategoria(this.filtro==""?"todos":this.filtro).subscribe(
      x => {
        this.dataSource.data = x; // Asigna los datos al dataSource
        this.dataSource.paginator = this.paginator;
      }
    );
  }
}

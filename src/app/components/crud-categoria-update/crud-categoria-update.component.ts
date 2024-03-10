import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Categoria } from 'src/app/models/categoria.model';
import { CategoriaService } from 'src/app/services/categoria.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-categoria-update',
  templateUrl: './crud-categoria-update.component.html',
  styleUrls: ['./crud-categoria-update.component.css']
})
export class CrudCategoriaUpdateComponent implements OnInit {

  categoria: Categoria = new Categoria();
  selectedValue: number | undefined = 0;

  formsActualiza = this.formBuilder.group({
    validaDescripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    validaNombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
  });

  constructor(

    private categoriaService: CategoriaService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrudCategoriaUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categoria: Categoria }
  ) {}

  ngOnInit(): void {
    if (this.data.categoria && this.data.categoria.categoriaId) {
      this.obtenerDataCategoria(this.data.categoria);
    }
  }

  compararElementos(opcionSeleccionada: string, valorActual: string): boolean {
    return opcionSeleccionada === valorActual;
  }

  obtenerDataCategoria(categoria: Categoria): void {
    this.categoriaService.obtenerCategoriaPorId(categoria.categoriaId).subscribe(data => {
      this.categoria = data;
      console.log(this.categoria); // Asegúrate de que la respuesta del proveedor se imprima correctamente
      this.cargarDatosFormulario(this.categoria);
    });
  }


  cargarDatosFormulario(categoria: Categoria): void {
    console.log("cargamos data");

    this.formsActualiza.patchValue({

      validaDescripcion: categoria.descripcion,
      validaNombre: categoria.nombre,
  });
}

  actualiza(): void {
    this.categoriaService.actualiza(this.categoria).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Categoria actualizado con éxito', 'success');
        this.dialogRef.close(1); // Indica éxito al cerrar
      },
      error: () => {
        Swal.fire('Error', 'Hubo un error al actualizar la Categoria', 'error');
      }
    });
  }

  salir(): void {
    this.dialogRef.close();
  }
}

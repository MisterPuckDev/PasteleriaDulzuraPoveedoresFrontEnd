import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Categoria } from 'src/app/models/categoria.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-crud-categoria-add',
  templateUrl: './crud-categoria-add.component.html',
  styleUrls: ['./crud-categoria-add.component.css']
})
export class CrudCategoriaAddComponent implements OnInit {


  formsRegistra = this.formBuilder.group({

    validaDescripcion: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    validaNombre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
  });

  categoria: Categoria = {
    categoriaId: 0,
    descripcion: "",
    nombre: "",
  };

  constructor(

    private categoriaService: CategoriaService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrudCategoriaAddComponent>
  ) {}

  ngOnInit(): void {
  }


  registra(): void {
    if (this.formsRegistra.valid) {
      this.categoriaService.inserta(this.categoria).subscribe(
        response => {
          Swal.fire({
            title: 'Mensaje',
            text: response.mensaje,
            icon: 'success',
          }).then((result) => {
            if (result.value) {
              this.dialogRef.close(1); // Cierra el diálogo enviando 1 como resultado
            }
          });
        },
        error => {
          if (error.error && error.error.mensaje) {
            Swal.fire('Error', error.error.mensaje, 'error'); // Muestra el mensaje de error devuelto por el backend
          } else {
            Swal.fire('Error', 'Ocurrió un error al registrar la categoria.', 'error');
          }
        }
      );
    } else {
      Swal.fire('Validación', 'Complete los campos requeridos.', 'warning');
    }
  }

  salir(): void {
    this.dialogRef.close();
  }

  limpiarFormulario(): void {
    this.formsRegistra.reset();
    this.categoria = {
      categoriaId: 0,
      descripcion: "",
      nombre: "",
    };
  }
}

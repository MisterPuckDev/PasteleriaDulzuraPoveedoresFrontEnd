import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Proveedor } from 'src/app/models/proveedor.model';
import { Suministro } from 'src/app/models/suministro.model';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { SuministroService } from 'src/app/services/suministro.service';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-crud-proveedor-add',
  templateUrl: './crud-proveedor-add.component.html',
  styleUrls: ['./crud-proveedor-add.component.css']
})
export class CrudProveedorAddComponent implements OnInit {

  suministros: Suministro[] = [];

  formsRegistra = this.formBuilder.group({
    validaRUC: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')] ] ,
    validaRazonSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    validaDireccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
    validaTelefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')] ] ,
    validaCorreo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    validaSuministro: ['', [Validators.required]],
  });

  proveedor: Proveedor = {
    proveedorId: 0,
    ruc: "",
    razonSocial: "",
    direccion: "",
    telefono: "",
    correo: "",
    suministro: {}, // Inicializado como un objeto vacío
    estado: 1,
  };

  constructor(
    private suministroService: SuministroService,
    private proveedorService: ProveedorService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrudProveedorAddComponent>
  ) {}

  ngOnInit(): void {
    this.cargarSuministros();
  }

  cargarSuministros(): void {
    this.suministroService.listarSuministro().subscribe(data => {
      this.suministros = data;
    });
  }

  onSuministroChange(suministroId: number): void {
    // Si suministro es undefined, inicializarlo como un objeto vacío
    if (!this.proveedor.suministro) {
      this.proveedor.suministro = new Suministro();
    }
    this.proveedor.suministro.suministroId = suministroId;
  }

  registra(): void {
    if (this.formsRegistra.valid) {
      this.proveedorService.inserta(this.proveedor).subscribe(
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
            Swal.fire('Error', 'Ocurrió un error al registrar el proveedor.', 'error');
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
    this.proveedor = {
      proveedorId: 0,
      ruc: "",
      razonSocial: "",
      direccion: "",
      telefono: "",
      correo: "",
      suministro: {}, // Reset suministro como un objeto vacío
      estado: 1,
    };
  }
}

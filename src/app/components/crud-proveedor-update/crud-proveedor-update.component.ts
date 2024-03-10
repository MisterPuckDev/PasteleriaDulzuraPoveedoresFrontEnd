import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Proveedor } from 'src/app/models/proveedor.model';
import { Suministro } from 'src/app/models/suministro.model';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { SuministroService } from 'src/app/services/suministro.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-proveedor-update',
  templateUrl: './crud-proveedor-update.component.html',
  styleUrls: ['./crud-proveedor-update.component.css']
})
export class CrudProveedorUpdateComponent implements OnInit {

  suministros: Suministro[] = [];
  proveedor: Proveedor = new Proveedor();
  selectedValue: number | undefined = 0;

  formsActualiza = this.formBuilder.group({
    validaRUC: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    validaRazonSocial: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    validaDireccion: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(150)]],
    validaTelefono: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
    validaCorreo: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
    validaSuministro: ['', [Validators.required]],
  });

  constructor(
    private suministroService: SuministroService,
    private proveedorService: ProveedorService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrudProveedorUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { proveedor: Proveedor }
  ) {}

  ngOnInit(): void {
    this.cargarSuministros();

    if (this.data.proveedor) {
      this.proveedor = this.data.proveedor;
      this.obtenerDataProveedor(this.proveedor);
    }

  }

  compararElementos(opcionSeleccionada: string, valorActual: string): boolean {
    return opcionSeleccionada === valorActual;
  }

  obtenerDataProveedor(proveedor: Proveedor): void {
    this.proveedorService.obtenerProveedorPorId(proveedor.proveedorId).subscribe(data => {
      this.proveedor = data;
      this.selectedValue = this.proveedor.suministro?.suministroId;
      console.log(this.proveedor); // Asegúrate de que la respuesta del proveedor se imprima correctamente
      this.cargarDatosFormulario(this.proveedor);
    });
  }

  cargarSuministros(): void {
    this.suministroService.listarSuministro().subscribe(data => {
      this.suministros = data;
      // Carga el proveedor una vez que los suministros están disponibles
      if (this.data.proveedor) {
        this.proveedor = this.data.proveedor;
        this.cargarDatosFormulario(this.proveedor);
      }
    });
  }

  cargarDatosFormulario(proveedor: Proveedor): void {
    console.log("cargamos data");
    console.log("sum id: " + proveedor.suministro?.suministroId?.toString());
    console.log("sum id: " + proveedor.suministro?.suministroId?.toString() ?? '');
    this.formsActualiza.patchValue({
      validaRUC: proveedor.ruc,
      validaRazonSocial: proveedor.razonSocial,
      validaDireccion: proveedor.direccion,
      validaTelefono: proveedor.telefono,
      validaCorreo: proveedor.correo,
      validaSuministro: proveedor.suministro?.suministroId?.toString() ?? '',
  });
}

  actualiza(): void {
    this.proveedorService.actualiza(this.proveedor).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Proveedor actualizado con éxito', 'success');
        this.dialogRef.close(1); // Indica éxito al cerrar
      },
      error: () => {
        Swal.fire('Error', 'Hubo un error al actualizar el proveedor', 'error');
      }
    });
  }

  salir(): void {
    this.dialogRef.close();
  }

  onSuministroChange(suministroId: number): void {
    this.proveedor.suministro = this.suministros.find(s => s.suministroId === suministroId);
  }
}

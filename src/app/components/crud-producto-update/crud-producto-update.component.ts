import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from 'src/app/models/producto.model';
import { Proveedor } from 'src/app/models/proveedor.model';
import { Categoria } from 'src/app/models/categoria.model';
import { ProductoService } from 'src/app/services/producto.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { CategoriaService } from 'src/app/services/categoria.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crud-producto-update',
  templateUrl: './crud-producto-update.component.html',
  styleUrls: ['./crud-producto-update.component.css']
})
export class CrudProductoUpdateComponent implements OnInit {

  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];
  producto: Producto = new Producto();
  selectedValue: number | undefined = 0;

  formsActualiza = this.formBuilder.group({

    validaNombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    validaPrecio: [0, [Validators.required, Validators.min(0)]],
    validaStock: [0, [Validators.required, Validators.min(0)]],
    validaCategoria: ['', [Validators.required]],
    validaProveedor: ['', [Validators.required]],
  });

  constructor(
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrudProductoUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { producto: Producto }
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProveedores();

    if (this.data.producto) {
      this.producto = this.data.producto;
      this.obtenerDataProducto(this.producto);
    }

  }

  compararElementos(opcionSeleccionada: string, valorActual: string): boolean {
    return opcionSeleccionada === valorActual;
  }

  obtenerDataProducto(producto: Producto): void {
    this.productoService.obtenerProductoPorId(producto.productoId).subscribe(data => {
      this.producto = data;
      this.selectedValue = this.producto.categoria?.categoriaId;
      this.selectedValue = this.producto.proveedor?.proveedorId;
      console.log(this.producto); // Asegúrate de que la respuesta del proveedor se imprima correctamente
      this.cargarDatosFormulario(this.producto);
    });
  }

  cargarCategorias(): void {
    this.categoriaService.listarCategoria().subscribe(data => {
      this.categorias = data;
      // Carga el producto una vez que las categorias están disponibles
      if (this.data.producto) {
        this.producto = this.data.producto;
        this.cargarDatosFormulario(this.producto);
      }
    });
  }

  cargarProveedores(): void {
    this.proveedorService.listarProveedor().subscribe(data => {
      this.proveedores = data;
      // Carga el producto una vez que los proveedores están disponibles
      if (this.data.producto) {
        this.producto = this.data.producto;
        this.cargarDatosFormulario(this.producto);
      }
    });
  }

  cargarDatosFormulario(producto: Producto): void {
    console.log("cargamos data");
    console.log("sum id: " + producto.categoria?.categoriaId?.toString());
    console.log("sum id: " + producto.categoria?.categoriaId?.toString() ?? '');
    console.log("sum id: " + producto.proveedor?.proveedorId?.toString());
    console.log("sum id: " + producto.proveedor?.proveedorId?.toString() ?? '');
    this.formsActualiza.patchValue({
      validaNombre: producto.nombre,
      validaPrecio: producto.precio ?? null,
    validaStock: producto.stock ?? null,
      validaCategoria: producto.categoria?.categoriaId?.toString() ?? '',
      validaProveedor: producto.proveedor?.proveedorId?.toString() ?? '',
  });
}

  actualiza(): void {
    this.productoService.actualiza(this.producto).subscribe({
      next: () => {
        Swal.fire('Actualizado', 'Producto actualizado con éxito', 'success');
        this.dialogRef.close(1); // Indica éxito al cerrar
      },
      error: () => {
        Swal.fire('Error', 'Hubo un error al actualizar el producto', 'error');
      }
    });
  }

  salir(): void {
    this.dialogRef.close();
  }

  onCategoriaChange(categoriaId: number): void {
    this.producto.categoria = this.categorias.find(s => s.categoriaId === categoriaId);
  }

  onProveedorChange(proveedorId: number): void {
    this.producto.proveedor = this.proveedores.find(s => s.proveedorId === proveedorId);
  }
}

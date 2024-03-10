import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Producto } from 'src/app/models/producto.model';
import { Categoria } from 'src/app/models/categoria.model';
import { Proveedor } from 'src/app/models/proveedor.model';
import { CategoriaService } from 'src/app/services/categoria.service';
import { ProveedorService } from 'src/app/services/proveedor.service';
import { ProductoService } from 'src/app/services/producto.service';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-crud-producto-add',
  templateUrl: './crud-producto-add.component.html',
  styleUrls: ['./crud-producto-add.component.css']
})
export class CrudProductoAddComponent implements OnInit {

  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];

  formsRegistra = this.formBuilder.group({
    validaNombre: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
    validaPrecio: ['', [Validators.required]],
    validaStock: ['', [Validators.required]] ,
    validaCategoria: ['', [Validators.required]],
    validaProveedor: ['', [Validators.required]],
  });

  producto: Producto = {
    productoId: 0,
    nombre: "",
    precio: 0,
    stock: 0,
    categoria: {}, // Inicializado como un objeto vacío
    proveedor: {},
  };

  constructor(
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CrudProductoAddComponent>
  ) {}

  ngOnInit(): void {
    this.cargarCategorias();
    this.cargarProveedores();
  }

  cargarCategorias(): void {
    this.categoriaService.listarCategoria().subscribe(data => {
      this.categorias = data;
    });
  }

  cargarProveedores(): void {
    this.proveedorService.listarProveedor().subscribe(data => {
      this.proveedores = data;
    });
  }

  onCategoriaChange(categoriaId: number): void {
    // Si categoria es undefined, inicializarlo como un objeto vacío
    if (!this.producto.categoria) {
      this.producto.categoria = new Categoria();
    }
    this.producto.categoria.categoriaId = categoriaId;
  }

  onProveedorChange(proveedorId: number): void {
    // Si proveedor es undefined, inicializarlo como un objeto vacío
    if (!this.producto.proveedor) {
      this.producto.proveedor = new Proveedor();
    }
    this.producto.proveedor.proveedorId = proveedorId;
  }

  registra(): void {
    if (this.formsRegistra.valid) {
      this.productoService.inserta(this.producto).subscribe(
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
            Swal.fire('Error', 'Ocurrió un error al registrar el producto.', 'error');
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
    this.producto = {
      productoId: 0,
      nombre: "",
      precio: 0,
      stock: 0,
      categoria: {}, // Inicializado como un objeto vacío
      proveedor: {},
    };
  }
}

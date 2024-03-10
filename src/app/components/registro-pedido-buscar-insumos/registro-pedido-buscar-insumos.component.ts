import {Component, Inject} from "@angular/core";
import {MatToolbarModule} from '@angular/material/toolbar';
import {AppMaterialModule} from "../../app.material.module";
import {Producto} from "../../models/producto.model";
import {ProductoService} from "../../services/producto.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: "app-registro-pedido-buscar-insumos",
  templateUrl: "./registro-pedido-buscar-insumos.component.html",
  styleUrls: ["./registro-pedido-buscar-insumos.component.css"],
  imports: [
    AppMaterialModule
  ],
  standalone: true
})
export class RegistroPedidoBuscarInsumosComponent {
  productos: Producto[] = [];
  dataSource: any[] = [];
  producto: Producto = new Producto();

  constructor(
    private productoService: ProductoService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RegistroPedidoBuscarInsumosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { insumos: Producto }
  ) {
  }

  ngOnInit(): void {
    this.cargarInsumos();
  }

  cargarInsumos(): void {
    this.productoService.consultaPorNombre("todos").subscribe(data => {
      this.productos = data;
      this.dataSource = this.productos.map(producto => {
        return {
          idInsumo: producto.productoId,
          nombre: producto.nombre,
          stock: producto.stock,
          precio: producto.precio,
          categoria: producto.categoria?.nombre,
        };
      });

    });
  }

  funcionFiltrar(event: any): void {
    const valorInput = event.target.value.toLowerCase();
    this.filtrarPorNombre(valorInput);
  }

  private filtrarPorNombre(valor: string): void {
    if (valor.trim() === '') {
      this.dataSource = this.productos.map(producto => {
        return {
          idInsumo: producto.productoId,
          nombre: producto.nombre,
          precio: producto.precio,
          stock: producto.stock,
          categoria: producto.categoria?.nombre,
        };
      });
    } else {
      this.productoService.consultaPorNombre(valor).subscribe(productoFiltrados => {
        this.dataSource = productoFiltrados.map(producto => {
          return {
            idInsumo: producto.productoId,
            nombre: producto.nombre,
            precio: producto.precio,
            stock: producto.stock,
            categoria: producto.categoria?.nombre,
          };
        });
      });
    }
  }

  insertarDatosInput(idInsumo: number, nombre: string, stock: number, precio: number, categoria: string) {
    this.producto = {
      productoId: idInsumo,
      nombre: nombre,
      stock: stock,
      precio: precio,
      categoria: { descripcion: categoria}
    };
    this.dialogRef.close({producto: this.producto});
  }
}

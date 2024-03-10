import {ChangeDetectorRef, Component, ElementRef, ViewChild} from "@angular/core";
import {MatDialog} from "@angular/material/dialog";
import {
  RegistroPedidoBuscarProveedorComponent
} from "../registro-pedido-buscar-proveedor/registro-pedido-buscar-proveedor.component";
import {
  RegistroPedidoBuscarInsumosComponent
} from "../registro-pedido-buscar-insumos/registro-pedido-buscar-insumos.component";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {AppMaterialModule} from "../../app.material.module";
import {Producto} from "../../models/producto.model";
import {PedidoService} from "../../services/pedido.service";
import {MatTableDataSource} from "@angular/material/table";
import {Categoria} from "../../models/categoria.model";
import {Proveedor} from "../../models/proveedor.model";
import {ListaPedido} from "../../models/lista.model";
import Swal from "sweetalert2";
import {PedidoHasProducto} from "../../models/pedidoHasProducto.model";
import {PedidoHasProductoPK} from "../../models/pedidoHasProductoPK.model";
import {Pedido} from "../../models/pedido.model";

@Component({
  selector: "app-registro-pedido",
  templateUrl: "./registro-pedido.component.html",
  styleUrls: ["./registro-pedido.component.css"],
  imports: [
    MatCardModule,
    MatInputModule,
    AppMaterialModule
  ],
  standalone: true
})
export class RegistroPedidoComponent {
  @ViewChild('rucInput') rucInput!: ElementRef<HTMLInputElement>;
  @ViewChild('nombreInput') nombreInput!: ElementRef<HTMLInputElement>;

  @ViewChild('insumo') insumo!: ElementRef<HTMLInputElement>;
  @ViewChild('stockActual') stockActual!: ElementRef<HTMLInputElement>;
  @ViewChild('precio') precio!: ElementRef<HTMLInputElement>;
  @ViewChild('categoria') categoria!: ElementRef<HTMLInputElement>;
  @ViewChild('cantidadInput') cantidadInput!: ElementRef<HTMLInputElement>;

  dataSource:any;
  objProducto : Producto = {};
  lstProductos : Producto [] = [];
  productoidBuscado: number = 0;
  idProveedorBuscado: number = 0;
  insumobuscado: string = "";
  faltaFuncion() {
  }

  constructor(private dialogService: MatDialog, private cdRef: ChangeDetectorRef,private pedidoService: PedidoService) {
  }

  agregarProducto(){
    const insumo = this.insumo.nativeElement.value;
    const precio = +this.precio.nativeElement.value;
    const cantidad = +this.cantidadInput.nativeElement.value;
    if (insumo && !isNaN(precio) && !isNaN(cantidad)) {
      const subtotal = precio * cantidad;
      console.log("idProveedorBuscado: ", this.idProveedorBuscado);
      this.objProducto = {
        productoId: this.productoidBuscado,
        nombre : insumo,
        precio: precio,
        cantidad: cantidad,
        subTotal:subtotal,
      }
      this.insumo.nativeElement.value = '';
      this.precio.nativeElement.value = '';
      this.cantidadInput.nativeElement.value = '';
      this.stockActual.nativeElement.value = '';
      this.categoria.nativeElement.value = '';
      this.lstProductos.push(this.objProducto);
      this.dataSource = new MatTableDataSource(this.lstProductos);
      this.cdRef.detectChanges();
    } else {
      console.error('Ingrese valores válidos para Insumo, Precio y Cantidad');
    }
  }

  openBuscarProveedor() {
    console.log(">>> openAddDialog  >>");
    const dialogRef = this.dialogService.open(
      RegistroPedidoBuscarProveedorComponent
    );
    dialogRef.afterClosed().subscribe((result) => {
      console.log(">>> result >> " + result);
      if (result && result.proveedor) {
        const proveedorSeleccionado = result.proveedor;

        const idProveedorRe = proveedorSeleccionado.proveedorId;
        const ruc = proveedorSeleccionado.ruc;
        const nombre = proveedorSeleccionado.razonSocial;

        this.idProveedorBuscado = idProveedorRe;
        this.rucInput.nativeElement.value = ruc;
        this.nombreInput.nativeElement.value = nombre;
      }
    });
  }

  registrar(){
    let lstDetalles : PedidoHasProducto[] = [];

    this.lstProductos.forEach( (item) => {
      var pk : PedidoHasProductoPK = {
        productoId : item.productoId
      }
      console.log("pk: ",pk);
      var objDetalle : PedidoHasProducto = {
        cantidad : item.cantidad,
        precio :item.precio,
        producto : item,
        pedidoHasProductoPK : pk
      }
      console.log("objDetalle: ",objDetalle);
      lstDetalles.push(objDetalle);
    });
    console.log("lstDetalles: ",lstDetalles);
    let objBoleta : Pedido = {
      proveedor:{
        proveedorId:this.idProveedorBuscado,
        suministro : {
          descripcion : this.insumobuscado
        }
      },
      detallesPedido : lstDetalles
    };
    console.log("objBoleta: ",objBoleta);
    objBoleta.fechaRegistro = new Date();
    this.pedidoService.inserta(objBoleta).subscribe(x => {
      console.log('Response from pedidoService:', x);
      this.objProducto = {};
      this.lstProductos = [];
      this.dataSource = new MatTableDataSource(this.lstProductos);
    });

  }

  eliminaProducto(objProducto: Producto){
    const index = this.lstProductos.findIndex(x => x.productoId === objProducto.productoId);
    if (index !== -1) {
      this.lstProductos.splice(index, 1);
      this.dataSource = new MatTableDataSource(this.lstProductos);
    }
  }

  openBuscarInsumos() {
    console.log(">>> openAddDialog  >>");
    const dialogRef = this.dialogService.open(
      RegistroPedidoBuscarInsumosComponent
    );
    dialogRef.afterClosed().subscribe((result) => {
      console.log(">>> result >> " + result);
      if (result && result.producto) {
        const productoSeleccionado = result.producto;

        const productoid = productoSeleccionado.productoId;
        const insumo = productoSeleccionado.nombre;
        const stockActual = productoSeleccionado.stock;
        const precio = productoSeleccionado.precio;
        const categoria = productoSeleccionado.categoria.descripcion;

        this.productoidBuscado = productoid;
        this.insumo.nativeElement.value = insumo;
        this.insumobuscado= insumo;
        this.stockActual.nativeElement.value = stockActual;
        this.precio.nativeElement.value = precio;
        this.categoria.nativeElement.value = categoria;
      }
    });
  }
}

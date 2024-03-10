import {Component, Inject} from "@angular/core";
import {MatIconModule} from "@angular/material/icon";
import {MatTableModule} from "@angular/material/table";
import {MatInputModule} from "@angular/material/input";
import {AppMaterialModule} from "../../app.material.module";
import {SuministroService} from "../../services/suministro.service";
import {ProveedorService} from "../../services/proveedor.service";
import {FormBuilder} from "@angular/forms";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Proveedor} from "../../models/proveedor.model";
import {Suministro} from "../../models/suministro.model";

@Component({
  selector: "app-registro-pedido-buscar-proveedor",
  templateUrl: "./registro-pedido-buscar-proveedor.component.html",
  styleUrls: ["./registro-pedido-buscar-proveedor.component.css"],
  imports: [
    MatIconModule,
    MatTableModule,
    MatInputModule,
    AppMaterialModule
  ],
  standalone: true
})
export class RegistroPedidoBuscarProveedorComponent {

  proveedores: Proveedor[] = [];
  proveedoresBuscar: any[] = [];
  dataSource: any[] = [];
  proveedor: Proveedor = new Proveedor();

  constructor(
    private proveedorService: ProveedorService,
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RegistroPedidoBuscarProveedorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { proveedor: Proveedor }
  ) {
  }

  ngOnInit(): void {
    this.cargarProveedores();
  }

  cargarProveedores(): void {
    this.proveedorService.listarProveedor().subscribe(data => {
      this.proveedores = data;
      this.dataSource = this.proveedores.map(proveedor => {
        return {
          idProveedor: proveedor.proveedorId,
          ruc: proveedor.ruc,
          nombre: proveedor.razonSocial,
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
      this.dataSource = this.proveedores.map(proveedor => {
        return {
          idProveedor: proveedor.proveedorId,
          ruc: proveedor.ruc,
          nombre: proveedor.razonSocial,
        };
      });
    } else {
      this.proveedorService.consultaPorRazonSocial(valor).subscribe(proveedoresFiltrados => {
        this.dataSource = proveedoresFiltrados.map(proveedor => {
          return {
            idProveedor: proveedor.proveedorId,
            ruc: proveedor.ruc,
            nombre: proveedor.razonSocial,
          };
        });
      });
    }
  }

  insertarDatosInput(idProveedor: number, rucProveedor: string, nombre: string) {
    this.proveedor = {
      proveedorId: idProveedor,
      ruc: rucProveedor,
      razonSocial: nombre
    };
    this.dialogRef.close({proveedor: this.proveedor});
  }
}

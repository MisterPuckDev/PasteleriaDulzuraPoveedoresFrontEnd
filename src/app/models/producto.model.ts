import { Categoria } from "./categoria.model";
import { Proveedor } from "./proveedor.model";


export class Producto {
  productoId?: number;
  nombre?: string;
  precio?: number;
  stock?: number;
  cantidad?: number;
  subTotal?: number;
  categoria?: Categoria;
  proveedor?: Proveedor;
}

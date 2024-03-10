import { PedidoHasProducto } from "./pedidoHasProducto.model";
import {Proveedor} from "./proveedor.model";


export class Pedido {
  proveedor?: Proveedor;
  fechaRegistro?:Date;
  detallesPedido ?: PedidoHasProducto[];
}

import {PedidoHasProductoPK} from "./pedidoHasProductoPK.model";
import {Producto} from "./producto.model";

export class PedidoHasProducto {

  precio?: number;
  cantidad?: number;
  producto?: Producto;
  pedidoHasProductoPK?: PedidoHasProductoPK;
}

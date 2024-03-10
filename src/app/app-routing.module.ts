import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CrudProveedorComponent } from './components/crud-proveedor/crud-proveedor.component';
import { CrudCategoriaComponent } from './components/crud-categoria/crud-categoria.component';
import { CrudProductoComponent } from './components/crud-producto/crud-producto.component';
import { LoginComponent } from "./components/auth/login/login.component";
import { ConsultaProveedorComponent } from "./components/consulta-proveedor/consulta-proveedor.component";
import {RegistroPedidoComponent} from "./components/registro-pedido/registro-pedido.component";


const routes: Routes = [
  {path: "login", component: LoginComponent },
  {path:"crudProveedor", component:CrudProveedorComponent },
  {path:"crudCategoria", component:CrudCategoriaComponent },
  {path:"crudProducto", component:CrudProductoComponent },
  {path:"consultaProveedor", component:ConsultaProveedorComponent },
  {path:"registroPedido", component:RegistroPedidoComponent },

];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }

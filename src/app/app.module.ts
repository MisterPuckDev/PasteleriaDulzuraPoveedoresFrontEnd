import { Producto } from './models/producto.model';
import { Proveedor } from 'src/app/models/proveedor.model';
import { Categoria } from 'src/app/models/categoria.model';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CrudProveedorComponent } from './components/crud-proveedor/crud-proveedor.component';
import { AppMaterialModule } from './app.material.module';
import { CrudProveedorAddComponent } from './components/crud-proveedor-add/crud-proveedor-add.component';
import { CrudProveedorUpdateComponent } from './components/crud-proveedor-update/crud-proveedor-update.component';
import { CrudCategoriaComponent } from './components/crud-categoria/crud-categoria.component';
import { CrudCategoriaAddComponent } from './components/crud-categoria-add/crud-categoria-add.component';
import { CrudCategoriaUpdateComponent } from './components/crud-categoria-update/crud-categoria-update.component';
import { CrudProductoComponent } from './components/crud-producto/crud-producto.component';
import { CrudProductoAddComponent } from './components/crud-producto-add/crud-producto-add.component';
import { CrudProductoUpdateComponent } from './components/crud-producto-update/crud-producto-update.component';
import { ConsultaProveedorComponent } from "./components/consulta-proveedor/consulta-proveedor.component";

@NgModule({
  declarations: [
    AppComponent,
    CrudProveedorComponent,
    CrudProveedorAddComponent,
    CrudProveedorUpdateComponent,
    CrudCategoriaComponent,
    CrudCategoriaAddComponent,
    CrudCategoriaUpdateComponent,
    CrudProductoComponent,
    CrudProductoAddComponent,
    CrudProductoUpdateComponent,
    ConsultaProveedorComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AppMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Suministro } from './suministro.model';

export class Proveedor {
    proveedorId?: number;
    ruc?: string;
    razonSocial?: string;
    direccion?: string;
    telefono?: string;
    correo?: string;
    suministro?: Suministro;
    fechaRegistro?: Date;
    estado?: number;
}

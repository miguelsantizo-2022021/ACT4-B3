import { Cliente } from '../models/cliente';
import { PersistenciaService } from './persistenciaService';

const ARCHIVO = 'clientes.json';

export class ClienteService {

    private static validar(cliente: Cliente): void {
        if (!cliente.id || !cliente.nombreCompleto || !cliente.correo) {
            throw new Error('El ID, Nombre y Correo son obligatorios.');
        }
    }

    static async agregarCliente(nuevoCliente: Cliente): Promise<void> {
        try {
            this.validar(nuevoCliente);
            
            const clientes = await PersistenciaService.leerDesdeArchivo<Cliente>(ARCHIVO);
            
            if (clientes.some(c => c.id === nuevoCliente.id)) {
                throw new Error('Ese ID de cliente ya existe.');
            }

            clientes.push(nuevoCliente);
            await PersistenciaService.guardarEnArchivo(ARCHIVO, clientes);
            console.log('Cliente guardado con exito.');
        } catch (error: any) {
            console.error('No se pudo guardar el cliente: ', error.message);
        }
    }

    static async obtenerClientes(): Promise<Cliente[]> {
        return await PersistenciaService.leerDesdeArchivo<Cliente>(ARCHIVO);
    }
}
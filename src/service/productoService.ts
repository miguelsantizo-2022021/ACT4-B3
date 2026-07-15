import { producto } from '../models/producto';
import { PersistenciaService } from './persistenciaService';

const ARCHIVO = 'productos.json';

export class ProductoService {
    
    // validamos que no manden campos vacios o precios negativos
    private static validar(producto: producto): void {
        if (!producto.id || !producto.nombre) {
            throw new Error('El ID y el Nombre no pueden estar vacios.');
        }
        if (producto.precio <= 0 || producto.stock < 0) {
            throw new Error('El precio debe ser mayor a 0 y las existencias no pueden ser negativas.');
        }
    }

    static async agregarProducto(nuevoProducto: producto): Promise<void> {
        try {
            this.validar(nuevoProducto);
            
            const productos = await PersistenciaService.leerDesdeArchivo<producto>(ARCHIVO);
            
            // que no se repita el mismo ID
            if (productos.some(p => p.id === nuevoProducto.id)) {
                throw new Error('Ese ID de producto ya existe.');
            }

            productos.push(nuevoProducto);
            await PersistenciaService.guardarEnArchivo(ARCHIVO, productos);
            console.log('Producto guardado con exito.');
        } catch (error: any) {
            console.error('No se pudo guardar el producto: ', error.message);
        }
    }

    static async obtenerProductos(): Promise<producto[]> {
        return await PersistenciaService.leerDesdeArchivo<producto>(ARCHIVO);
    }
}
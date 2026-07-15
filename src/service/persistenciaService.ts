import fs from 'node:fs/promises';
import path from 'node:path';

const CARPETA_DATOS = path.join(__dirname, '..', 'data');

export class PersistenciaService {
    
    // aca guardamos los datos en el archivo json de forma asincrona
    static async guardarEnArchivo<T>(nombreArchivo: string, datos: T[]): Promise<boolean> {
        try {
            // si no existe la carpeta data la creamos de una vez
            await fs.mkdir(CARPETA_DATOS, { recursive: true });
            
            const rutaArchivo = path.join(CARPETA_DATOS, nombreArchivo);
            const textoJSON = JSON.stringify(datos, null, 2);
            
            await fs.writeFile(rutaArchivo, textoJSON, 'utf-8');
            return true;
        } catch (error: any) {
            console.error('Error al intentar escribir en el archivo: ', error.message);
            return false;
        }
    }

    // aca leemos los archivos y recuperamos la info
    static async leerDesdeArchivo<T>(nombreArchivo: string): Promise<T[]> {
        const rutaArchivo = path.join(CARPETA_DATOS, nombreArchivo);
        try {
            const contenido = await fs.readFile(rutaArchivo, 'utf-8');
            
            if (!contenido.trim()) return [];
            
            return JSON.parse(contenido) as T[];
        } catch (error: any) {
            // si sale error enoent significa que el archivo todavia no existe, tons devolvemos arreglo vacio
            if (error.code === 'ENOENT') {
                console.warn('El archivo todavia no existe. Se va a crear cuando guardes algo.');
                return [];
            }
            console.error('Hubo un error critico al leer el archivo: ', error.message);
            return [];
        }
    }
}
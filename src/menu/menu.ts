import { preguntar } from '../utils/readLine';
import { ProductoService } from '../service/productoService';
import { ClienteService } from '../service/clienteService';

export class MenúPrincipal {
    
    static async mostrar() {
        let continuar = true;

        while (continuar) {
            console.log('--- MENU PRINCIPAL ---');
            console.log('1. Agregar Producto');
            console.log('2. Ver Productos');
            console.log('3. Agregar Cliente');
            console.log('4. Ver Clientes');
            console.log('5. Salir');

            const opcion = await preguntar('Escribe el numero de tu opcion: ');

            switch (opcion) {
                case '1':
                    const idProd = await preguntar('ID del producto: ');
                    const nomProd = await preguntar('Nombre del producto: ');
                    const precioProd = await preguntar('Precio: ');
                    const stockProd = await preguntar('Existencias: ');

                    await ProductoService.agregarProducto({
                        id: idProd,
                        nombre: nomProd,
                        precio: parseFloat(precioProd),
                        stock: parseInt(stockProd)
                    });
                    break;

                case '2':
                    const productos = await ProductoService.obtenerProductos();
                    console.log('Lista de productos guardados:');
                    console.table(productos);
                    break;

                case '3':
                    const idCli = await preguntar('ID del cliente: ');
                    const nomCli = await preguntar('Nombre completo: ');
                    const correoCli = await preguntar('Correo electronico: ');
                    const telCli = await preguntar('Telefono: ');

                    await ClienteService.agregarCliente({
                        id: idCli,
                        nombreCompleto: nomCli,
                        correo: correoCli,
                        telefono: telCli
                    });
                    break;

                case '4':
                    const clientes = await ClienteService.obtenerClientes();
                    console.log('Lista de clientes guardados en el JSON:');
                    console.table(clientes);
                    break;

                case '5':
                    console.log('Saliendo del programa, buena onda.');
                    continuar = false;
                    break;

                default:
                    console.log('Opcion no valida, intenta de nuevo.');
                    break;
            }
            
            console.log('----------------------');
        }
    }
}
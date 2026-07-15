import http from 'node:http';
import { getUsersList, createNewUser, updateExistingUser, deleteUserFromList } from './router.js';

export function startApp(): void {
  const PORT = 3000;
  const server = http.createServer(async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const parsedUrl = new URL(req.url || '', `http://localhost:${PORT}`);
    const pathname = parsedUrl.pathname;
    const idParam = parsedUrl.searchParams.get('id');

    if (pathname === '/users' && req.method === 'GET') {
      const globalStart = performance.now();
      console.log('=== Iniciando Actividad 4: Consumo de API y Persistencia ===');
      try {
        const result = await getUsersList();
        const globalEnd = performance.now();
        console.log(`PROCESO COMPLETADO EXITOSAMENTE en ${(globalEnd - globalStart).toFixed(2)} ms`);
        res.writeHead(200);
        res.end(JSON.stringify(result));
      } catch (error: any) {
        const globalEnd = performance.now();
        console.error(`PROCESO DETENIDO POR ERROR (Tiempo total: ${(globalEnd - globalStart).toFixed(2)} ms)`);
        let errorType = 'Error Crítico Asíncrono / Datos mal formados';
        if (error.message && error.message.startsWith('HTTP_ERROR')) {
          errorType = 'Error de Respuesta del Servidor (HTTP Status)';
        } else if (error.code === 'ENOTFOUND' || (error.message && error.message.includes('fetch failed'))) {
          errorType = 'Error de Red / Sin conexión a Internet (DNS/Conectividad)';
        }
        res.writeHead(500);
        res.end(JSON.stringify({ error: errorType, message: error.message }));
      }
    } else if (pathname === '/users' && req.method === 'POST') {
      const globalStart = performance.now();
      console.log('=== Iniciando Registro de Usuario (POST) ===');
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', async () => {
        try {
          const parsedBody = JSON.parse(body);
          const result = await createNewUser(parsedBody);
          const globalEnd = performance.now();
          console.log(`PROCESO POST COMPLETADO EXITOSAMENTE en ${(globalEnd - globalStart).toFixed(2)} ms`);
          res.writeHead(201);
          res.end(JSON.stringify(result));
        } catch (error: any) {
          const globalEnd = performance.now();
          console.error(`ERROR EN POST (Tiempo total: ${(globalEnd - globalStart).toFixed(2)} ms)`);
          res.writeHead(400);
          res.end(JSON.stringify({ error: 'Datos de entrada no válidos', message: error.message }));
        }
      });
    } else if (pathname === '/users' && req.method === 'PUT') {
      const globalStart = performance.now();
      console.log('=== Iniciando Modificación de Usuario (PUT) ===');
      if (!idParam) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Falta parámetro', message: 'Se requiere el parámetro id en la query (ej. /users?id=1)' }));
        return;
      }
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });
      req.on('end', async () => {
        try {
          const parsedBody = JSON.parse(body);
          const result = await updateExistingUser(Number(idParam), parsedBody);
          const globalEnd = performance.now();
          console.log(`PROCESO PUT COMPLETADO EXITOSAMENTE en ${(globalEnd - globalStart).toFixed(2)} ms`);
          res.writeHead(200);
          res.end(JSON.stringify(result));
        } catch (error: any) {
          const globalEnd = performance.now();
          console.error(`ERROR EN PUT (Tiempo total: ${(globalEnd - globalStart).toFixed(2)} ms)`);
          const status = error.message.startsWith('NOT_FOUND') ? 404 : 400;
          res.writeHead(status);
          res.end(JSON.stringify({ error: 'Error al actualizar', message: error.message }));
        }
      });
    } else if (pathname === '/users' && req.method === 'DELETE') {
      const globalStart = performance.now();
      console.log('=== Iniciando Eliminación de Usuario (DELETE) ===');
      if (!idParam) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: 'Falta parámetro', message: 'Se requiere el parámetro id en la query (ej. /users?id=1)' }));
        return;
      }
      try {
        await deleteUserFromList(Number(idParam));
        const globalEnd = performance.now();
        console.log(`PROCESO DELETE COMPLETADO EXITOSAMENTE en ${(globalEnd - globalStart).toFixed(2)} ms`);
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'SUCCESS', message: `Usuario con ID ${idParam} eliminado correctamente` }));
      } catch (error: any) {
        const globalEnd = performance.now();
        console.error(`ERROR EN DELETE (Tiempo total: ${(globalEnd - globalStart).toFixed(2)} ms)`);
        const status = error.message.startsWith('NOT_FOUND') ? 404 : 500;
        res.writeHead(status);
        res.end(JSON.stringify({ error: 'Error al eliminar', message: error.message }));
      }
    } else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
  });
  server.listen(PORT, () => {
    console.log(`Servidor activo escuchando en http://localhost:${PORT}`);
  });
}
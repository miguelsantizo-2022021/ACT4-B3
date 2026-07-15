import https from 'node:https';

export function fetchExternalUsers(): Promise<any[]> {
  const url = 'https://jsonplaceholder.typicode.com/users';
  const apiStart = performance.now();
  const agent = new https.Agent({ rejectUnauthorized: false });
  return new Promise((resolve, reject) => {
    https.get(url, { agent }, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP_ERROR: Servidor externo respondió con estado ${res.statusCode}`));
        return;
      }
      let buffer = '';
      res.on('data', (chunk) => {
        buffer += chunk;
      });
      res.on('end', () => {
        const apiEnd = performance.now();
        console.log(`-> Petición HTTPS completada en: ${(apiEnd - apiStart).toFixed(2)} ms`);
        try {
          resolve(JSON.parse(buffer));
        } catch (e) {
          reject(new Error('PARSING_ERROR: JSON mal formado recibido de la API'));
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}
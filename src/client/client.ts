export async function fetchExternalUsers(): Promise<any[]> {
  const url = 'https://jsonplaceholder.typicode.com/users';
  const apiStart = performance.now();

  try {
    const response = await fetch(url);


    if (!response.ok) {
      throw new Error(`HTTP_ERROR: Servidor externo respondió con estado ${response.status}`);
    }

    const data = await response.json();
    const apiEnd = performance.now();
    
    console.log(`-> Petición Fetch completada en: ${(apiEnd - apiStart).toFixed(2)} ms`);
    return data;
  } catch (error: any) {
    if (error.message && error.message.startsWith('HTTP_ERROR')) {
      throw error;
    }
  
    throw new Error(`CONNECTION_ERROR: Fallo de conexión o DNS (${error.message})`);
  }
}
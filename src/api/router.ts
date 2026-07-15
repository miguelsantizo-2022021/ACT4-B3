import fs from 'node:fs/promises';
import path from 'node:path';
import { fetchExternalUsers } from '../client/client.js';

interface UserCleanData {
  id: number;
  name: string;
  username: string;
  email: string;
  city: string;
}

const outputDir = path.join(process.cwd(), 'dist');
const outputPath = path.join(outputDir, 'usuarios.json');

export async function processAndSaveUsers(): Promise<UserCleanData[]> {
  const rawData = await fetchExternalUsers();
  const processedUsers: UserCleanData[] = rawData.map((user) => ({
    id: user.id,
    name: user.name,
    username: user.username,
    email: user.email,
    city: user.address?.city || 'No especificada'
  }));
  console.log(`-> Datos procesados. Total de elementos: ${processedUsers.length}`);
  await fs.mkdir(outputDir, { recursive: true });
  const fsStart = performance.now();
  await fs.writeFile(outputPath, JSON.stringify(processedUsers, null, 2), 'utf-8');
  const fsEnd = performance.now();
  console.log(`-> Archivo guardado con éxito en disk en: ${(fsEnd - fsStart).toFixed(2)} ms`);
  return processedUsers;
}

export async function getUsersList(): Promise<UserCleanData[]> {
  try {
    const fileData = await fs.readFile(outputPath, 'utf-8');
    return JSON.parse(fileData);
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      return await processAndSaveUsers();
    }
    throw err;
  }
}

export async function createNewUser(newUser: Omit<UserCleanData, 'id'>): Promise<UserCleanData> {
  await fs.mkdir(outputDir, { recursive: true });
  const currentUsers = await getUsersList();
  const nextId = currentUsers.length > 0 ? Math.max(...currentUsers.map(u => u.id)) + 1 : 1;
  const userToAdd: UserCleanData = {
    id: nextId,
    name: newUser.name || 'Sin Nombre',
    username: newUser.username || 'Sin Username',
    email: newUser.email || 'sin@correo.com',
    city: newUser.city || 'No especificada'
  };
  currentUsers.push(userToAdd);
  const fsStart = performance.now();
  await fs.writeFile(outputPath, JSON.stringify(currentUsers, null, 2), 'utf-8');
  const fsEnd = performance.now();
  console.log(`-> Usuario creado. Archivo local actualizado en: ${(fsEnd - fsStart).toFixed(2)} ms`);
  return userToAdd;
}

export async function updateExistingUser(id: number, updatedFields: Partial<Omit<UserCleanData, 'id'>>): Promise<UserCleanData> {
  const currentUsers = await getUsersList();
  const userIndex = currentUsers.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    throw new Error(`NOT_FOUND: El usuario con ID ${id} no existe`);
  }
  const updatedUser: UserCleanData = {
    ...currentUsers[userIndex],
    ...updatedFields
  };
  currentUsers[userIndex] = updatedUser;
  const fsStart = performance.now();
  await fs.writeFile(outputPath, JSON.stringify(currentUsers, null, 2), 'utf-8');
  const fsEnd = performance.now();
  console.log(`-> Usuario ${id} modificado. Archivo guardado en: ${(fsEnd - fsStart).toFixed(2)} ms`);
  return updatedUser;
}

export async function deleteUserFromList(id: number): Promise<void> {
  const currentUsers = await getUsersList();
  const userIndex = currentUsers.findIndex((u) => u.id === id);
  if (userIndex === -1) {
    throw new Error(`NOT_FOUND: El usuario con ID ${id} no existe`);
  }
  currentUsers.splice(userIndex, 1);
  const fsStart = performance.now();
  await fs.writeFile(outputPath, JSON.stringify(currentUsers, null, 2), 'utf-8');
  const fsEnd = performance.now();
  console.log(`-> Usuario ${id} eliminado. Archivo guardado en: ${(fsEnd - fsStart).toFixed(2)} ms`);
}
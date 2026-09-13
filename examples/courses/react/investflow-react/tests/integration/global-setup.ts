import { resetDatabase } from '../database';

// Banco limpo por execução: o schema `integration` é recriado pelas migrações.
export default async function setup() {
  await resetDatabase('integration');
}

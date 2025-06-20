import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const __data = path.resolve(__dirname + '/../data');
export const __src = path.resolve(__dirname + '/../../src');
export const __public = path.resolve(__dirname + '/../../public');

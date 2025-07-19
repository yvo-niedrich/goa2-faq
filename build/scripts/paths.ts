import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const __root = path.resolve(__dirname + '/../..');
export const __data = path.resolve(__root + '/build/data');
export const __src = path.resolve(__root + '/src');
export const __public = path.resolve(__root + '/public');

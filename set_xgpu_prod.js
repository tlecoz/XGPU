import fs from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

// Obtenir le chemin du module actuel
const currentDir = path.dirname(fileURLToPath(import.meta.url));

// Chemin vers le projet xgpu
const XGPU_PATH = path.join(currentDir, './');
const PACKAGE_JSON_PATH = pathToFileURL(path.join(XGPU_PATH, 'package.json')).href;

// Lire le package.json de xgpu de manière synchrone
const packageJsonData = fs.readFileSync(fileURLToPath(PACKAGE_JSON_PATH), 'utf-8');
const packageJson = JSON.parse(packageJsonData);


// Modifier les champs nécessaires
packageJson.main = "dist/XGPU.js";
packageJson.types = "dist/index.d.ts";

// Écrire les modifications dans le package.json de xgpu
fs.writeFileSync(fileURLToPath(PACKAGE_JSON_PATH), JSON.stringify(packageJson, null, 2));

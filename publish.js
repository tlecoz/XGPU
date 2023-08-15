import { execSync } from 'child_process';

// Exécutez vos commandes
execSync('node set_xgpu_prod.js', { stdio: 'inherit' });
execSync('vite build', { stdio: 'inherit' });
execSync('tsc --project tsconfig_build.json', { stdio: 'inherit' });
execSync('npx tsjsondoc ./src ./dist', { stdio: 'inherit' });
execSync('npm publish', { stdio: 'inherit' });
execSync('node set_xgpu_dev.js', { stdio: 'inherit' });
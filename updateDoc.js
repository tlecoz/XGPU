import { execSync } from 'child_process';

execSync('node set_xgpu_prod.js', { stdio: 'inherit' });
execSync('vite build && tsc --project tsconfig_build.json', { stdio: 'inherit' });
// Générez la documentation
execSync('npx tsjsondoc ./src ../xgpu-documentation/src/', { stdio: 'inherit' });
execSync('node set_xgpu_dev.js', { stdio: 'inherit' });

try {
    console.log("Changement de répertoire...");
    execSync('cd ../xgpu-documentation && git add . && git commit -m "update documentation" && git push', { stdio: 'inherit' });

    console.log("Répertoire changé avec succès.");
} catch (error) {
    console.error('Erreur lors du changement de répertoire:', error);

    try {
        // Obtenez le nom de la branche actuelle
        const branchName = execSync("cd ../xgpu-documentation && git rev-parse --abbrev-ref HEAD", { encoding: 'utf8' }).trim();
        // Revenez à l'état du dernier push réussi pour cette branche
        execSync(`cd ../xgpu-documentation && git fetch origin && git reset --hard origin/${branchName}`, { stdio: 'inherit' });
    } catch (resetError) {
        console.error('Erreur lors de la réinitialisation à l\'état du dernier push:', resetError);
    }

}


/*
// Exécutez les commandes git dans le répertoire xgpu-documentation
execSync(`
cd ../xgpu-documentation &&
git add . &&
git commit -m "update documentation" &&
git push
`, { stdio: 'inherit' });

*/
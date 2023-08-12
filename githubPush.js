import { execSync } from 'child_process';

// Vérifiez si un argument a été fourni
if (process.argv.length !== 3) {
    console.log("Usage: npm run push -- commit_message");
    process.exit(1);
}

const commitMessage = process.argv[2];

// Exécutez vos commandes
execSync('node set_xgpu_prod.js', { stdio: 'inherit' });
execSync('git add .', { stdio: 'inherit' });
execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' });
execSync('git push', { stdio: 'inherit' });
execSync('node set_xgpu_dev.js', { stdio: 'inherit' });
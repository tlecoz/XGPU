import { execSync } from 'child_process';

//update package.json and define 'main' entry to 'dist/index.ts' 
execSync('node set_xgpu_prod.js', { stdio: 'inherit' });

//build xgpu and update 'dist'
execSync('vite build && tsc --project tsconfig_build.json', { stdio: 'inherit' });

//generate the documentation in ../xgpu-documentation/src
execSync('npx tsjsondoc ./src ../xgpu-documentation/src/', { stdio: 'inherit' });

//update back package.json and set 'main' to 'src/index.ts' so I can use locally synchronously with xgpu-samples 
execSync('node set_xgpu_dev.js', { stdio: 'inherit' });

try {
    console.log("Trying to push...");
    execSync('cd ../xgpu-documentation && git add . && git commit -m "update documentation" && git push', { stdio: 'inherit' });

    console.log("documentation correctly updated on github & netlify");
} catch (error) {
    console.error('Error during github push', error);
    //get current branch name
    const branchName = execSync("cd ../xgpu-documentation && git rev-parse --abbrev-ref HEAD", { encoding: 'utf8' }).trim();
    //go back to the state of xgpu-documentation at the last successfull push 
    execSync(`cd ../xgpu-documentation && git fetch origin && git reset --hard origin/${branchName}`, { stdio: 'inherit' });
}


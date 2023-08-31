const env = require('./environment');
const fs = require('fs');
const path = require('path');

module.exports = (app) => {
    app.locals.assetPath = function(filePath){
        if(env.name == 'development'){
            return filePath;
        }

        return '/' + JSON.parse(fs.readFileSync(path.join(__dirname, '../public/assets/rev-manifest.json')))[filePath];

        // const revManifestPath = path.join(__dirname, '../public/assets/rev-manifest.json');
        // console.log('revManifestPath:', revManifestPath);
        // const revManifest = JSON.parse(fs.readFileSync(revManifestPath));
        // console.log('revManifest:', revManifest);

        // const assetPath = revManifest[filePath];
        // console.log('assetPath:', assetPath);

        // return assetPath;
    }
}
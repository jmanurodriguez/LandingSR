const fs = require('fs');
const path = require('path');


function cleanComments(content, fileType) {
    switch (fileType) {
        case '.html':
            
            content = content.replace(/<!--[\s\S]*?-->/g, '');
            break;
        case '.css':
        case '.js':
            
            content = content.replace(/\/\/.*/g, '')
                             .replace(/\/\*[\s\S]*?\*\
            break;
    }
    return content;
}


function processDirectory(directory) {
    fs.readdir(directory, { withFileTypes: true }, (err, files) => {
        if (err) {
            console.error(`Error al leer el directorio ${directory}: ${err}`);
            return;
        }

        files.forEach(file => {
            const filePath = path.join(directory, file.name);
            if (file.isDirectory()) {
                processDirectory(filePath); 
            } else {
                const fileExt = path.extname(file.name).toLowerCase();
                if (['.html', '.css', '.js'].includes(fileExt)) {
                    processFile(filePath, fileExt);
                }
            }
        });
    });
}


function processFile(filePath, fileExt) {
    fs.readFile(filePath, 'utf8', (err, content) => {
        if (err) {
            console.error(`Error al leer el archivo ${filePath}: ${err}`);
            return;
        }

        const cleanedContent = cleanComments(content, fileExt);
        fs.writeFile(filePath, cleanedContent, err => {
            if (err) {
                console.error(`Error al escribir en el archivo ${filePath}: ${err}`);
            } else {
                console.log(`Comentarios eliminados en ${filePath}`);
            }
        });
    });
}


const startDirectory = process.argv[2] || __dirname;
processDirectory(startDirectory); 
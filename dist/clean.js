const fs = require('fs');
const path = require('path');
function cleanComments(content, fileType) {
    switch(fileType) {
        case '.html':
            content = content.replace(/<!--[\s\S]*?-->/g, '');
            break;
        case '.js':
            content = content.replace(/\/\/.*/g, '')
                           .replace(/\/\*[\s\S]*?\*\
            break;
        case '.css':
            content = content.replace(/\/\*[\s\S]*?\*\
            break;
    }
    content = content.replace(/^\s*[\r\n]/gm, '\n')
                    .replace(/\n\s*\n\s*\n/g, '\n\n');
    return content;
}
function processDirectory(sourceDir, targetDir) {
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }
    const items = fs.readdirSync(sourceDir);
    items.forEach(item => {
        const sourcePath = path.join(sourceDir, item);
        const targetPath = path.join(targetDir, item);
        if (fs.statSync(sourcePath).isDirectory()) {
            if (item !== 'node_modules' && item !== 'dist') {
                processDirectory(sourcePath, targetPath);
            }
        } else {
            const ext = path.extname(item).toLowerCase();
            if (['.html', '.js', '.css'].includes(ext)) {
                console.log(`Procesando: ${sourcePath}`);
                let content = fs.readFileSync(sourcePath, 'utf8');
                content = cleanComments(content, ext);
                fs.writeFileSync(targetPath, content);
                console.log(`Comentarios eliminados de: ${sourcePath}`);
            } else {
                fs.copyFileSync(sourcePath, targetPath);
            }
        }
    });
}
const distDir = path.join(__dirname, 'dist');
if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir);
}
try {
    processDirectory(__dirname, distDir);
    console.log('Proceso completado exitosamente');
} catch (error) {
    console.error('Error durante el proceso:', error);
} 
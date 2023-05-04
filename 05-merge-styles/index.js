const path = require("node:path");
const fs = require("node:fs/promises");

async function buildBundle() {
    const stylesDirPath = path.join(__dirname, 'styles');
    const destFilePath = path.join(__dirname, 'project-dist', 'bundle.css');

    // Remove old file
    fs.rm(destFilePath, {force: true}).catch((error) => {
        console.error('Could not remove file.', error);
    });

    // Append all css files from 'styles' dir
    try {
        const stylesFolderContent = await fs.readdir(stylesDirPath);
        stylesFolderContent.forEach(item => {
            const filePath = path.join(stylesDirPath, item);
            if (path.extname(filePath) === '.css') {
                fs.readFile(filePath).then((data) => {
                    fs.appendFile(destFilePath, data).catch((error) => {
                        console.error('Could not append data to file.', error);
                    });
                }).catch((error) => {
                    console.error('Could not read file content.', error);
                });
            }
        });
    } catch (error) {
        console.error('Folder content could not be retrieved.', error);
    }
}

buildBundle();

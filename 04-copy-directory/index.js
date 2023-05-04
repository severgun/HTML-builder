const fs = require("node:fs/promises");
const path = require("node:path");


async function copyDir() {
    const srcDirPath = path.join(__dirname, 'files');
    const destDirPath = path.join(__dirname, 'files-copy');
    
    // Create dest folder if not exist.
    try {
        await fs.mkdir(destDirPath, {recursive: true});
    } catch (error) {
        console.error('Folder could not be created!', error);
    }

    let srcDirContent = [];
    let destDirContent = [];
    try {
        srcDirContent = await fs.readdir(srcDirPath);
        destDirContent = await fs.readdir(destDirPath);

        // Remove files that is not present at src dir.
        contentToRemove = destDirContent.filter(file => !srcDirContent.includes(file));
        contentToRemove.forEach(item => {
            try {
                fs.rm(path.join(destDirPath, item));
            } catch (error) {
                console.error('File could not be removed!', error);
            }
        });

        // Copy files
        srcDirContent.forEach(item => {
            const srcFilePath = path.join(srcDirPath, item);
            const destFilePath = path.join(destDirPath, item);
            try {
                fs.copyFile(srcFilePath, destFilePath);
            } catch (error) {
                console.error('File could not be copied!', error);
            }
        });
    } catch (error) {
        console.log('Folder content could not be retrieved', error);
    }
}

copyDir();

const path = require('node:path');
const fs = require('node:fs/promises');

const templatePath = path.join(__dirname, 'template.html');
const componentsPath = path.join(__dirname, 'components');
const projDir = path.join(__dirname, 'project-dist');

async function buildIndexHtml() {
  await fs.rm(projDir, {recursive: true, force: true}).catch((error) => {
    console.error('Could not remove directory.', error);
  });

  const template = await fs.readFile(templatePath, {encoding: 'utf-8'}).catch((error) => {
    console.error('Could not read the file.', error);
  });
  const componentsList = await fs.readdir(componentsPath).catch((error) => {
    console.error('Could not read the directory.', error);
  });

  const componentsContent = {};
  for (const component of componentsList) {
    componentsContent[component.slice(0,-5)] = await fs.readFile(path.join(componentsPath, component),{encoding: 'utf-8'}).catch((error) => {
      console.error('Could not read the file.', error);
    });
  }

  let indexHtml = template.replaceAll(/{{\w+}}/g, (match) => {
    return componentsContent[match.slice(2,-2)];
  })
  
  // Remove old file
  const indexPath = path.join(projDir, 'index.html');
  await fs.rm(indexPath, {force: true}).catch((error) => {
    console.error('Could not remove file.', error);
  });
  
  fs.writeFile(indexPath, indexHtml).catch((error) => {
    console.error('Could not write the file.', error);
  });
}

async function buildCssStyles() {
  const stylesDirPath = path.join(__dirname, 'styles');
  const destFilePath = path.join(__dirname, 'project-dist', 'style.css');

  // Remove old file
  await fs.rm(destFilePath, {force: true}).catch((error) => {
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

async function copyAssetsDir() {
  const srcDirPath = path.join(__dirname, 'assets');
  const destDirPath = path.join(__dirname, 'project-dist', 'assets');
  
  // Create dest folder if not exist.
  try {
      await fs.mkdir(destDirPath, {recursive: true});
  } catch (error) {
      console.error('Folder could not be created!', error);
  }

  async function copyFiles(p) {
    const srcDirContent = await fs.readdir(p, {withFileTypes: true}).catch((error) => {
      console.error('Could not read the directory.', error);
    });
    for (const item of srcDirContent) {
      if (item.isDirectory()) {
        copyFiles(path.join(p, item.name));
      } else {
        const count = __dirname.split(path.sep).length;
        const destPath = path.join(projDir, 'assets', ...path.dirname(p).split(path.sep).splice(count + 1), path.basename(p));
        await fs.mkdir(path.join(destPath), {recursive: true}).catch((error) => {
          console.error('Folder could not be created!', error);
        });
        await fs.copyFile(path.join(p, item.name), path.join(destPath, item.name)).catch((error) => {
          console.error('Could not copy the file.', error);
        });
      }
    }
  }

  copyFiles(srcDirPath);
}

buildIndexHtml();
buildCssStyles();
copyAssetsDir();

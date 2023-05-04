const fs = require("node:fs/promises");
const path = require("node:path");

const dirPath = path.join(__dirname, 'secret-folder');

fs.readdir(dirPath, {withFileTypes: true}).then((dirContent) => {
    dirContent.forEach(item => {
        if (item.isFile()) {
            const filePath = path.join(dirPath, item.name);
            const ext = path.extname(filePath).substring(1);
            fs.stat(filePath).then((stats) => {
                const size = stats.size / 1024;
                console.log(`${item.name} - ${ext} - ${size}kb`);
            }).catch((err) => {
                console.error('Something went wrong!', err);
            });
        }
    });
}).catch((err) => {
    console.error('Something went wrong!', err);
});

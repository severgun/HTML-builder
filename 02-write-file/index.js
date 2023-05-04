const fs = require('node:fs');
const path = require('node:path');
const process = require('node:process');
const readline = require('node:readline');

const filePath = path.join(__dirname, 'text.txt');
const writeStreamToFile = fs.createWriteStream(filePath);

const readLineInterface = readline.createInterface({
    input: process.stdin,
    output: process.stdout, 
    prompt: 'Please enter text: \n',
});

readLineInterface.prompt();

readLineInterface.on('line', (line) => {
    switch (line.trim().toLowerCase()) {
        case 'exit':
            console.log('\nHave a nice day!');
            writeStreamToFile.end();
            process.exit(0);
            break;
    
        default:
            writeStreamToFile.write(line + '\n');
            break;
    }
});

readLineInterface.on('close', () => {
    console.log('\nHave a nice day!');
    writeStreamToFile.end();
    process.exit(0);
}); 

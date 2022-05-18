const fs = require('fs');
const path = require('path');
const os = require('os');
const {stdin, stdout, stderr, exit} = process;
const output = fs.createWriteStream(path.resolve(__dirname, 'output.txt'));
const exitCondition = 'exit' + os.EOL;

output.on('error', error => {
  stderr.write('Произошла ошибка\n' + error.message + '\nДо свидания!\n');
  exit();
});
stdout.write('\nЗдраствуйте, выходной файл output.txt\n\nВведите текст:\n');
stdin.on('data', data => data.toString() !== exitCondition ? output.write(data) : process.emit('SIGINT'));
process.on('SIGINT', () => {
  stdout.write('\nДо свидания!\n');
  exit();
});

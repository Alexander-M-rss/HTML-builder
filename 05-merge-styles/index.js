const fs = require('fs');
const path = require('path');
const source = path.resolve(__dirname, 'styles');
const destination = path.resolve(__dirname, 'project-dist');
const output = fs.createWriteStream(path.join(destination, 'bundle.css'));
const errMesageOut = (err) => {
  console.log('Произошла ошибка!\n' + err.message +'\n');
  process.exit();
};

output.on('error', err => errMesageOut(err));
fs.readdir(source, {withFileTypes: true}, (err, items) => {
  if (err) errMesageOut(err);
  items.forEach(item => {
    if (item.isFile() && (path.extname(item.name) === '.css')) {
      const input = fs.createReadStream(path.join(source, item.name));

      input.on('error', err => errMesageOut(err));
      input.pipe(output, {end: false});
    }
  });
});

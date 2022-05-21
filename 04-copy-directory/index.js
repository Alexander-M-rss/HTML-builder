const fs = require('fs');
const path = require('path');
const source = 'files';
const destination = 'files-copy';

function copyDir(source, destination) {
  const errMesageOut = (err) => {
    console.log('Произошла ошибка!\n' + err.message +'\n');
    process.exit();
  };

  fs.mkdir(destination, { recursive: true }, (err) => { if (err) errMesageOut(err); });
  fs.readdir(source, {withFileTypes: true}, (err, items) => {
    if (err) errMesageOut(err);
    items.forEach(item => {
      if (item.isFile()) {
        fs.copyFile(path.resolve(source, item.name), path.resolve(destination, item.name), err => {
          if (err) errMesageOut(err);
        });
      } else {
        copyDir(path.resolve(source, item.name), path.resolve(destination, item.name));
      }
    });
  });
}

fs.rm(path.resolve(__dirname, destination), {recursive: true, force: true}, () =>
  copyDir(path.resolve(__dirname, source), path.resolve(__dirname, destination)));

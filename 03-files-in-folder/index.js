const fs = require('fs');
const path = require('path');
const folder = 'secret-folder';

const errMesageOut = (err) => {
  console.log('Произошла ошибка!\n' + err.message +'\n');
  process.exit();
};

fs.readdir(path.resolve(__dirname,folder), {withFileTypes: true}, (err, items) => {
  if (err)
    errMesageOut(err);

  const files = items.filter(item => item.isFile());

  files.forEach(file => {
    fs.stat(path.resolve(__dirname, folder, file.name), (err, stat) =>{
      if (err)
        errMesageOut(err);
      const {name, ext} = path.parse(file.name);
      console.log([name, ext.slice(1), stat.size + 'b'].join(' - '));
    });
  });
});

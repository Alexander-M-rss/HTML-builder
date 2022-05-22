const fs = require('fs');
const path = require('path');
const assetsPath = path.resolve(__dirname, 'assets');
const stylesPath = path.resolve(__dirname, 'styles');
const componentsPath = path.resolve(__dirname, 'components');
const destination = path.resolve(__dirname, 'project-dist');

const errMessageOut = (err) => {
  console.log('Произошла ошибка!\n' + err.message +'\n');
  process.exit();
};

function copyDir(source, destination) {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) errMessageOut(err);
    fs.readdir(source, {withFileTypes: true}, (err, items) => {
      if (err) errMessageOut(err);
      items.forEach(item => {
        if (item.isFile()) {
          fs.copyFile(path.resolve(source, item.name), path.resolve(destination, item.name), err => {
            if (err) errMessageOut(err);
          });
        } else {
          copyDir(path.resolve(source, item.name), path.resolve(destination, item.name));
        }
      });
    });
  });
}

function buildHTML(templates) {
  const templateStart = templates.indexOf('{{');

  if (templateStart > -1) {
    const templateEnd = templates.indexOf('}}', templateStart + 2);

    if (templateEnd > -1) {
      const componentName = templates.slice(templateStart + 2, templateEnd);
      const componentStream = fs.createReadStream(path.resolve(componentsPath, componentName + '.html'), 'utf-8');
      let component = '';

      componentStream.on('error', err => errMessageOut(err));
      componentStream.on('data', chunk => component += chunk);
      componentStream.on('end', () => {
        templates = templates.replace(`{{${componentName}}}`, component);
        buildHTML(templates);
      });
    }
  }
  const indexFile = fs.createWriteStream(path.join(destination, 'index.html'), 'utf-8');

  indexFile.on('error', err => errMessageOut(err));
  indexFile.write(templates);
}

fs.rm(destination, {recursive: true, force: true}, () => {
  fs.mkdir(destination, { recursive: true }, (err) => {
    if (err) errMessageOut(err);
    copyDir(assetsPath, path.join(destination, 'assets'));

    const outputCSS = fs.createWriteStream(path.join(destination, 'style.css'));

    outputCSS.on('error', err => errMessageOut(err));
    fs.readdir(stylesPath, {withFileTypes: true}, (err, items) => {
      if (err) errMessageOut(err);
      items.forEach(item => {
        if (item.isFile() && (path.extname(item.name) === '.css')) {
          const input = fs.createReadStream(path.join(stylesPath, item.name));

          input.on('error', err => errMessageOut(err));
          input.pipe(outputCSS, {end: false});
        }
      });
    });

    const templatesFile = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
    let templates = '';

    templatesFile.on('error', err => errMessageOut(err));
    templatesFile.on('data', chunk => templates += chunk);
    templatesFile.on('end', () => buildHTML(templates));
  });
});

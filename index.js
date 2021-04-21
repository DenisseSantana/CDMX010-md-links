const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
//const markdownLinkExtractor = require('markdown-link-extractor');
const fetch = require('node-fetch');
const marked = require('marked');
// const colors = require('colors');

const routeExist = (route) => fs.existsSync(route); //Si existe la ruta
const routeIsAbsolute = (route) => path.isAbsolute(route); //Es absoluta?
const isItFile = (route) => fs.statSync(route).isFile(); //Es un archivo?
const isItMd = (route) => path.extname(route); // Verifica la extensión
const readDirectory = (route) => fs.readdirSync(route); //Lectura del directorio
// pasa de relativa a absoluta
const turnsAbsolut = (route) => {
  if (!routeIsAbsolute(route)) {
    return path.resolve(route);
  }
  return route;
};
//lee el directorio y específica la ruta
const directoriesAndRoutes = (route) =>
  readDirectory(route).map((element) => path.join(route, element));
//Extrae Archivos md
const searchFileMD = (route) => {
  let mdFiles = [];
  const filePath = turnsAbsolut(route);
  if (isItFile(filePath)) {
    if (isItMd(filePath) === '.md') {
      mdFiles.push(filePath);
    }
  } else {
    directoriesAndRoutes(route).forEach((element) => {
      const filesNewRoute = element;
      const getMdFilesInNewRoute = searchFileMD(filesNewRoute);
      mdFiles = mdFiles.concat(getMdFilesInNewRoute);
    });
  }
  return mdFiles;
};

//lee el archivo md
const readMDPath = (route) => fs.readFileSync(route).toString();

//Extrae los links
const extLinks = (route) => {
  const arrayLinks = [];
  const renderer = new marked.Renderer();
  searchFileMD(route).forEach((file) => {
    renderer.link = function (href, title, text) {
      const linksObject = {
        href,
        text,
        file,
      };
      arrayLinks.push(linksObject);
    };
    marked(readMDPath(file), { renderer });
  });
  const arrayLinkFilter = arrayLinks.filter((element) =>
    /https?:\/\/[a-zA-Z\\/-]+/gm.test(element.href)
  );
  return arrayLinkFilter;
};
// console.log(
//   extLinks(
//     'C:/Users/Antoneli/Documents/Developer/CDMX010-md-links/Markdown/cifrado.md'
//   )
// );

const toValidateOpt = (route) => {
  const arrayValidate = [];
  const linksArray = extLinks(route);
  linksArray.forEach((el) => {
    const obj = { ...el };
    arrayValidate.push(
      fetch(el.href)
        .then((res) => {
          if (res.status === 200) {
            obj.status = res.status;
            obj.statusText = 'OK';
            return obj;
          }
          if (res.status !== 200) {
            obj.status = res.status;
            obj.statusText = 'ERROR';
            return obj;
          }
        })
        .catch(() => {
          obj.status = 'Not Found 404';
          obj.statusText = 'ERROR';
          return obj;
        })
    );
  });
  return Promise.all(arrayValidate);
};

module.exports = {
  routeExist,
  routeIsAbsolute,
  isItFile,
  isItMd,
  readDirectory,
  turnsAbsolut,
  directoriesAndRoutes,
  searchFileMD,
  readMDPath,
  extLinks,
  toValidateOpt,
};
  // let readFile = fs.readFileSync(file, 'utf8');
//   console.log(chalk.blue(readFile)); 
  // const links = markdownLinkExtractor(route);
  
  // console.log(chalk.magenta(links));
//  links.forEach((link) => {
//     fetch(link) 
//       .then((response) => { 
//         let validate = {
//           href: link,
//           text: 'text', 
//           path: path.resolve(link),  
//           status: response.status,
//           statusText: response.statusText,
//         };
//         console.log(validate);
//       })
//       .catch((err) => {
//         let validate = {
//           href: link,
//           text: 'Fail', 
//           path: path.resolve(link),  
//           status: '404',
//           statusText: 'Not found'
//         };
//         console.log(validate)
//   });
// });
// };
// readFileMD('README.md');  
// readFileMD('./mockFiles/myFavoriteDoramas.md');



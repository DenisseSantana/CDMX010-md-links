const { turnsAbsolut, toValidateOpt, extLinks } = require("./index");

const mdLinks = (path, options) =>
  new Promise((resolve) => {
    const newRoute = turnsAbsolut(path);
    if (options.validate === true) {
      resolve(toValidateOpt(newRoute));
    } else {
      resolve(extLinks(newRoute));
    }
  });

module.exports = { mdLinks };
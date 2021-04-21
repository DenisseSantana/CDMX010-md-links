const { mdLinks } = require("./mdLinks");
const { allLinks, uniqueLinks, brokenLinks } = require("./optLinks");
const colors = require("colors");
const chalk = require("chalk");

const help = colors.rainbow(`

-------- Please introduce a valid route or option -------

      Example:  

      md-links pathToFile --validate               
      md-links pathToFile --stats                  
      md-links pathToFile --stats --validate       
      md-links pathToFile --validate --stats   
_________________________________________________________
`);

const cli = (path, options) => {
  if (options.stats === "--stats" && options.validate === "--validate") {
    return mdLinks(path, { validate: true }).then((data) => {
      console.log(data);
      let wiewOpts = "";
      wiewOpts += colors.bold.magenta(`
      • Total: ${colors.bold.brightYellow(allLinks(data))}      \n
      ✔ Uniques: ${colors.bold.brightGreen(uniqueLinks(data))}    \n
      ✖ Broken: ${colors.bold.brightRed(brokenLinks(data))}      \n`);
      return wiewOpts;
    });
  }
  if (options.stats == "--validate" && options.validate === "--stats") {
    return mdLinks(path, { validate: true }).then((data) => {
      console.log(data);
      let wiewOpts = "";
      wiewOpts += colors.bold.magenta(`
      • Total: ${colors.bold.brightYellow(allLinks(data))}      \n
      ✔ Uniques: ${colors.bold.brightGreen(uniqueLinks(data))}    \n
      ✖ Broken: ${colors.bold.brightRed(brokenLinks(data))}      \n`);
      return wiewOpts;
    });
  }
  if (options.stats === "--stats") {
    return mdLinks(path, { validate: false }).then((data) => {
      // console.log(data);
      let stat = "";
      stat += colors.bold.brightMagenta(`
      • Total: ${colors.bold.brightYellow(allLinks(data))}      \n
      ✔ Uniques: ${colors.bold.brightGreen(uniqueLinks(data))}    \n`);
      return stat;
    });
  }
  if (options.stats === "--validate") {
    return mdLinks(path, { validate: true }).then((data) => {
      let validate = "";
      data.forEach((element) => {
        validate += chalk.magentaBright(`
       Link: ${colors.rainbow(element.href)} 
       Status: ${
         element.statusText === "OK"
           ? colors.bold.green(element.statusText)
           : colors.bold.red(element.statusText)
       }  ${
          element.status == "200"
            ? colors.bold.green(element.status)
            : colors.bold.red(element.status)
        }
        `);
      });
      return validate;
    });
  }
  return mdLinks(path, { validate: false }).then(() => {
    console.log(help);
  });
};

// module.exports = {
//   cli,
// };

//Para meterlo en otro archivo
// const { cli } = require("./cli");
const path = process.argv[2];
const options = {
  stats: process.argv[3],
  validate: process.argv[4],
};

cli(path, options)
  .then((res) => console.log(res))
  .catch(() => console.log("Please enter a valid route"));
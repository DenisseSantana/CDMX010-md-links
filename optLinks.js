  
const allLinks = (array) => array.length;
// console.log(allLinks("Markdown/cifrado"));

const uniqueLinks = (array) => [...new Set(array)].length;
// console.log(uniqueLinks("Markdown/cifrado"));

const brokenLinks = (array) =>
  array.filter((obj) => obj.statusText === "ERROR").length;

module.exports = {
  allLinks,
  uniqueLinks,
  brokenLinks,
};
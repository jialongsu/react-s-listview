const path = require('path');

module.exports = {
  groupUrlAry: function(urlAry) {
    const ary = [];
    urlAry.map((item) => {
      ary.push(path.resolve(__dirname, `../../${item}`));
    });
    return ary;
  },
  groupUrlObj: function(urlObj) {
    Object.keys(urlObj).forEach((key) => {
      urlObj[key] = path.resolve(__dirname, `../../${urlObj[key]}`);
    });
    return urlObj;
  }
};
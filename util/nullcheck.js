module.exports.isNotNull = function (obj) {
  return obj != undefined && obj != null;
};

module.exports.isNull = function (obj) {
  return obj == null || obj == undefined;
};

module.exports.ensureNotNull = function (obj, throwMsg) {
  if (obj == undefined || obj == null) {
    throw new Error(throwMsg);
  }
};

module.exports.ensureEqual = function (arg0, arg1, throwMsg) {
  if (arg0 != arg1) {
    throw new Error(throwMsg);
  }
};

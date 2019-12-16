const protobuf = require("protobufjs");

function load(protoPath, loadRequest, loadResponse) {
  loadRequest = loadRequest != false;
  loadResponse = loadResponse != false;
  const root = protobuf.loadSync(protoPath);
  const request = root.lookupType("Request");
  const response = root.lookupType("Response");
  return [request, response];
}

module.exports = {
  load: load
}

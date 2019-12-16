const crypto = require("crypto");

function headerLength() {
  return 44;
}

function prepare(protoId, packetId, bodyBuf) {
  const sha1 = crypto.createHash("sha1");

  return Buffer.concat([
    Buffer.from("FT", "utf8"),
    Buffer.from(Uint32Array.from([parseInt(protoId)]).buffer),
    Buffer.from(Uint8Array.from([0]).buffer),
    Buffer.from(Uint8Array.from([0]).buffer),
    Buffer.from(Uint32Array.from([packetId]).buffer),
    Buffer.from(Uint32Array.from([bodyBuf.length]).buffer),
    sha1.update(bodyBuf).digest(),
    Buffer.alloc(8, 0)
  ]);
}

function parse(buf) {
  var res = {
    szHeaderFlag: buf.toString("utf8", 0, 2),
    nProtoID: buf.readUInt32LE(2) + "",
    nProtoFmtType: buf.readUInt8(6),
    nProtoVer: buf.readUInt8(7),
    nSerialNo: buf.readUInt32LE(8),
    nBodyLen: buf.readUInt32LE(12),
    arrBodySHA1: buf.slice(16, 36).toString("hex"),
    arrReserved: buf.slice(36, 44)
  };
  return res;
}

function getRequestId(headerBuf) {
  return parse(headerBuf)["nSerialNo"];
}

module.exports = {
  prepare: prepare,
  parse: parse,
  getRequestId: getRequestId,
  headerLength: headerLength
};

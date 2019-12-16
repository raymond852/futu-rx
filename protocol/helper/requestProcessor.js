const rxjs = require("rxjs");
const throwError = rxjs.throwError;
const header = require("./header");
const crypto = require('crypto');
const Client = require('../../socket/client');

function process(clientInstance, protoId, reqProto, respProto, jsonPayload, callerContext, aesKey) {
  var request = reqProto.create({
    c2s: jsonPayload
  });

  var errMsg = reqProto.verify(request);
  if (errMsg) {
    return throwError(new Client.Error(null, request, null, callerContext, new Error(errMsg)));
  }

  var bodyBuffer = reqProto.encode(request).finish();

  if (aesKey) {
    var mod16 = bodyBuffer.length % 16;
    var aesBufferKey = Buffer.from(aesKey);
    var cipher = crypto.createCipheriv("aes-128-ecb", aesBufferKey, '');
    cipher.setAutoPadding(false);
    var paddingBuf = Buffer.alloc(16, 0);
    if (mod16 == 0) {
      var encrypted = cipher.update(bodyBuffer);
      cipher.final();
      bodyBuffer = Buffer.concat([encrypted, paddingBuf])
    } else {
      var paddedBuf = Buffer.concat([bodyBuffer, Buffer.alloc(16 - mod16, 0)]);
      var encrypted = cipher.update(paddedBuf);
      cipher.final();
      paddingBuf.writeUInt8(mod16, paddingBuf.length - 1);
      bodyBuffer = Buffer.concat([encrypted, paddingBuf]);
    }
  }

  var packetReqId = clientInstance.nextRequestId();

  headerBuffer = header.prepare(protoId, packetReqId, bodyBuffer);

  const resDeserializer = (respBuf) => {
    var protoRespBuf;
    if (aesKey) {
      var aesBufferKey = Buffer.from(aesKey);
      var decipher = crypto.createDecipheriv("aes-128-ecb", aesBufferKey, '');
      decipher.setAutoPadding(false);
      var decrypted = decipher.update(respBuf.slice(header.headerLength(), respBuf.length - 16));
      decipher.final();
      var mod16 = respBuf.readUInt8(respBuf.length - 1);
      if (mod16 == 0) {
        protoRespBuf = decrypted;
      } else {
        protoRespBuf = decrypted.slice(0, decrypted.length - 16 + mod16);
      }
    } else {
      protoRespBuf = respBuf.slice(header.headerLength());
    }
    var response = respProto.decode(protoRespBuf);
    if (response.retType != 0) {
      throw new Error("Invalid response=" + JSON.stringify(response));
    }
    return respProto.toObject(response);
  };

  return clientInstance.sendRequestAndHandleResponse(
    packetReqId,
    header.getRequestId,
    request,
    () => {
      var ret = Buffer.concat([headerBuffer, bodyBuffer])
      headerBuffer = null;
      bodyBuffer = null;
      return ret;
    },
    resDeserializer,
    clientInstance._packetTimeoutMs,
    callerContext
  );
}

module.exports = {
  process: process
}

import crypto from 'crypto-js';

interface SignatureType {
  headers: {
    platform: string;
    version: string;
    timestamp: number;
  };
  body?: Object;
  params?: Object;
  restful?: string;
}

//自然算法
Array.prototype.naturalSort = function () {
  var a,
    b,
    a1,
    b1,
    rx = /(\d+)|(\D+)/g,
    rd = /\d+/;
  return this.sort(function (as, bs) {
    a = String(as).toLowerCase().match(rx);
    b = String(bs).toLowerCase().match(rx);
    while (a.length && b.length) {
      a1 = a.shift();
      b1 = b.shift();
      if (rd.test(a1) || rd.test(b1)) {
        if (!rd.test(a1)) return 1;
        if (!rd.test(b1)) return -1;
        if (a1 != b1) return a1 - b1;
      } else if (a1 != b1) return a1 > b1 ? 1 : -1;
    }
    return a.length - b.length;
  });
};

//生成 Sha256 签名
export const getSignatureSha256 = function (signatureParams: SignatureType): string {
  const { headers, body, params, restful } = signatureParams;
  let signatureString = '';

  //headers 处理
  const headersArray = [],
    paramsArray = [];
  for (let key in headers) {
    headersArray.push(`${key}=${headers[key]}`);
  }
  signatureString += headersArray.naturalSort().join('#');

  //body 处理 空不参与生成
  if (JSON.stringify(body) !== '{}') {
    signatureString += '#' + JSON.stringify(body);
  }

  //params 空不参与生成
  if (JSON.stringify(params) !== '{}') {
    //params 处理
    for (let key in params) {
      paramsArray.push(`${key}=${params[key]}`);
    }
    signatureString += '#' + paramsArray.naturalSort().join('#');
  }

  //restful 空不参与生成
  if (restful.length > 0) {
    signatureString += '#' + restful.split('/').naturalSort().join(',');
  }

  return crypto.SHA256(signatureString);
};

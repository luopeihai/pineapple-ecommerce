/**
 * 生成UUID
 * @return UUID
 */
export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * 验证图片像素验证
 * @param url  图片url
 * @param width  图片规定宽度
 * @param height 图片规定高度
 */
export function validatorImagePx(url, width, height) {
  return new Promise((resolve, reject) => {
    if (url) {
      const img = new Image();
      img.src = url;
      img.onload = function () {
        //验证像素
        if (img.width !== width || img.height !== height) {
          reject(`图片请传规定尺寸${width}*${height}`);
        } else {
          resolve();
        }
      };
    } else {
      //无url 不验证
      resolve();
    }
  });
}

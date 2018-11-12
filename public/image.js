/*!
 * image
 * xiekai <xk285985285@.qq.com>
 * create: 2018/09/08
 * since: 0.0.1
 */
'use strict';

import { EXIF } from "exif-js";
import compress from '@root/public/compress';

// 图片旋转
export const rotateImg = img => {
  return new Promise((resolve, reject) => {
    // 通过得到图片的信息来调整显示方向以正确显示图片，主要解决 ios 系统上的图片会有旋转的问题
    EXIF.getData(img, () => {
      resolve(EXIF.getTag(img, "Orientation") || 1);
    });
  });
}

// 图片压缩
export const compressImg = async in_img => {
  let out_img;
  if(await rotateImg(in_img) == 1){
    out_img = await compress(in_img, {
      quality: .92,
      maxWidth: 800,
      noCompressIfLarger: true,
    });
  }else{
    let rotatImg = await compress(in_img, {
      quality: .92,
    });
    out_img = await compress(rotatImg.dist, {
      quality: .92,
      maxWidth: 800,
      noCompressIfLarger: true,
    });
  }
  return out_img;
}

export default {
  rotateImg,
  compressImg,
};

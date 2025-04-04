import crypto from 'crypto';

export function generateHexDump32() {
  const randomBytes = crypto.randomBytes(16); // 生成16字节的随机数
  let result = '';

  for (let i = 0; i < randomBytes.length; i += 4) {
    // 读取每4字节，并转换为大端序的十六进制字符串，确保长度为8位
    const hexValue = randomBytes.readUInt32BE(i).toString(16).toUpperCase();
    result += hexValue.padStart(8, '0'); // 确保每个4字节输出为8位
  }

  return result; // 最终输出32位十六进制字符串
}

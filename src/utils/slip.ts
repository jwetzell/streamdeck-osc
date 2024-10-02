const END = 0xc0;
const ESC = 0xdb;
const ESC_END = 0xdc;
const ESC_ESC = 0xdd;

function encode(bytes: Buffer): Buffer {
  const encoded: number[] = [];

  bytes.forEach((byte) => {
    if (byte === END) {
      encoded.push(ESC_END);
    } else if (byte === ESC) {
      encoded.push(ESC_ESC);
    } else {
      encoded.push(byte);
    }
  });

  encoded.push(END);

  return Buffer.from(encoded);
}

export default {
  encode,
};

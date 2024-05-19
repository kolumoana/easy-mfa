import { createHmac } from "crypto";
import { err, ok, Result } from "neverthrow";

export const generateAuthCode = (
  backupCode: string
): Result<{ code: string; remaining: number }, Error> =>
  validateBackUpCodeLength(backupCode)
    .andThen(base32Decode)
    .andThen(generateTOTP);

const validateBackUpCodeLength = (
  backupCode: string
): Result<string, Error> => {
  const removedSpace = backupCode.replace(/\s/g, "");
  if (removedSpace.length !== 32) {
    return err(new Error("Invalid backup code length"));
  }
  return ok(removedSpace);
};

const base32Decode = (input: string): Result<Uint8Array, Error> => {
  const base32Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  const output = new Uint8Array((input.length * 5) / 8);
  let bits = 0;
  let value = 0;
  let index = 0;

  for (let i = 0; i < input.length; i++) {
    const val = base32Chars.indexOf(input[i].toUpperCase());
    if (val === -1) {
      return err(new Error("Invalid base32 character"));
    }
    value = (value << 5) | val;
    bits += 5;
    if (bits >= 8) {
      output[index++] = (value >> (bits - 8)) & 0xff;
      bits -= 8;
    }
  }

  return ok(output);
};

const generateTOTP = (
  key: Uint8Array,
  step: number = 30,
  digits: number = 6
): Result<{ code: string; remaining: number }, Error> => {
  const epoch = Math.floor(Date.now() / 1000);
  const time = Math.floor(epoch / step);
  const remaining = step - (epoch % step);
  const timeBuffer = Buffer.alloc(8);
  timeBuffer.writeUInt32BE(Math.floor(time / 0x100000000), 0);
  timeBuffer.writeUInt32BE(time & 0xffffffff, 4);

  const hmac = createHmac("sha1", key).update(timeBuffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const code = (hmac.readUInt32BE(offset) & 0x7fffffff) % 10 ** digits;

  return ok({ code: code.toString().padStart(digits, "0"), remaining });
};

import { randomBytes } from 'crypto';

const generateRandomString = (length) => {
  return randomBytes(60)
  .toString('hex')
  .slice(0, length);
}

export default generateRandomString;
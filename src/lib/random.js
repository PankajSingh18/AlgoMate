/**
 * Generates a cryptographically secure random alphanumeric code.
 * @param {number} length - The length of the generated code.
 * @returns {string} - The generated secure code.
 */
export function generateSecureCode(length = 6) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const biasLimit = Math.floor(2 ** 32 / charset.length) * charset.length;
  const array = new Uint32Array(length);
  let code = '';
  let filled = 0;
  while (filled < length) {
    globalThis.crypto.getRandomValues(array);
    for (let i = 0; i < array.length && filled < length; i++) {
      if (array[i] < biasLimit) {
        code += charset[array[i] % charset.length];
        filled++;
      }
    }
  }
  return code;
}

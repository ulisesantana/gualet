const IDS = {};
const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateRandomId(length: number = 16): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  // Check if the generated ID already exists
  while (IDS[result]) {
    result = generateRandomId(length);
  }
  // Store the generated ID to avoid duplicates
  IDS[result] = true;
  return result;
}

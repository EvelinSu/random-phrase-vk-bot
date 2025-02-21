export function generateInt64(): bigint {
  return BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)); // <= 2^53-1
}
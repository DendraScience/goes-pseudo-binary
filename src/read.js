/**
 * Functions to read pseudo binary data in buffers.
 */

// NOTE: Some code adapted from Node Buffer: https://github.com/nodejs/node/blob/master/lib/buffer.js

const BASE_10 = [1, 10, 100, 1000]
const MASK = 0x3f

function checkOffset (offset, ext, length) {
  if (offset + ext > length) throw new RangeError('Index out of range')
}

export function readFP2 (buf, offset, noAssert) {
  offset = offset >>> 0

  if (!noAssert) checkOffset(offset, 3, buf.length)

  const s = (buf[offset] & 0x8) >>> 3
  const e = (buf[offset] & 0x6) >>> 1
  const m = ((buf[offset] & 0x1) << 12) | ((buf[offset + 1] & MASK) << 6) | (buf[offset + 2] & MASK)

  // NOTE: In theory the following nice, but it introduces rounding errors
  // if (m < 8000) return Math.pow(-1, s) * Math.pow(10, -e) * m

  if (m < 8000) {
    let val = e > 0 ? m / BASE_10[e] : m
    return s ? -val : val
  }
  if (m === 8190 && e === 0 && s === 1) return NaN
  if (m === 8191 && e === 0 && s === 1) return Number.NEGATIVE_INFINITY
  if (m === 8191 && e === 0 && s === 0) return Number.POSITIVE_INFINITY
  if (!noAssert) throw new Error('Invalid pseduo binary data')
}

export function readInt (buf, offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0

  if (!noAssert) checkOffset(offset, byteLength, buf.length)

  let i = byteLength
  let mul = 1
  let val = buf[offset + --i] & MASK
  while (i > 0 && (mul *= 0x40)) {
    val += (buf[offset + --i] & MASK) * mul
  }
  mul *= 0x20

  if (val >= mul) val -= Math.pow(2, 6 * byteLength)

  return val
}

export function readInt6 (buf, offset, noAssert) {
  return readInt(buf, offset, 1, noAssert)
}

export function readInt12 (buf, offset, noAssert) {
  return readInt(buf, offset, 2, noAssert)
}

export function readInt18 (buf, offset, noAssert) {
  return readInt(buf, offset, 3, noAssert)
}

export function readInt24 (buf, offset, noAssert) {
  return readInt(buf, offset, 4, noAssert)
}

export function readUInt (buf, offset, byteLength, noAssert) {
  offset = offset >>> 0
  byteLength = byteLength >>> 0

  if (!noAssert) checkOffset(offset, byteLength, buf.length)

  let val = buf[offset + --byteLength] & MASK
  let mul = 1
  while (byteLength > 0 && (mul *= 0x40)) {
    val += (buf[offset + --byteLength] & MASK) * mul
  }

  return val
}

export function readUInt6 (buf, offset, noAssert) {
  return readUInt(buf, offset, 1, noAssert)
}

export function readUInt12 (buf, offset, noAssert) {
  return readUInt(buf, offset, 2, noAssert)
}

export function readUInt18 (buf, offset, noAssert) {
  return readUInt(buf, offset, 3, noAssert)
}

export function readUInt24 (buf, offset, noAssert) {
  return readUInt(buf, offset, 4, noAssert)
}

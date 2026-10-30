import { Reader } from './ollama-key-reader.js'
export function readOuter(bytes: Buffer): { publicBlob: Buffer; inner: Buffer } {
  const magic = Buffer.from('openssh-key-v1\0')
  if (!bytes.subarray(0, magic.length).equals(magic)) throw new Error('bad magic')
  const outer = new Reader(bytes.subarray(magic.length))
  if (outer.string().toString() !== 'none' || outer.string().toString() !== 'none' ||
    outer.string().length !== 0 || outer.uint() !== 1) throw new Error('bad outer')
  const publicBlob = outer.string()
  return { publicBlob, inner: outer.string() }
}

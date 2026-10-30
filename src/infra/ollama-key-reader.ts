export class Reader {
  private offset = 0
  constructor(private readonly bytes: Buffer) {}
  uint(): number {
    if (this.offset + 4 > this.bytes.length) throw new Error('short')
    const value = this.bytes.readUInt32BE(this.offset)
    this.offset += 4
    return value
  }
  string(): Buffer {
    const size = this.uint()
    if (size > this.bytes.length - this.offset) throw new Error('short')
    const value = this.bytes.subarray(this.offset, this.offset + size)
    this.offset += size
    return value
  }
}

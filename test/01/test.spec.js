/**
 * Main tests
 */

describe('Module', function () {
  const fp2Buf = Buffer.from('425f7842514c464040464040464040464040464040464040464040464040464040464040464040464040464040464040445f7d445f6f445f7545707745706645706f404f71464040464040497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e445343445342445343446052447b58476d58436876425f78424f68464040464040464040464040464040464040464040464040464040464040464040464040464040464040446044445f73445f7b45707a457051457069404f71464040464040497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e445343445343445343446057447b58476d58436876425f78454e48464040464040464040464040464040464040464040464040464040464040464040464040464040464040446047445f7a446040457077456f73457055404f71464040464040497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e44534344534344534344605a447974476d58436876425f78447e6046404046404046404046404046404046404046404046404046404046404046404046404046404046404044604b445f7d446044457040456f50456f69404f71464040464040497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e445343445342445343446060447974476d58436876425f78446e7846404046404046404046404046404046404046404046404046404046404046404046404046404046404044605144604444604a456f65456e75456f4e404f71464040464040497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e44534344517544527e446065447974476d58436876425f78445f5046404046404046404046404046404046404046404046404046404046404046404046404046404046404044605b44604a446050456f54456e64456e7f404f71464040464040497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e497f7e44534444526f44534144606a447974476d58436876', 'hex')
  const fp2Row0 = [204, 110, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 20.45, 20.31, 20.37, 72.23, 72.06, 72.15, 1009, 0, 0, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, 12.19, 12.18, 12.19, 20.66, 38, 7, 671]

  const mixedBuf = Buffer.from([
    0b01000100, 0b01010011, 0b01010010,
    0b01001100, 0b01010011, 0b01010010,
    0b01000001, 0b01111111, 0b01111111,
    0b01001001, 0b01111111, 0b01111111,
    0b01001001, 0b01111111, 0b01111110,
    0b01000011, 0b01000000, 0b01111001,
    0b01111100, 0b01111111, 0b01000111,
    0b01000011, 0b01000000, 0b01111001
  ])
  const mixedRow0 = [12.34, -12.34, +Infinity, -Infinity, NaN, 12345, -12345, 12345]

  let pb
  let fp2Decoder
  let mixedDecoder

  it('should import', function () {
    pb = require('../../dist')

    expect(pb).to.have.property('Decoder')
    expect(pb).to.have.property('readFP2')
  })

  it('should read FP2 positive', function () {
    const buf = Buffer.from([0b01000100, 0b01010011, 0b01010010])

    expect(pb.readFP2(buf, 0)).to.equal(12.34)
  })

  it('should read FP2 negative', function () {
    const buf = Buffer.from([0b01001100, 0b01010011, 0b01010010])

    expect(pb.readFP2(buf, 0)).to.equal(-12.34)
  })

  it('should read FP2 positive Infinity', function () {
    const buf = Buffer.from([0b01000001, 0b01111111, 0b01111111])

    expect(pb.readFP2(buf, 0)).to.equal(+Infinity)
  })

  it('should read FP2 negative Infinity', function () {
    const buf = Buffer.from([0b01001001, 0b01111111, 0b01111111])

    expect(pb.readFP2(buf, 0)).to.equal(-Infinity)
  })

  it('should read FP2 NaN', function () {
    const buf = Buffer.from([0b01001001, 0b01111111, 0b01111110])

    expect(pb.readFP2(buf, 0)).to.be.NaN
  })

  it('should read Int18 positive', function () {
    const buf = Buffer.from([0b01000011, 0b01000000, 0b01111001])

    expect(pb.readInt18(buf, 0)).to.equal(12345)
  })

  it('should read Int18 negative', function () {
    const buf = Buffer.from([0b01111100, 0b01111111, 0b01000111])

    expect(pb.readInt18(buf, 0)).to.equal(-12345)
  })

  it('should read UInt18', function () {
    const buf = Buffer.from([0b01000011, 0b01000000, 0b01111001])

    expect(pb.readUInt18(buf, 0)).to.equal(12345)
  })

  it('should create FP2 decoder', function () {
    fp2Decoder = new pb.Decoder('fp2_29,fp2_29')

    expect(fp2Decoder).to.have.property('machine')
  })

  it('should decode FP2 buffer', function () {
    return fp2Decoder.decode(fp2Buf).then(ret => {
      expect(ret.rows).to.have.property('length', 6)
      expect(ret.rows[0]).to.deep.equal(fp2Row0)
    })
  })

  it('should decode FP2 buffer with limit', function () {
    return fp2Decoder.decode(fp2Buf, 1).then(ret => {
      expect(ret).to.have.property('limit', 1)
      expect(ret.rows).to.have.property('length', 1)
      expect(ret.rows[0]).to.deep.equal(fp2Row0)
    })
  })

  it('should destroy FP2 decoder', function () {
    fp2Decoder.destroy()

    expect(fp2Decoder).to.have.property('machine').to.be.null
  })

  it('should create mixed decoder', function () {
    mixedDecoder = new pb.Decoder('fp2_5,i_3_2,u_3')

    expect(mixedDecoder).to.have.property('machine')
  })

  it('should decode mixed buffer', function () {
    return mixedDecoder.decode(mixedBuf).then(ret => {
      expect(ret.rows).to.have.property('length', 1)
      expect(ret.rows[0]).to.deep.equal(mixedRow0)
    })
  })

  it('should destroy mixed decoder', function () {
    mixedDecoder.destroy()

    expect(mixedDecoder).to.have.property('machine').to.be.null
  })
})

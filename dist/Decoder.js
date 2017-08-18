'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taskMachine = require('@dendra-science/task-machine');

var tm = _interopRequireWildcard(_taskMachine);

var _read = require('./read');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

const parsers = {
  fp2(ctx, count = 1) {
    const a = [];
    let c = count | 0;
    let o = 0;

    while (c-- > 0) {
      a.push((0, _read.readFP2)(ctx.buf, o, ctx.noAssert));
      o += 3;
    }

    ctx.buf = ctx.buf.slice(o);
    return a;
  },
  i(ctx, byteLength = 1, count = 1) {
    const a = [];
    const l = byteLength | 0;
    let c = count | 0;
    let o = 0;

    while (c-- > 0) {
      a.push((0, _read.readInt)(ctx.buf, o, l, ctx.noAssert));
      o += l;
    }

    ctx.buf = ctx.buf.slice(o);
    return a;
  },
  s(ctx, byteLength = 1, count = 1) {
    const a = [];
    const l = byteLength | 0;
    let c = count | 0;
    let o = 0;

    while (c-- > 0) {
      a.push(ctx.buf.toString('utf8', o, o + l));
      o += l;
    }

    ctx.buf = ctx.buf.slice(o);
    return a;
  },
  u(ctx, byteLength = 1, count = 1) {
    const a = [];
    const l = byteLength | 0;
    let c = count | 0;
    let o = 0;

    while (c-- > 0) {
      a.push((0, _read.readUInt)(ctx.buf, o, l, ctx.noAssert));
      o += l;
    }

    ctx.buf = ctx.buf.slice(o);
    return a;
  }
};

/**
 * Decoder class to read pseudo binary data based on a format.
 */
class Decoder {
  constructor(format) {
    this.format = format;

    const ctx = {}; // Parser context passed as the task machine model
    const fns = []; // Parser functions bound to the context and format args

    // Pre-process the format string
    format.split(',').forEach(spec => {
      const args = spec.split('_');
      const parser = parsers[args[0]];

      if (parser) {
        fns.push(parser.bind(null, ctx, ...args.slice(1)));
      }
    });

    this.machine = new tm.TaskMachine(ctx, {
      decode: {
        clear(m) {
          m.rows = [];
        },
        guard(m) {
          return !m.decodeError && m.buf.length > 0 && (typeof m.limit !== 'number' || m.limit-- > 0);
        },
        execute(m) {
          return new Promise((resolve, reject) => {
            let vals = [];
            fns.forEach(fn => {
              vals = vals.concat(fn());
            });
            return vals.length > 0 ? resolve(vals) : reject(new Error('No data found'));
          });
        },
        assign(m, res) {
          m.rows.push(res);
        }
      }
    }, {
      interval: -1
    });
  }

  /**
   * Cancel processing immediately and clean up.
   */
  destroy() {
    this.machine.destroy();

    this.machine = null;
  }

  /**
   * Begin decoding a buffer. Uses a task machine to process the buffer asynchronously.
   */
  decode(buf, limit, noAssert) {
    if (!this.machine) throw new Error('Decoder destroyed');

    Object.assign(this.machine.model, {
      buf,
      limit,
      noAssert
    });
    return this.machine.clear().start().then(success => {
      const model = this.machine.model;

      // Clean up
      delete model.buf;
      delete model.limit;
      delete model.noAssert;

      if (!success) throw new Error('Decoder failed');

      const res = {
        format: this.format
      };
      if (typeof limit === 'number') res.limit = limit;
      if (model.decodeError) res.error = model.decodeError;
      res.rows = model.rows;
      return res;
    });
  }
}
exports.default = Decoder;
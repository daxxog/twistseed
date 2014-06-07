/* Twistseed
 * A Mersenne twister
 * (c) 2013 David (daXXog) Volm ><> + + + <><
 * Released under Apache License, Version 2.0:
 * http://www.apache.org/licenses/LICENSE-2.0.html  
 */

/* UMD LOADER: https://github.com/umdjs/umd/blob/master/returnExports.js */
(function (root, factory) {
    if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else {
        // Browser globals (root is window)
        root.Twistseed = factory();
  }
}(this, function() {
    var Twistseed;
    
    Twistseed = function(seed) {
        if(typeof seed == 'undefined') {
            seed = Math.round(Math.random() * 2147483647);
        }

        this.l = 624;
        this.mem = new Array(this.l);
        this.memx = [];
        this.memy = [];
        this.i = 0;

        this.mem[this.i] = seed >>> 0;

        this.mem = this.gen(this.mem);
        this.memx = this.gen(this.mem);
        this.memy = this.gen(this.memx);
    };

    Twistseed.prototype.gen = function(m) {
        var mem = m.map(function(x) { //clone
            return x;
        });

        for(var i = 0; i < (this.l - 1); i++) {
            var s = mem[i] ^ (mem[i] >>> 30);
            mem[i + 1] = (((((s & 0xffff0000) >>> 16) * 1812433253) << 16) + (s & 0x0000ffff) * 1812433253) + i;
            mem[i + 1] >>>= 0;
        }

        return mem;
    };

    Twistseed.prototype.rand = function() {
        var that = this;

        if(this.i === this.l) {
            this.mem = this.memx.map(function(x) { //clone
                return x;
            });

            setTimeout(function() { //experimental memory swapping async
                that.memx = that.gen(that.memy);
                that.memy = that.gen(that.memx);
            }, 0);

            this.i = 0;
        }

        var y = this.mem[this.i];

        y ^= (y >>> 11);
        y ^= (y << 7) & 0x9d2c5680;
        y ^= (y << 15) & 0xefc60000;
        y ^= (y >>> 18);

        this.i++;

        return y >>> 0;
    };

    return Twistseed;
}));

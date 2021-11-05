function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

// Set's the DPR of the canvas
var dpr = window.devicePixelRatio || 1;

var OrbitSystem = /*#__PURE__*/function () {
  function OrbitSystem(canvas) {
    var _this = this;

    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    _classCallCheck(this, OrbitSystem);

    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.bodies = [];
    this.paused = false;
    this.settings = {
      gravity: 1
    }; // Merge the settings with the options

    for (var key in this.settings) {
      if (Object.hasOwnProperty.call(this.settings, key) && options.hasOwnProperty(key)) {
        this.settings[key] = options[key];
      }
    }

    this.G = this.settings.gravity;
    window.addEventListener('resize', function () {
      return _this.resize();
    });
    this.resize();
  } // Resize the canvas to fill the window


  _createClass(OrbitSystem, [{
    key: "resize",
    value: function resize() {
      this.canvas.width = window.innerWidth * dpr;
      this.canvas.height = window.innerHeight * dpr;
    } // Helper function to append more bodies to the system

  }, {
    key: "createBody",
    value: function createBody() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.bodies.push(new Body(options));
      return this.bodies[this.bodies.length - 1];
    } // Call this to begin the simulation

  }, {
    key: "start",
    value: function start() {
      if (this.paused === false) {
        this.paused === true;
        this.draw();
      }

      ;
    }
  }, {
    key: "stop",
    value: function stop() {
      this.paused = true;
    }
  }, {
    key: "draw",
    value: function draw() {
      var _this2 = this;

      window.requestAnimationFrame(function () {
        // Apply our gravity equation
        _this2.gravity(); // Clear the canvas


        _this2.ctx.clearRect(0, 0, _this2.canvas.width, _this2.canvas.height); // Update the bodies and draw them to the canvas


        _this2.bodies.forEach(function (body) {
          body.update(1);
          body.draw(_this2.ctx);
        }); // Draw the canvas


        if (_this2.paused == false) _this2.draw();
      });
    }
  }, {
    key: "gravity",
    value: function gravity() {
      // Double loop to relate all bodies to one another
      for (var i = 0; i < this.bodies.length; i++) {
        for (var j = 0; j < this.bodies.length; j++) {
          // Skip this function if the bodies is trying to relate to itself
          if (i == j) continue; // Our two relevant bodies

          this.b1 = this.bodies[i];
          this.b2 = this.bodies[j]; // Calculate the distance between our bodies

          this.distance = Math.sqrt((this.b1.x - this.b2.x) * (this.b1.x - this.b2.x) + (this.b1.y - this.b2.y) * (this.b1.y - this.b2.y)); // Set a minimum distance

          this.distance = this.distance < this.b1.boundary + this.b2.boundary ? this.b1.boundary + this.b2.boundary : this.distance; // Gravity equation

          this.force = this.G * (this.b1.mass * this.b2.mass) / this.distance / this.distance; // Helpful readability variables

          this.nx = (this.b2.x - this.b1.x) / this.distance;
          this.ny = (this.b2.y - this.b1.y) / this.distance; // Move the bodies unless they are immobile

          if (this.b1.mobile) {
            this.b1.ax += this.nx * this.force / this.b1.mass;
            this.b1.ay += this.ny * this.force / this.b1.mass;
          }

          if (this.b2.mobile) {
            this.b2.ax -= this.nx * this.force / this.b2.mass;
            this.b2.ay -= this.ny * this.force / this.b2.mass;
          }
        }
      }
    }
  }]);

  return OrbitSystem;
}();

export { OrbitSystem as default };

var Body = /*#__PURE__*/function () {
  function Body() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, Body);

    this.settings = {
      x: 0,
      y: 0,
      v: 0,
      color: '#000000',
      angle: 0,
      mass: 1,
      radius: 5,
      boundary: null,
      mobile: true,
      trail: 0
    }; // Merge the settings with the options

    for (var key in this.settings) {
      if (Object.hasOwnProperty.call(this.settings, key) && options.hasOwnProperty(key)) {
        this.settings[key] = options[key];
      }
    }

    this.trail = [];
    this.init();
  }

  _createClass(Body, [{
    key: "init",
    value: function init() {
      this.x = this.settings.x * dpr;
      this.y = this.settings.y * dpr;
      this.v = this.settings.v;
      this.vx = this.settings.v * Math.cos(this.settings.angle);
      this.vy = this.settings.v * Math.sin(this.settings.angle);
      this.mass = this.settings.mass;
      this.radius = this.settings.radius * dpr;
      this.ax = 0;
      this.ay = 0;
      this.mobile = this.settings.mobile;
      this.color = this.settings.color;
      this.boundary = this.settings.boundary == null ? this.settings.radius : this.settings.boundary * dpr;
    }
  }, {
    key: "update",
    value: function update(dt) {
      if (this.settings.trail >= 1) {
        if (this.trail.length >= this.settings.trail) this.trail.shift();
        this.trail.push({
          x: this.x,
          y: this.y
        });
      }

      this.vx += this.ax * dt;
      this.vy += this.ay * dt;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.ax = 0;
      this.ay = 0;
    }
  }, {
    key: "draw",
    value: function draw(ctx) {
      ctx.beginPath();
      ctx.globalAlpha = 1;
      ctx.arc(this.x, this.y, this.radius, 0, 6.28);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();

      if (this.settings.trail !== 0) {
        for (var index = this.trail.length - 1; index > 0; index--) {
          var point = this.trail[index];
          this.nextPoint = this.trail[index + 1] || this;
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(this.nextPoint.x, this.nextPoint.y);
          ctx.strokeStyle = this.color;
          ctx.globalAlpha = index / this.trail.length;
          ctx.lineWidth = this.radius * 2;
          ctx.stroke();
          ctx.closePath();
        }
      }
    }
  }]);

  return Body;
}();
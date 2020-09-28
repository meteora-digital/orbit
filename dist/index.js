function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

import { objectAssign, attach } from '@meteora-digital/helpers'; // Set's the DPR of the canvas

var dpr = window.devicePixelRatio || 1;

var OrbitSystem = /*#__PURE__*/function () {
  function OrbitSystem(canvas) {
    var _this = this;

    var gravity = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;

    _classCallCheck(this, OrbitSystem);

    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.bodies = [];
    this.started = false;
    this.G = gravity;
    attach(window, 'resize', function () {
      return _this.resize();
    });
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
    } // Call this to begin the simulation

  }, {
    key: "start",
    value: function start() {
      if (this.started === false) {
        this.started === true;
        this.draw();
      }

      ;
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


        _this2.draw();
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

          this.distance = this.distance < this.b1.r + this.b2.r ? this.b1.r + this.b2.r : this.distance; // Gravity equation

          this.force = this.G * (this.b1.m * this.b2.m) / this.distance / this.distance; // Helpful readability variables

          this.nx = (this.b2.x - this.b1.x) / this.distance;
          this.ny = (this.b2.y - this.b1.y) / this.distance; // Move the bodies unless they are immobile

          if (this.b1.mobile) {
            this.b1.ax += this.nx * this.force / this.b1.m;
            this.b1.ay += this.ny * this.force / this.b1.m;
          }

          if (this.b2.mobile) {
            this.b2.ax -= this.nx * this.force / this.b2.m;
            this.b2.ay -= this.ny * this.force / this.b2.m;
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

    this.settings = objectAssign({
      x: 0,
      y: 0,
      v: 0,
      angle: 0,
      mass: 1,
      radius: 5,
      mobile: true
    }, options);
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
      this.m = this.settings.mass;
      this.r = this.settings.radius * dpr;
      this.ax = 0;
      this.ay = 0;
      this.mobile = this.settings.mobile;
    }
  }, {
    key: "update",
    value: function update(dt) {
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
      ctx.arc(this.x, this.y, this.r, 0, 6.28);
      ctx.fill();
    }
  }]);

  return Body;
}();
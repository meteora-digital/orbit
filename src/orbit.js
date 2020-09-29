import { objectAssign, attach } from '@meteora-digital/helpers';

// Set's the DPR of the canvas
const dpr = window.devicePixelRatio || 1;

export default class OrbitSystem {
  constructor(canvas, options = {}) {
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    this.bodies = [];
    this.started = false;

    this.settings = objectAssign({
      gravity: 1,
    }, options);

    this.G = this.settings.gravity;

    attach(window, 'resize', () => this.resize());
  }

  // Resize the canvas to fill the window
  resize() {
    this.canvas.width = window.innerWidth * dpr;
    this.canvas.height = window.innerHeight * dpr;
  }

  // Helper function to append more bodies to the system
  createBody(options = {}) {
    this.bodies.push(new Body(options))
  }

  // Call this to begin the simulation
  start() {
    if (this.started === false) {
      this.started === true;
      this.draw();
    };
  }

  draw() {
    window.requestAnimationFrame(() => {
      // Apply our gravity equation
      this.gravity();

      // Clear the canvas
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Update the bodies and draw them to the canvas
      this.bodies.forEach((body) => {
        body.update(1);
        body.draw(this.ctx);
      });

      // Draw the canvas
      this.draw();
    });
  }

  gravity() {
    // Double loop to relate all bodies to one another
    for (var i = 0; i < this.bodies.length; i++) {
      for (var j = 0; j < this.bodies.length; j++) {
        // Skip this function if the bodies is trying to relate to itself
        if (i == j) continue;

        // Our two relevant bodies
        this.b1 = this.bodies[i];
        this.b2 = this.bodies[j];

        // Calculate the distance between our bodies
        this.distance = Math.sqrt(
          (this.b1.x - this.b2.x) * (this.b1.x - this.b2.x) +
          (this.b1.y - this.b2.y) * (this.b1.y - this.b2.y)
        );

        // Set a minimum distance
        this.distance = (this.distance < this.b1.boundary + this.b2.boundary) ? this.b1.boundary + this.b2.boundary : this.distance;

        // Gravity equation
        this.force = this.G * (this.b1.m * this.b2.m) / this.distance / this.distance;

        // Helpful readability variables
        this.nx = (this.b2.x - this.b1.x) / this.distance;
        this.ny = (this.b2.y - this.b1.y) / this.distance;

        // Move the bodies unless they are immobile
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
}

class Body {
  constructor(options = {}) {
    this.settings = objectAssign({
      x: 0,
      y: 0,
      v: 0,
      color: '#000000',
      angle: 0,
      mass: 1,
      radius: 5,
      boundary: null,
      mobile: true,
      trail: 0,
    }, options);

    this.trail = [];

    this.init();
  }

  init() {
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
    this.boundary = (this.settings.boundary == null) ? this.settings.radius : this.settings.boundary;
  }

  update(dt) {
    if (this.settings.trail >= 1) {
      if (this.trail.length >= this.settings.trail) this.trail.shift();
      this.trail.push({
        x: this.x,
        y: this.y,
      });
    }

    this.vx += this.ax * dt;
    this.vy += this.ay * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;

    this.ax = 0;
    this.ay = 0;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.arc(this.x,this.y,this.r,0,6.28);
    ctx.fillStyle = this.settings.color;
    ctx.fill();
    ctx.closePath();

    if (this.settings.trail !== 0) {
      for (var index = this.trail.length - 1; index > 0; index--) {
        let point = this.trail[index];
        
        this.nextPoint = this.trail[index + 1] || this;
        ctx.beginPath();
        ctx.moveTo(point.x,point.y);
        ctx.lineTo(this.nextPoint.x, this.nextPoint.y);
        ctx.strokeStyle = this.settings.color;
        ctx.globalAlpha = index / this.trail.length;
        ctx.lineWidth = this.r * 2;
        ctx.stroke();
        ctx.closePath();
      }
    }
  }
}
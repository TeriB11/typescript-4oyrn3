export class Vec2 {
  constructor(public readonly x: number, public readonly y: number) {}

  static readonly zero = new Vec2(0, 0);

  add(other: Vec2) {
    return new Vec2(this.x + other.x, this.y + other.y);
  }

  sub(other: Vec2) {
    return new Vec2(this.x - other.x, this.y - other.y);
  }

  componentMul(other: Vec2) {
    return new Vec2(this.x * other.x, this.y * other.y);
  }

  componentDiv(other: Vec2) {
    return new Vec2(
      other.x === 0 ? 0 : this.x / other.x,
      other.y === 0 ? 0 : this.y / other.y
    );
  }

  dot(other: Vec2) {
    return this.x * other.x + this.y * other.y;
  }

  magnitudeSquared() {
    return this.dot(this);
  }

  magnitude() {
    return Math.sqrt(this.magnitudeSquared());
  }

  scale(scalar: number) {
    return new Vec2(this.x * scalar, this.y * scalar);
  }

  divScale(scalar: number) {
    return scalar === 0 ? Vec2.zero : this.scale(1 / scalar);
  }

  normalized() {
    return this.divScale(this.magnitude());
  }

  polarAngleRad() {
    return Math.atan2(this.y, this.x);
  }

  static polar(angleRad: number, radius: number = 1) {
    return new Vec2(radius * Math.cos(angleRad), radius * Math.sin(angleRad));
  }

  distanceSquared(other: Vec2) {
    return this.sub(other).magnitudeSquared();
  }

  distance(other: Vec2) {
    return Math.sqrt(this.distanceSquared(other));
  }
}

export class Color {
  constructor(
    public readonly r: number,
    public readonly g: number,
    public readonly b: number
  ) {}

  static readonly white = Color.grey(1);
  static readonly black = Color.grey(0);

  static grey(value: number = 0.5) {
    return new Color(value, value, value);
  }

  static fromHexString(hexString: string) {
    // https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb

    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    const hex = hexString.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
      ? new Color(
          parseInt(result[1], 16) / 255,
          parseInt(result[2], 16) / 255,
          parseInt(result[3], 16) / 255
        )
      : Color.black;
  }

  add(other: Color) {
    return new Color(this.r + other.r, this.g + other.g, this.b + other.b);
  }

  sub(other: Color) {
    return new Color(this.r - other.r, this.g - other.g, this.b - other.b);
  }

  scale(scalar: number) {
    return new Color(this.r * scalar, this.g * scalar, this.b * scalar);
  }

  clamp(min: number = 0, max: number = 1) {
    function c(x: number) {
      return Math.max(min, Math.min(max, x));
    }

    return new Color(c(this.r), c(this.g), c(this.b));
  }

  dot(other: Color) {
    return this.r * other.r + this.g * other.g + this.b * other.b;
  }

  private static readonly greyscaleWeights = new Color(0.299, 0.587, 0.114);

  lerp(other: Color, factor: number) {
    return this.add(other.sub(this).scale(factor));
  }

  greyscaleValue() {
    return this.dot(Color.greyscaleWeights);
  }

  greyscale() {
    return Color.grey(this.greyscaleValue());
  }

  scaleDiv(scalar: number) {
    return scalar === 0
      ? Color.black
      : new Color(this.r / scalar, this.g / scalar, this.b / scalar);
  }

  private _hexString: string | undefined = undefined;
  hexString(): string {
    if (!this._hexString) {
      function h(n: number) {
        const s = Math.max(Math.min(Math.floor(n * 255), 255), 0).toString(16);
        return s.length === 1 ? '0' + s : s;
      }

      this._hexString = `#${h(this.r)}${h(this.g)}${h(this.b)}`;
    }
    return this._hexString!;
  }

  toHSV(): { hue: number; saturation: number; value: number } {
    const max = Math.max(this.r, this.g, this.b);
    const min = Math.min(this.r, this.g, this.b);
    const delta = max - min;

    const { r, g, b } = this;

    const hue =
      delta === 0
        ? 0
        : max === r
        ? (((g - b) / delta) % 6) / 6
        : max === g
        ? ((b - r) / delta + 2) / 6
        : ((r - g) / delta + 4) / 6;

    const saturation = max === 0 ? 0 : delta / max;
    const value = delta;

    return { hue, saturation, value };
  }

  static fromHSV(hue: number, saturation: number, value: number) {
    const h = hue * 6;
    const c = value * saturation;
    const x = c * (1 - Math.abs((h % 2) - 1));
    const m = value - c;

    const [r, g, b] =
      h < 1
        ? [c, x, 0]
        : h < 2
        ? [x, c, 0]
        : h < 3
        ? [0, c, x]
        : h < 4
        ? [0, x, c]
        : h < 5
        ? [x, 0, c]
        : [c, 0, x];

    return new Color(r + m, g + m, b + m);
  }
}

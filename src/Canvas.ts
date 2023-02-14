import { Color } from './Color';
import { Vec2 } from './Vec2';

export class Canvas {
  private readonly canvas: HTMLCanvasElement;
  private readonly context: CanvasRenderingContext2D;

  constructor(
    public readonly width: number,
    public readonly height: number,
    containerElement: HTMLElement = document.getElementById('app')!
  ) {
    const canvas: HTMLCanvasElement = document.createElement(
      'canvas'
    ) as HTMLCanvasElement;
    this.canvas = canvas;

    containerElement.appendChild(canvas);

    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';

    canvas.width = width * window.devicePixelRatio;
    canvas.height = height * window.devicePixelRatio;

    this.context = canvas.getContext('2d')!;
    this.context.scale(window.devicePixelRatio, window.devicePixelRatio);
  }

  get midpoint(): Vec2 {
    return new Vec2(this.width / 2, this.height / 2);
  }

  get inscribedRadius(): number {
    return Math.min(this.width, this.height) / 2;
  }

  get curcumscribedRadius(): number {
    const x = this.width / 2;
    const y = this.height / 2;
    return Math.sqrt(x * x + y * y);
  }

  setClickHandler(onClick: (pos: Vec2) => void) {
    this.canvas.onclick = (evt) => {
      const { x, y } = this.canvas.getBoundingClientRect();
      const pos = new Vec2(evt.clientX - x, evt.clientY - y);
      onClick(pos);
    };
  }

  clear(color: Color) {
    this.context.fillStyle = color.hexString();
    this.context.fillRect(0, 0, this.width, this.height);
  }

  drawCircle(
    origin: Vec2,
    radius: number,
    color: Color,
    mode: 'fill' | 'stroke' = 'fill'
  ) {
    this.context.beginPath();
    this.context.ellipse(origin.x, origin.y, radius, radius, 0, 0, Math.PI * 2);

    if (mode === 'fill') {
      this.context.fillStyle = color.hexString();
      this.context.fill();
    } else {
      this.context.strokeStyle = color.hexString();
      this.context.stroke();
    }
  }

  drawPoint(pt: Vec2, color: Color) {
    this.context.fillStyle = color.hexString();
    this.context.fillRect(pt.x, pt.y, 1, 1);
  }

  drawRect(
    pt: Vec2,
    width: number,
    height: number,
    color: Color,
    position: 'centered' | 'origin' = 'origin'
  ) {
    this.context.fillStyle = color.hexString();
    if (position === 'centered') {
      this.context.fillRect(pt.x - width / 2, pt.y - height / 2, width, height);
    } else {
      this.context.fillRect(pt.x, pt.y, width, height);
    }
  }

  drawText(
    text: string,
    color: Color = Color.black,
    position: Vec2 = this.midpoint,
    fontSize: number = 24,
    anchor:
      | 'topLeft'
      | 'baselineLeft'
      | 'topRight'
      | 'baselineRight'
      | 'center' = 'topLeft',
    opacity: number = 1
  ) {
    this.context.save();
    this.context.fillStyle = color.hexString();
    this.context.font = fontSize + 'px Arial';

    let p = position;
    if (anchor !== 'baselineLeft') {
      const { width, fontBoundingBoxAscent, fontBoundingBoxDescent } =
        this.context.measureText(text);
      const height = fontBoundingBoxAscent + fontBoundingBoxDescent;

      if (anchor === 'center') {
        p = p.add(new Vec2(-width / 2, -height / 2 + fontBoundingBoxAscent));
      } else if (anchor === 'topLeft') {
        p = p.add(new Vec2(0, fontBoundingBoxAscent));
      } else if (anchor === 'topRight') {
        p = p.add(new Vec2(-width, fontBoundingBoxAscent));
      } else if (anchor === 'baselineRight') {
        p = p.add(new Vec2(-width, 0));
      }
    }

    this.context.globalAlpha = opacity;
    this.context.fillText(text, p.x, p.y);
    this.context.restore();
  }
}

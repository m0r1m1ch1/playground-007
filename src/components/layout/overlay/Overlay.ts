import { gsap } from 'gsap';
import { swup } from '@/utils/swup';

interface Bar {
  x: number;
  y: number;
  scaleX: number;
  width: number;
  height: number;
  color: string;
  isScalingDown?: boolean; // 縮小中フラグ
}

export class Overlay {
  canvas = document.querySelector<HTMLCanvasElement>('canvas[data-overlay-canvas]');
  ctx = this.canvas?.getContext('2d');
  bars: Bar[] = [];
  barCount = 13;
  barWidth = 0;
  barHeight = 0;

  constructor() {
    this.init();
  }

  init = () => {
    if (!this.canvas) return;

    this.setupCanvas();
    this.handleResize();
    // this.setUpBars();
    // this.drawBars();

    this.setUpBars();
    // this.startAnimateBars();
  };

  setupCanvas = () => {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  };

  getOptimalBarWidth = (): number => {
    const width = window.innerWidth;

    // 375px→30px, 1440px→100px の線形補間
    const barWidth = 30 + Math.max(0, Math.min(1, (width - 375) / (1440 - 375))) * 20;

    return Math.round(barWidth);
  };

  getOptimalBarCount = (): number => {
    const width = window.innerWidth;
    const barWidth = this.getOptimalBarWidth(); // 動的なバー幅を取得

    const barCount = Math.round(width / barWidth);

    // 最小・最大制限
    return Math.max(5, Math.min(80, barCount));
  };

  setUpBars = () => {
    if (!this.canvas || !this.ctx) return;

    this.barCount = this.getOptimalBarCount(); // 動的に計算
    console.log(this.barCount);
    const barWidth = window.innerWidth / this.barCount;
    const barHeight = window.innerHeight;

    this.bars = [];
    for (let i = 0; i < this.barCount; i++) {
      this.bars.push({
        x: i * barWidth,
        y: 0,
        width: barWidth + 2,
        height: barHeight,
        scaleX: 0,
        color: '#000080',
        // color: `hsla(${(i * 360) / this.barCount}, 70%, 60%, 1.0)`,
        // color: `hsla(${(i * 360) / this.barCount}, 70%, 60%, 1.0)`,
        isScalingDown: false,
      });
    }
  };

  drawBars = () => {
    if (!this.canvas || !this.ctx) return;

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.bars.forEach((bar) => {
      if (!this.ctx) return;

      this.ctx.save();

      this.ctx.fillStyle = bar.color;

      if (bar.isScalingDown) {
        // 消える時：右端を基点に左向きに縮小
        this.ctx.translate(bar.x + bar.width, bar.y);
        this.ctx.scale(bar.scaleX, 1);
        this.ctx.fillRect(-bar.width, 0, bar.width, bar.height);
      } else {
        // 表示する時：左端を基点に右向きに拡大
        this.ctx.translate(bar.x, bar.y);
        this.ctx.scale(bar.scaleX, 1);
        this.ctx.fillRect(0, 0, bar.width, bar.height);
      }

      this.ctx.restore();
    });
  };

  startAnimateBars = () => {
    gsap.to(this.bars, {
      scaleX: 1,
      duration: 0.8,
      stagger: 0.01,
      ease: 'power2.out',
      onUpdate: () => {
        this.drawBars(); // 1つのonUpdateで全体を管理
      },
    });
  };

  endAnimateBars = () => {
    // 消える前に縮小フラグを設定
    this.bars.forEach((bar) => {
      bar.isScalingDown = true;
    });

    gsap.to(this.bars, {
      scaleX: 0,
      duration: 0.8,
      stagger: 0.01,
      ease: 'power2.out',
      onUpdate: () => {
        this.drawBars();
      },
      onComplete: () => {
        // アニメーション完了後にフラグをリセット
        this.bars.forEach((bar) => {
          bar.isScalingDown = false;
        });
      },
    });
  };

  handleResize = () => {
    window.addEventListener('resize', () => {
      this.setupCanvas();
      this.setUpBars();
      // this.drawBars(); // リサイズ時も描画を追加
    });
  };
}

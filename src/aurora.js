/**
 * Studio Monochrome Aurora Engine
 * Slow, subtle grayscale ambient mesh inspired directly by Skills UI Studio.
 * Near-black canvas with ethereal silver/charcoal motion.
 */

export async function initAurora() {
  const container = document.getElementById('aurora-stage');
  if (!container) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let loadedShaderMount = false;
  try {
    const { ShaderMount, meshGradientFragmentShader, getShaderColorFromString } =
      await import('https://esm.sh/@paper-design/shaders@latest');

    const fieldEl = document.getElementById('aurora-field');
    const sheenEl = document.getElementById('aurora-sheen');

    if (fieldEl && sheenEl) {
      // Exact monochrome palette from Studio preview
      const field = ['#050507', '#4a4a54', '#1e1e24', '#383842', '#0d0d10'];
      const sheen = ['#000000', '#5c5c68', '#26262c'];

      const sizing = {
        u_fit: 2,
        u_scale: 1,
        u_rotation: 0,
        u_offsetX: 0,
        u_offsetY: 0,
        u_originX: 0.5,
        u_originY: 0.5,
        u_worldWidth: 0,
        u_worldHeight: 0
      };

      new ShaderMount(
        fieldEl,
        meshGradientFragmentShader,
        {
          u_colors: field.map(getShaderColorFromString),
          u_colorsCount: field.length,
          u_distortion: 0.85,
          u_swirl: 0.18,
          u_grainMixer: 0,
          u_grainOverlay: 0,
          ...sizing
        },
        undefined,
        reduceMotion ? 0 : 0.22,
        0
      );

      new ShaderMount(
        sheenEl,
        meshGradientFragmentShader,
        {
          u_colors: sheen.map(getShaderColorFromString),
          u_colorsCount: sheen.length,
          u_distortion: 1.0,
          u_swirl: 0.5,
          u_grainMixer: 0,
          u_grainOverlay: 0,
          ...sizing
        },
        undefined,
        reduceMotion ? 0 : 0.16,
        0
      );

      loadedShaderMount = true;
    }
  } catch (err) {
    console.info('[aurora] ShaderMount remote load skipped/fallback:', err.message);
  }

  if (!loadedShaderMount) {
    initCanvasAuroraGrayscaleFallback(container, reduceMotion);
  }
}

function initCanvasAuroraGrayscaleFallback(container, reduceMotion) {
  const canvas = document.createElement('canvas');
  canvas.id = 'aurora-canvas-fallback';
  container.appendChild(canvas);
  const ctx = canvas.getContext('2d');

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  let time = 0;
  const speed = reduceMotion ? 0 : 0.00045;

  function render() {
    time += speed;

    ctx.fillStyle = '#050507';
    ctx.fillRect(0, 0, width, height);

    // Subtle monochrome wave blobs
    const blobs = [
      {
        x: width * 0.45 + Math.sin(time * 1.1) * (width * 0.2),
        y: height * 0.35 + Math.cos(time * 0.9) * (height * 0.18),
        radius: Math.max(width, height) * 0.65,
        color1: 'rgba(92, 92, 104, 0.18)',
        color2: 'rgba(5, 5, 7, 0)'
      },
      {
        x: width * 0.62 + Math.cos(time * 1.3) * (width * 0.25),
        y: height * 0.58 + Math.sin(time * 1.0) * (height * 0.2),
        radius: Math.max(width, height) * 0.72,
        color1: 'rgba(64, 64, 76, 0.16)',
        color2: 'rgba(5, 5, 7, 0)'
      },
      {
        x: width * 0.3 + Math.sin(time * 0.7) * (width * 0.18),
        y: height * 0.72 + Math.cos(time * 1.2) * (height * 0.18),
        radius: Math.max(width, height) * 0.55,
        color1: 'rgba(75, 75, 88, 0.14)',
        color2: 'rgba(5, 5, 7, 0)'
      }
    ];

    blobs.forEach((blob) => {
      const grad = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.radius);
      grad.addColorStop(0, blob.color1);
      grad.addColorStop(1, blob.color2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    });

    if (!reduceMotion) {
      requestAnimationFrame(render);
    }
  }

  render();
}

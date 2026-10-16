/**
 * Aurora Background Shader Engine
 * Emulates the Studio design system aurora:
 * Near-black canvas with a slow, organic mesh gradient swirling subtly in the background.
 */

export async function initAurora() {
  const container = document.getElementById('aurora-stage');
  if (!container) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Attempt to load @paper-design/shaders if online
  let loadedShaderMount = false;
  try {
    const { ShaderMount, meshGradientFragmentShader, getShaderColorFromString } =
      await import('https://esm.sh/@paper-design/shaders@latest');

    const fieldEl = document.getElementById('aurora-field');
    const sheenEl = document.getElementById('aurora-sheen');

    if (fieldEl && sheenEl) {
      // Subtle palette: Near-black with deep cosmic indigo, emerald teal & violet undertones
      const field = ['#030305', '#161d2f', '#0d1822', '#221933', '#0a0d14'];
      const sheen = ['#000000', '#1a3344', '#32254d'];

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
        reduceMotion ? 0 : 0.25,
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
        reduceMotion ? 0 : 0.18,
        0
      );

      loadedShaderMount = true;
    }
  } catch (err) {
    console.info('[aurora] ShaderMount remote load skipped/fallback:', err.message);
  }

  // High-performance canvas fallback if shader library is unavailable or offline
  if (!loadedShaderMount) {
    initCanvasAuroraFallback(container, reduceMotion);
  }
}

function initCanvasAuroraFallback(container, reduceMotion) {
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

  // Aurora wave points
  let time = 0;
  const speed = reduceMotion ? 0 : 0.0006;

  function render() {
    time += speed;

    // Clear with near black
    ctx.fillStyle = '#020204';
    ctx.fillRect(0, 0, width, height);

    // Dynamic gradient blobs
    const blobs = [
      {
        x: width * 0.45 + Math.sin(time * 1.2) * (width * 0.25),
        y: height * 0.35 + Math.cos(time * 0.9) * (height * 0.2),
        radius: Math.max(width, height) * 0.65,
        color1: 'rgba(28, 48, 68, 0.45)', // subtle deep cyan/teal
        color2: 'rgba(2, 2, 4, 0)'
      },
      {
        x: width * 0.65 + Math.cos(time * 1.5) * (width * 0.3),
        y: height * 0.6 + Math.sin(time * 1.1) * (height * 0.25),
        radius: Math.max(width, height) * 0.75,
        color1: 'rgba(46, 32, 74, 0.4)', // subtle deep violet
        color2: 'rgba(2, 2, 4, 0)'
      },
      {
        x: width * 0.3 + Math.sin(time * 0.8) * (width * 0.2),
        y: height * 0.75 + Math.cos(time * 1.3) * (height * 0.2),
        radius: Math.max(width, height) * 0.55,
        color1: 'rgba(20, 36, 48, 0.35)', // subtle deep ocean
        color2: 'rgba(2, 2, 4, 0)'
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

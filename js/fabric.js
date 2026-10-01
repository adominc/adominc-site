/* The hero fabric: a sheet of small metallic tiles that folds and drifts slowly. Plain WebGL, no
   libraries. The sheet's shape, its motion and its lighting are all computed in the vertex shader;
   every tile is flat-shaded from the sheet's normal at its centre. The page works without this
   file: the CSS fallback stays in place until the first frame is drawn, and whenever WebGL is
   missing or its context is lost. Reduced motion gets one still frame. */
(function () {
  'use strict';

  var canvas = document.querySelector('.hero-art canvas');
  if (!canvas) return;
  var art = canvas.parentElement;
  var hero = canvas.closest('section');

  var COLS = 150;
  var ROWS = 110;
  var FOV = (38 * Math.PI) / 180;

  var VERT = [
    'attribute vec4 aTile;', // xy: tile centre on the sheet, -0.5..0.5; zw: this corner, -0.5..0.5
    'uniform mat4 uProj;',
    'uniform mat4 uView;',
    'uniform float uTime;',
    'uniform vec2 uStep;', // one tile, in sheet units
    'uniform vec3 uPointer;', // xy: pointer in clip space, z: strength 0..1
    'uniform float uAspect;',
    'uniform vec3 uKey;', // key light, view space
    'varying vec4 vColor;',

    'vec3 sheet(vec2 s) {',
    '  float x = s.x * 7.4;',
    '  float y = s.y * 5.4;',
    '  float w = (x - 0.2) / 1.7;',
    '  float waist = 0.40 + 0.60 * (1.0 - exp(-w * w));',
    '  float z = 0.45 * sin(2.0 * y + 0.6 * x + uTime * 0.25)',
    '          + 0.20 * sin(3.4 * y - 0.3 * x - uTime * 0.18)',
    '          + 0.33 * sin(0.8 * x + uTime * 0.10);',
    '  return vec3(x, y * waist + 0.26 * sin(0.85 * x + uTime * 0.07), z);',
    '}',

    'void main() {',
    '  vec2 c = aTile.xy;',
    '  vec3 p0 = sheet(c);',
    '  vec3 n = normalize(cross(sheet(c + vec2(0.002, 0.0)) - p0, sheet(c + vec2(0.0, 0.002)) - p0));',
    '  vec4 centre = uView * vec4(p0, 1.0);',
    '  vec4 clip = uProj * centre;',

    // Under the pointer the tiles grow until they close into a continuous surface.
    '  vec2 d = (clip.xy / clip.w - uPointer.xy) * vec2(uAspect, 1.0);',
    '  float near = (1.0 - smoothstep(0.06, 0.52, length(d))) * uPointer.z;',
    '  float size = mix(0.64, 1.02, near * near);',

    '  vec3 N = normalize(mat3(uView) * n);',
    '  vec3 V = normalize(-centre.xyz);',
    '  if (dot(N, V) < 0.0) N = -N;',
    '  vec3 R = reflect(-V, N);',

    // A studio the metal can mirror: a soft box overhead, a strip to the left, a dim room.
    '  float top = smoothstep(0.10, 0.92, R.y);',
    '  float strip = smoothstep(0.50, 0.98, dot(R, normalize(vec3(-0.78, 0.22, 0.58))));',
    '  float room = 0.035 + 0.10 * smoothstep(-0.2, 1.0, -R.z);',
    '  vec3 base = vec3(0.40, 0.45, 0.50);',
    '  vec3 col = base * (room + 1.5 * top + 1.6 * strip);',

    '  vec3 L = normalize(uKey - centre.xyz);',
    '  float ndl = max(dot(N, L), 0.0);',
    '  col += base * 0.16 * ndl;',
    '  col += vec3(1.0) * pow(max(dot(N, normalize(L + V)), 0.0), 22.0) * 2.0;',
    '  vec3 L2 = normalize(vec3(5.0, -2.0, -5.5) - centre.xyz);',
    '  col += vec3(0.47, 0.72, 0.93) * pow(max(dot(N, normalize(L2 + V)), 0.0), 9.0) * 0.42;',
    '  col *= 1.0 + 0.35 * near;',
    '  col = 1.0 - exp(-col * 1.15);',

    '  vec2 e = 0.5 - abs(c);',
    '  float fade = smoothstep(0.0, 0.20, e.x) * smoothstep(0.0, 0.22, e.y);',
    '  vColor = vec4(col * fade, fade);',
    '  gl_Position = uProj * uView * vec4(sheet(c + aTile.zw * uStep * size), 1.0);',
    '}'
  ].join('\n');

  var FRAG = 'precision mediump float;\nvarying vec4 vColor;\nvoid main() { gl_FragColor = vColor; }';

  var reduced = matchMedia('(prefers-reduced-motion: reduce)');
  var coarse = matchMedia('(pointer: coarse)');

  var gl = null;
  var uniforms = null;
  var vertexCount = 0;
  var proj = new Float32Array(16);
  var view = new Float32Array(16);
  var layout = { x: 3.0, tilt: -0.38, distance: 8.5, aspect: 1 };

  var raf = 0;
  var last = 0;
  var time = 14; // start mid-drift: the folds read best a few seconds in
  var visible = true;
  var lost = false;
  var pointer = { x: 0, y: 0, tx: 0, ty: 0, clipX: 0, clipY: 0, strength: 0, target: 0 };

  function compile(type, source) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader));
    return shader;
  }

  function init() {
    gl = canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'low-power' });
    if (!gl) return false;
    var program = gl.createProgram();
    gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
    gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program));
    gl.useProgram(program);

    var corners = [-0.5, -0.5, 0.5, -0.5, 0.5, 0.5, -0.5, -0.5, 0.5, 0.5, -0.5, 0.5];
    var data = new Float32Array(COLS * ROWS * 24);
    var i = 0;
    for (var row = 0; row < ROWS; row++) {
      for (var col = 0; col < COLS; col++) {
        for (var k = 0; k < 12; k += 2) {
          data[i++] = (col + 0.5) / COLS - 0.5;
          data[i++] = (row + 0.5) / ROWS - 0.5;
          data[i++] = corners[k];
          data[i++] = corners[k + 1];
        }
      }
    }
    vertexCount = COLS * ROWS * 6;
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    var aTile = gl.getAttribLocation(program, 'aTile');
    gl.enableVertexAttribArray(aTile);
    gl.vertexAttribPointer(aTile, 4, gl.FLOAT, false, 0, 0);

    uniforms = {};
    ['uProj', 'uView', 'uTime', 'uStep', 'uPointer', 'uAspect', 'uKey'].forEach(function (name) {
      uniforms[name] = gl.getUniformLocation(program, name);
    });
    gl.uniform2f(uniforms.uStep, 1 / COLS, 1 / ROWS);

    // Tiles are blended, never depth-tested: where the sheet folds over itself both layers show.
    gl.disable(gl.DEPTH_TEST);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);
    return true;
  }

  function resize() {
    if (!gl) return;
    var box = art.getBoundingClientRect();
    if (box.width < 1 || box.height < 1) return;
    // Cap the backing store near 1.4M pixels: the tiles do not need more.
    var ratio = Math.min(devicePixelRatio || 1, coarse.matches ? 1.25 : 1.5, Math.sqrt(1.4e6 / (box.width * box.height)));
    var width = Math.max(1, Math.floor(box.width * ratio));
    var height = Math.max(1, Math.floor(box.height * ratio));
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
    }
    gl.viewport(0, 0, width, height);

    var aspect = box.width / box.height;
    var half = Math.tan(FOV / 2);
    var narrow = hero.getBoundingClientRect().width <= 700;
    layout.aspect = aspect;
    if (narrow) {
      // Centre the sheet and pull the camera back until its lit middle spans the band.
      layout.x = 0;
      layout.tilt = -0.18;
      layout.distance = Math.max(6.2, 2.5 / (half * aspect));
    } else {
      // Sit the sheet in the right half, bleeding off the edge; follow the edge on narrower windows.
      layout.distance = 8.5;
      layout.x = Math.min(3.0, 0.52 * layout.distance * half * aspect);
      layout.tilt = -0.38;
    }

    var f = 1 / half;
    var near = 0.1;
    var far = 30;
    proj.fill(0);
    proj[0] = f / aspect;
    proj[5] = f;
    proj[10] = (far + near) / (near - far);
    proj[11] = -1;
    proj[14] = (2 * far * near) / (near - far);
    gl.uniformMatrix4fv(uniforms.uProj, false, proj);
    gl.uniform1f(uniforms.uAspect, aspect);
    wake();
  }

  // view = camera⁻¹ · translate · Rx · Ry · Rz, column-major.
  function setView(rx, ry, rz) {
    var a = Math.cos(rx), b = Math.sin(rx);
    var c = Math.cos(ry), d = Math.sin(ry);
    var e = Math.cos(rz), f = Math.sin(rz);
    view[0] = c * e;
    view[1] = a * f + b * d * e;
    view[2] = b * f - a * d * e;
    view[3] = 0;
    view[4] = -c * f;
    view[5] = a * e - b * d * f;
    view[6] = b * e + a * d * f;
    view[7] = 0;
    view[8] = d;
    view[9] = -b * c;
    view[10] = a * c;
    view[11] = 0;
    view[12] = layout.x;
    view[13] = 0.12;
    view[14] = -0.7 - layout.distance;
    view[15] = 1;
    gl.uniformMatrix4fv(uniforms.uView, false, view);
  }

  function draw(dt) {
    var ease = reduced.matches ? 1 : 1 - Math.exp(-6 * dt);
    pointer.x += (pointer.tx - pointer.x) * ease;
    pointer.y += (pointer.ty - pointer.y) * ease;
    pointer.strength += (pointer.target - pointer.strength) * ease;

    setView(0.25 + 0.04 * pointer.y, -0.43 + 0.055 * pointer.x + 0.025 * Math.sin(0.25 * time), layout.tilt);
    gl.uniform1f(uniforms.uTime, time);
    gl.uniform3f(uniforms.uPointer, pointer.clipX, pointer.clipY, pointer.strength);
    gl.uniform3f(uniforms.uKey, -2 + 0.7 * Math.sin(0.2 * time), 4, 5 - layout.distance);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    art.dataset.renderer = 'webgl';
  }

  function frame(now) {
    raf = 0;
    if (!visible || lost) return;
    var interval = coarse.matches ? 1000 / 30 : 1000 / 60;
    if (now - last >= interval - 1) {
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      draw(dt);
    }
    raf = requestAnimationFrame(frame);
  }

  function wake() {
    if (!gl || lost || !visible) return;
    if (reduced.matches) {
      cancelAnimationFrame(raf);
      raf = 0;
      draw(0);
      return;
    }
    if (!raf) {
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }
  }

  function setVisible(next) {
    visible = next;
    if (visible) wake();
    else {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  }

  var onScreen = true;
  function updateVisible() {
    setVisible(onScreen && !document.hidden);
  }

  try {
    if (!init()) return;
  } catch (error) {
    return;
  }

  hero.addEventListener(
    'pointermove',
    function (event) {
      if (coarse.matches || reduced.matches) return;
      var h = hero.getBoundingClientRect();
      pointer.tx = (event.clientX - h.left) / h.width - 0.5;
      pointer.ty = (event.clientY - h.top) / h.height - 0.5;
      var box = art.getBoundingClientRect();
      pointer.clipX = ((event.clientX - box.left) / box.width) * 2 - 1;
      pointer.clipY = 1 - ((event.clientY - box.top) / box.height) * 2;
      pointer.target = 1;
    },
    { passive: true }
  );
  hero.addEventListener('pointerleave', function () {
    pointer.tx = 0;
    pointer.ty = 0;
    pointer.target = 0;
  });

  new IntersectionObserver(function (entries) {
    onScreen = entries[0].isIntersecting;
    updateVisible();
  }).observe(hero);
  new ResizeObserver(resize).observe(art);
  document.addEventListener('visibilitychange', updateVisible);
  reduced.addEventListener('change', function () {
    pointer.tx = pointer.ty = pointer.target = 0;
    wake();
  });

  canvas.addEventListener('webglcontextlost', function (event) {
    event.preventDefault();
    lost = true;
    cancelAnimationFrame(raf);
    raf = 0;
    delete art.dataset.renderer;
  });
  canvas.addEventListener('webglcontextrestored', function () {
    try {
      lost = !init();
    } catch (error) {
      return;
    }
    resize();
  });

  resize();
})();

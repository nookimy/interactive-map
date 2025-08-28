$(function() {
  const $map = $('#map');
  const $svg = $('#svg');
  const $inner = $('#inner');

  const viewBox = $svg[0].viewBox.baseVal;
  const svgWidth = viewBox.width;
  const svgHeight = viewBox.height;

  let scale = 1;
  let translate = { x: 0, y: 0 };
  let isDragging = false;
  let start = { x: 0, y: 0 };
  let pointers = new Map();
  let lastTouchDist = null;
  let lastTouchMid = null;
  const maxScale = 5;

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function getMinScale() {
    return Math.max($map.width() / svgWidth, $map.height() / svgHeight);
  }

  function setTransition(enabled, mode = 'mouse') {
    if (!enabled || mode === 'touch') {
      $inner.css('transition', 'none');
    } else if (mode === 'mouse-drag') {
      // плавность при перетаскивании мышью
      $inner.css('transition', 'transform 0.09s ease-out');
    } else {
      // плавность при колесике и кнопках
      $inner.css('transition', 'transform 0.2s ease-out');
    }
  }


  function updateTransform() {
    const mapWidth = $map.width();
    const mapHeight = $map.height();

    const scaledWidth = svgWidth * scale;
    const scaledHeight = svgHeight * scale;

    const minX = Math.min(0, mapWidth - scaledWidth);
    const minY = Math.min(0, mapHeight - scaledHeight);

    const maxX = 0;
    const maxY = 0;

    translate.x = clamp(translate.x, minX, maxX);
    translate.y = clamp(translate.y, minY, maxY);

    $inner.css('transform', `translate(${translate.x}px, ${translate.y}px) scale(${scale})`);
  }

  function centerInitialView() {
    const mapWidth = $map.width();
    const mapHeight = $map.height();

    scale = Math.max(mapWidth / svgWidth, mapHeight / svgHeight);

    const scaledWidth = svgWidth * scale;
    const scaledHeight = svgHeight * scale;

    translate.x = (mapWidth - scaledWidth) / 2;
    translate.y = (mapHeight - scaledHeight) / 2;

    updateTransform();
  }

  function getDistance(p1, p2) {
    const dx = p2.clientX - p1.clientX;
    const dy = p2.clientY - p1.clientY;
    return Math.hypot(dx, dy);
  }

  function getMidpoint(p1, p2) {
    return {
      x: (p1.clientX + p2.clientX) / 2,
      y: (p1.clientY + p2.clientY) / 2
    };
  }

  // --- Pointer Events ---
  $svg.on('pointerdown', function(e) {
    $svg.css('touch-action', 'none');
    pointers.set(e.pointerId, e);

    if (pointers.size === 1) {
      start = { x: e.clientX - translate.x, y: e.clientY - translate.y };
      isDragging = true;
      $svg.css('cursor', 'grabbing');
    } else if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      lastTouchDist = getDistance(pts[0], pts[1]);
      lastTouchMid = getMidpoint(pts[0], pts[1]);
      setTransition(false, 'touch'); // мгновенный pinch
    }
  });

  $svg.on('pointermove', function(e) {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, e);

    if (pointers.size === 1 && isDragging) {
      const p = Array.from(pointers.values())[0];
      translate = { x: p.clientX - start.x, y: p.clientY - start.y };
      // Включаем плавность для мыши, отключаем для тача
      const mode = e.pointerType === 'mouse' ? 'mouse' : 'touch';
      setTransition(true, mode);
      updateTransform();
    } else if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      const dist = getDistance(pts[0], pts[1]);
      const mid = getMidpoint(pts[0], pts[1]);

      if (lastTouchDist && lastTouchMid) {
        const oldScale = scale;
        const scaleFactor = dist / lastTouchDist;
        scale *= scaleFactor;
        scale = Math.max(scale, getMinScale());
        scale = Math.min(scale, maxScale);

        const dx = mid.x - translate.x;
        const dy = mid.y - translate.y;

        translate.x -= dx * (scale / oldScale - 1);
        translate.y -= dy * (scale / oldScale - 1);

        setTransition(false, 'touch');
        updateTransform();
      }

      lastTouchDist = dist;
      lastTouchMid = mid;
    }
  });

  $svg.on('pointerup pointercancel', function(e) {
    pointers.delete(e.pointerId);

    if (pointers.size === 2) {
      const pts = Array.from(pointers.values());
      lastTouchDist = getDistance(pts[0], pts[1]);
      lastTouchMid = getMidpoint(pts[0], pts[1]);
    } else if (pointers.size === 1) {
      const p = Array.from(pointers.values())[0];
      start = { x: p.clientX - translate.x, y: p.clientY - translate.y };
      lastTouchDist = null;
      lastTouchMid = null;
      isDragging = true;
    } else {
      isDragging = false;
      lastTouchDist = null;
      lastTouchMid = null;
      $svg.css('cursor', 'grab');
    }
  });

  // --- Wheel Zoom ---
  $svg.on('wheel', function(e) {
    e.preventDefault();
    setTransition(true, 'mouse');

    const zoomSpeed = 0.0005;
    const oldScale = scale;
    scale += -e.originalEvent.deltaY * zoomSpeed;
    scale = Math.max(scale, getMinScale());
    scale = Math.min(scale, maxScale);

    const rect = $svg[0].getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = mouseX - translate.x;
    const dy = mouseY - translate.y;

    translate.x -= dx * (scale / oldScale - 1);
    translate.y -= dy * (scale / oldScale - 1);

    updateTransform();
  });

  // --- Кнопки управления ---
  $('#zoom-in').on('click', function() {
    const oldScale = scale;
    const zoomFactor = 1.2;
    scale *= zoomFactor;
    scale = Math.max(scale, getMinScale());
    scale = Math.min(scale, maxScale);

    const rect = $map[0].getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const svgCenterXBefore = (centerX - translate.x) / oldScale;
    const svgCenterYBefore = (centerY - translate.y) / oldScale;

    translate.x = centerX - svgCenterXBefore * scale;
    translate.y = centerY - svgCenterYBefore * scale;

    setTransition(true, 'mouse');
    updateTransform();
  });

  $('#zoom-out').on('click', function() {
    const oldScale = scale;
    const zoomFactor = 1.2;
    scale /= zoomFactor;
    scale = Math.max(scale, getMinScale());
    scale = Math.min(scale, maxScale);

    const rect = $map[0].getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const svgCenterXBefore = (centerX - translate.x) / oldScale;
    const svgCenterYBefore = (centerY - translate.y) / oldScale;

    translate.x = centerX - svgCenterXBefore * scale;
    translate.y = centerY - svgCenterYBefore * scale;

    setTransition(true, 'mouse');
    updateTransform();
  });

  $('#reset').on('click', function() {
    centerInitialView();
  });

  $(window).on('resize', centerInitialView);
  centerInitialView();
});

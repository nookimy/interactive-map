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
  let lastTouchDist = null;
  let lastTouchMid = null;

  function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  function getMinScale() {
    return Math.max(
      $map.width() / svgWidth,
      $map.height() / svgHeight
    );
  }

  function setTransition(enabled, mode = 'mouse') {
    if (!enabled) {
      $inner.css('transition', 'none');
    } else if (mode === 'touch') {
      $inner.css('transition', 'transform 0.05s linear');
    } else {
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

    scale = Math.max(
      mapWidth / svgWidth,
      mapHeight / svgHeight
    );

    const scaledWidth = svgWidth * scale;
    const scaledHeight = svgHeight * scale;

    translate.x = (mapWidth - scaledWidth) / 2;
    translate.y = (mapHeight - scaledHeight) / 2;

    updateTransform();
  }

  // Мышь
  $svg.on('mousedown', function(e) {
    isDragging = true;
    setTransition(false);
    start = { x: e.clientX - translate.x, y: e.clientY - translate.y };
    $svg.css('cursor', 'grabbing');
  });

  $(window).on('mousemove', function(e) {
    if (!isDragging) return;
    translate = {
      x: e.clientX - start.x,
      y: e.clientY - start.y
    };
    updateTransform();
  });

  $(window).on('mouseup', function() {
    isDragging = false;
    $svg.css('cursor', 'grab');
  });

  // Колесо мыши для зума
  $svg.on('wheel', function(e) {
    e.preventDefault();
    setTransition(true, 'mouse');

    const zoomSpeed = 0.0005;
    const oldScale = scale;
    scale += -e.originalEvent.deltaY * zoomSpeed;

    scale = Math.max(scale, getMinScale()); // минимум

    const rect = $svg[0].getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const dx = mouseX - translate.x;
    const dy = mouseY - translate.y;

    translate.x -= dx * (scale / oldScale - 1);
    translate.y -= dy * (scale / oldScale - 1);

    updateTransform();
  });

  // Тач
  $svg.on('touchstart', function(e) {
    setTransition(true, 'touch');
    const touches = e.originalEvent.touches;

    if (touches.length === 1) {
      isDragging = true;
      const touch = touches[0];
      start = { x: touch.clientX - translate.x, y: touch.clientY - translate.y };
    } else if (touches.length === 2) {
      lastTouchDist = getDistance(touches[0], touches[1]);
      lastTouchMid = getMidpoint(touches[0], touches[1]);
    }
  });

  $svg.on('touchmove', function(e) {
    e.preventDefault();
    setTransition(true, 'touch');
    const touches = e.originalEvent.touches;

    if (touches.length === 1 && isDragging) {
      const touch = touches[0];
      translate = {
        x: touch.clientX - start.x,
        y: touch.clientY - start.y
      };
      updateTransform();
    } else if (touches.length === 2) {
      const dist = getDistance(touches[0], touches[1]);
      const mid = getMidpoint(touches[0], touches[1]);

      if (lastTouchDist && lastTouchMid) {
        const oldScale = scale;
        const scaleFactor = dist / lastTouchDist;
        scale *= scaleFactor;

        scale = Math.max(scale, getMinScale());

        const dx = mid.x - translate.x;
        const dy = mid.y - translate.y;

        translate.x -= dx * (scale / oldScale - 1);
        translate.y -= dy * (scale / oldScale - 1);

        updateTransform();
      }

      lastTouchDist = dist;
      lastTouchMid = mid;
    }
  });

  $svg.on('touchend', function(e) {
    const touches = e.originalEvent.touches;
    if (touches.length < 2) {
      lastTouchDist = null;
      lastTouchMid = null;
    }
    if (touches.length === 0) {
      isDragging = false;
    }
  });

  // Функции для расстояния и середины
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

  // --- Кнопки управления ---

  $('#zoom-in').on('click', function() {
    const oldScale = scale;
    const zoomFactor = 1.2;
    scale *= zoomFactor;
    scale = Math.max(scale, getMinScale());

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
    setTransition(true, 'mouse');
  });

  // Инициализация
  $(window).on('resize', centerInitialView);
  centerInitialView();
});

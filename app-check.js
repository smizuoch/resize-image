
    const presetGroups = {
      Instagram: [
        { id: 'instagram-post', label: '投稿', width: 1080, height: 1080 },
        { id: 'instagram-portrait', label: '縦置き', width: 1080, height: 1350 },
        { id: 'instagram-story', label: 'ストーリー', width: 1080, height: 1920 },
        { id: 'instagram-landscape', label: '横置き', width: 1080, height: 566 }
      ],
      YouTube: [
        { id: 'youtube-thumb', label: 'サムネイル', width: 1280, height: 720 },
        { id: 'youtube-shorts', label: 'Shorts', width: 1080, height: 1920 },
        { id: 'youtube-square', label: '正方形', width: 1080, height: 1080 },
        { id: 'youtube-banner', label: 'バナー', width: 2560, height: 1440 }
      ],
      VRChat: [
        { id: 'vrchat-thumbnail', label: 'サムネイル', width: 1200, height: 900 },
        { id: 'vrchat-icon', label: 'アイコン', width: 1080, height: 1080 },
        { id: 'vrchat-banner', label: 'バナー', width: 1920, height: 1080 }
      ],
      Facebook: [
        { id: 'facebook-post', label: '投稿', width: 1200, height: 630 },
        { id: 'facebook-story', label: 'ストーリー', width: 1080, height: 1920 },
        { id: 'facebook-square', label: '正方形', width: 1080, height: 1080 },
        { id: 'facebook-landscape', label: '横置き', width: 1280, height: 720 }
      ],
      LinkedIn: [
        { id: 'linkedin-post', label: '投稿', width: 1200, height: 627 },
        { id: 'linkedin-square', label: '正方形', width: 1080, height: 1080 },
        { id: 'linkedin-portrait', label: '縦置き', width: 1080, height: 1350 },
        { id: 'linkedin-landscape', label: '横置き', width: 1280, height: 720 }
      ],
      Snapchat: [
        { id: 'snap-story', label: 'ストーリー', width: 1080, height: 1920 },
        { id: 'snap-square', label: '正方形', width: 1080, height: 1080 },
        { id: 'snap-landscape', label: '横置き', width: 1280, height: 720 },
        { id: 'snap-post', label: '投稿', width: 1080, height: 1350 }
      ],
      X: [
        { id: 'x-post', label: '投稿', width: 1200, height: 670 },
        { id: 'x-landscape', label: '横置き', width: 1280, height: 720 },
        { id: 'x-portrait', label: '縦置き', width: 720, height: 1280 },
        { id: 'x-square', label: '正方形', width: 1200, height: 1200 }
      ],
      Pinterest: [
        { id: 'pin-standard', label: 'ピン', width: 1000, height: 1500 },
        { id: 'pin-square', label: '正方形', width: 1000, height: 1000 },
        { id: 'pin-landscape', label: '横置き', width: 1200, height: 675 },
        { id: 'pin-story', label: '縦置き', width: 1080, height: 1920 }
      ],
      Standard: [
        { id: 'std-landscape', label: '横置き', width: 1920, height: 1080 },
        { id: 'std-portrait', label: '縦置き', width: 1080, height: 1920 },
        { id: 'std-square', label: '正方形', width: 1080, height: 1080 },
        { id: 'std-classic', label: '4:3', width: 1600, height: 1200 }
      ],
      Custom: []
    };

    const state = {
      file: null,
      image: null,
      imageURL: '',
      fileType: 'image/png',
      originalWidth: 0,
      originalHeight: 0,
      originalSize: 0,
      selectedGroup: 'X',
      activePresetId: 'x-landscape',
      width: 1280,
      height: 720,
      locked: true,
      zoom: 1,
      baseScale: 1,
      minScale: 1,
      imageWidth: 0,
      imageHeight: 0,
      offsetX: 0,
      offsetY: 0,
      cropX: 0,
      cropY: 0,
      cropW: 0,
      cropH: 0,
      toastDismissed: false,
      estimateTimer: null,
      previewBlobUrl: ''
    };

    const elements = {
      dropzone: document.getElementById('dropzone'),
      fileInput: document.getElementById('fileInput'),
      editorLayout: document.getElementById('editorLayout'),
      cropStage: document.getElementById('cropStage'),
      cropImage: document.getElementById('cropImage'),
      cropGrid: document.getElementById('cropGrid'),
      cropOverlay: document.getElementById('cropOverlay'),
      groupSelect: document.getElementById('groupSelect'),
      presetSection: document.getElementById('presetSection'),
      presetGrid: document.getElementById('presetGrid'),
      widthInput: document.getElementById('widthInput'),
      heightInput: document.getElementById('heightInput'),
      lockButton: document.getElementById('lockButton'),
      unitSelect: document.getElementById('unitSelect'),
      originalSize: document.getElementById('originalSize'),
      outputSize: document.getElementById('outputSize'),
      resetButton: document.getElementById('resetButton'),
      downloadButton: document.getElementById('downloadButton'),
      zoomSlider: document.getElementById('zoomSlider'),
      zoomValue: document.getElementById('zoomValue'),
      statusNote: document.getElementById('statusNote'),
      dragToast: document.getElementById('dragToast'),
      dismissToast: document.getElementById('dismissToast')
    };

    function init() {
      populateGroups();
      renderPresets();
      syncDimensionInputs();
      updateLockButton();
      updateCanvasAspect();
      bindEvents();
      elements.originalSize.textContent = '--';
      elements.outputSize.textContent = '--';
      elements.statusNote.textContent = '画像を読み込むとプレビューとサイズ変更が有効になります。';
    }

    function populateGroups() {
      const labels = {
        Instagram: 'Instagram',
        YouTube: 'YouTube',
        VRChat: 'VRChat',
        Facebook: 'Facebook',
        LinkedIn: 'LinkedIn',
        Snapchat: 'Snapchat',
        X: 'X (Twitter)',
        Pinterest: 'Pinterest',
        Standard: '通常',
        Custom: 'カスタム'
      };

      elements.groupSelect.innerHTML = '';
      Object.keys(presetGroups).forEach((group) => {
        const option = document.createElement('option');
        option.value = group;
        option.textContent = labels[group] || group;
        if (group === state.selectedGroup) option.selected = true;
        elements.groupSelect.appendChild(option);
      });
    }

    function renderPresets() {
      const presets = presetGroups[state.selectedGroup] || [];
      elements.presetGrid.innerHTML = '';
      elements.presetSection.classList.toggle('hidden', presets.length === 0);

      presets.forEach((preset) => {
        const card = document.createElement('button');
        card.type = 'button';
        card.className = 'thumb-card' + (preset.id === state.activePresetId ? ' active' : '');
        card.dataset.presetId = preset.id;
        card.innerHTML = `
          <div class="thumb-preview">
            <div class="preview-box" style="aspect-ratio:${preset.width} / ${preset.height}; width:${getThumbWidth(preset.width, preset.height)}px; height:${getThumbHeight(preset.width, preset.height)}px;">
              ${state.imageURL ? `<img src="${state.imageURL}" alt="">` : ''}
            </div>
          </div>
          <span class="thumb-label">${preset.label}</span>
          <div class="thumb-size">${preset.width}x${preset.height}</div>
        `;
        card.addEventListener('click', () => applyPreset(preset.id));
        elements.presetGrid.appendChild(card);
      });
    }

    function getThumbWidth(width, height) {
      const ratio = width / height;
      if (ratio >= 1) return 54;
      return Math.max(26, Math.round(54 * ratio));
    }

    function getThumbHeight(width, height) {
      const ratio = width / height;
      if (ratio < 1) return 54;
      return Math.max(26, Math.round(54 / ratio));
    }

    function applyPreset(id) {
      const preset = (presetGroups[state.selectedGroup] || []).find((item) => item.id === id);
      if (!preset) return;
      state.activePresetId = id;
      state.width = preset.width;
      state.height = preset.height;
      syncDimensionInputs();
      updateCanvasAspect();
      renderPresets();
      fitImageToViewport(false);
      estimateOutputSize();
    }

    function bindEvents() {
      elements.dropzone.addEventListener('click', () => elements.fileInput.click());
      elements.dropzone.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          elements.fileInput.click();
        }
      });

      elements.fileInput.addEventListener('change', (event) => {
        const file = event.target.files && event.target.files[0];
        if (file) loadFile(file);
      });

      ['dragenter', 'dragover'].forEach((type) => {
        elements.dropzone.addEventListener(type, (event) => {
          event.preventDefault();
          elements.dropzone.classList.add('dragover');
        });
      });

      ['dragleave', 'drop'].forEach((type) => {
        elements.dropzone.addEventListener(type, (event) => {
          event.preventDefault();
          if (type === 'drop') {
            const file = event.dataTransfer?.files?.[0];
            if (file) loadFile(file);
          }
          elements.dropzone.classList.remove('dragover');
        });
      });

      elements.groupSelect.addEventListener('change', () => {
        state.selectedGroup = elements.groupSelect.value;
        const firstPreset = presetGroups[state.selectedGroup]?.[0];
        state.activePresetId = firstPreset ? firstPreset.id : null;
        if (firstPreset) {
          state.width = firstPreset.width;
          state.height = firstPreset.height;
        }
        syncDimensionInputs();
        updateCanvasAspect();
        renderPresets();
        fitImageToViewport(false);
        estimateOutputSize();
      });

      elements.widthInput.addEventListener('input', () => onDimensionInput('width'));
      elements.heightInput.addEventListener('input', () => onDimensionInput('height'));

      elements.lockButton.addEventListener('click', () => {
        state.locked = !state.locked;
        updateLockButton();
      });

      elements.zoomSlider.addEventListener('input', () => {
        state.zoom = clamp(parseFloat(elements.zoomSlider.value) || 1, 1, 10);
        updateZoomLabel();
        constrainOffsets();
        renderImageTransform();
        estimateOutputSize();
      });

      elements.resetButton.addEventListener('click', () => {
        if (!state.image) return;
        if (state.activePresetId) {
          applyPreset(state.activePresetId);
        }
        fitImageToViewport(true);
        elements.statusNote.textContent = '位置とズームをリセットしました。';
      });

      elements.downloadButton.addEventListener('click', async () => {
        if (!state.image) {
          elements.statusNote.textContent = '先に画像をアップロードしてください。';
          return;
        }
        const blob = await exportBlob();
        if (!blob) return;
        const ext = typeToExtension(blob.type);
        const name = (state.file?.name?.replace(/\.[^.]+$/, '') || 'resized-image') + '.' + ext;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        elements.statusNote.textContent = '画像を書き出しました。';
      });

      elements.dismissToast.addEventListener('click', () => {
        state.toastDismissed = true;
        updateToast();
      });

      setupDragging();
      setupCropBoxDragging();
      window.addEventListener('resize', () => {
        if (!state.image) return;
        const stageRect = elements.cropStage.getBoundingClientRect();
        state.cropX = clamp(state.cropX, 0, Math.max(0, stageRect.width - state.cropW));
        state.cropY = clamp(state.cropY, 0, Math.max(0, stageRect.height - state.cropH));
        updateCropBox();
        fitImageToViewport(false, true);
      });
    }

    async function loadFile(file) {
      const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
      if (!allowed.includes(file.type)) {
        elements.statusNote.textContent = '対応形式は JPEG / PNG / WEBP / HEIC です。';
        return;
      }
      if (file.size > 40 * 1024 * 1024) {
        elements.statusNote.textContent = '40 MB 以下の画像を選択してください。';
        return;
      }

      try {
        const image = await fileToImage(file);
        if (state.imageURL) URL.revokeObjectURL(state.imageURL);
        state.file = file;
        state.image = image;
        state.imageURL = URL.createObjectURL(file);
        state.fileType = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp' ? file.type : 'image/png';
        state.originalWidth = image.naturalWidth;
        state.originalHeight = image.naturalHeight;
        state.originalSize = file.size;
        state.width = image.naturalWidth;
        state.height = image.naturalHeight;
        state.selectedGroup = 'Custom';
        state.activePresetId = null;
        state.cropW = 0;
        state.cropH = 0;
        state.toastDismissed = false;
        elements.groupSelect.value = 'Custom';
        elements.cropImage.src = state.imageURL;
        elements.editorLayout.classList.add('active');
        elements.dropzone.classList.add('hidden');
        syncDimensionInputs();
        renderPresets();
        fitImageToViewport(true);
        elements.originalSize.textContent = formatBytes(file.size);
        estimateOutputSize();
        elements.statusNote.textContent = `${image.naturalWidth} × ${image.naturalHeight} の画像を読み込みました。`;
      } catch (error) {
        console.error(error);
        elements.statusNote.textContent = '画像の読み込みに失敗しました。';
      } finally {
        elements.fileInput.value = '';
      }
    }

    function fileToImage(file) {
      return new Promise((resolve, reject) => {
        const url = URL.createObjectURL(file);
        const image = new Image();
        image.onload = () => {
          URL.revokeObjectURL(url);
          resolve(image);
        };
        image.onerror = () => {
          URL.revokeObjectURL(url);
          reject(new Error('Image load failed'));
        };
        image.src = url;
      });
    }

    function onDimensionInput(kind) {
      const previousRatio = state.width / state.height;
      let nextWidth = clamp(parseInt(elements.widthInput.value || state.width, 10) || state.width, 50, 6000);
      let nextHeight = clamp(parseInt(elements.heightInput.value || state.height, 10) || state.height, 50, 6000);

      if (kind === 'width') {
        if (state.locked) nextHeight = clamp(Math.round(nextWidth / previousRatio), 50, 6000);
      } else {
        if (state.locked) nextWidth = clamp(Math.round(nextHeight * previousRatio), 50, 6000);
      }

      state.width = nextWidth;
      state.height = nextHeight;
      state.selectedGroup = 'Custom';
      state.activePresetId = null;
      elements.groupSelect.value = 'Custom';
      syncDimensionInputs();
      updateCanvasAspect();
      renderPresets();
      fitImageToViewport(false);
      estimateOutputSize();
    }

    function syncDimensionInputs() {
      elements.widthInput.value = state.width;
      elements.heightInput.value = state.height;
    }

    function updateCanvasAspect() {
      if (!state.image || !state.cropW || !state.cropH) return;
      const stageRect = elements.cropStage.getBoundingClientRect();
      if (!stageRect.width || !stageRect.height) return;
      const aspect = state.width / state.height;
      const centerX = state.cropX + state.cropW / 2;
      const centerY = state.cropY + state.cropH / 2;
      const oldArea = state.cropW * state.cropH;
      let newW = Math.sqrt(oldArea * aspect);
      let newH = newW / aspect;
      if (newW > stageRect.width) { newW = stageRect.width; newH = newW / aspect; }
      if (newH > stageRect.height) { newH = stageRect.height; newW = newH * aspect; }
      state.cropW = newW;
      state.cropH = newH;
      state.cropX = clamp(centerX - newW / 2, 0, stageRect.width - newW);
      state.cropY = clamp(centerY - newH / 2, 0, stageRect.height - newH);
      updateCropBox();
    }

    function updateLockButton() {
      elements.lockButton.setAttribute('aria-pressed', String(state.locked));
      elements.lockButton.classList.toggle('unlocked', !state.locked);
      elements.lockButton.title = state.locked ? '縦横比を固定中' : '縦横比の固定を解除中';
      elements.lockButton.innerHTML = state.locked
        ? `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 11V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><rect x="5" y="11" width="14" height="10" rx="3" stroke="currentColor" stroke-width="2" /></svg>`
        : `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 11V8C7 5.23858 9.23858 3 12 3C13.6877 3 15.1802 3.83509 16.0866 5.11459" stroke="currentColor" stroke-width="2" stroke-linecap="round" /><path d="M5 11H16C17.6569 11 19 12.3431 19 14V18C19 19.6569 17.6569 21 16 21H8C6.34315 21 5 19.6569 5 18V11Z" stroke="currentColor" stroke-width="2" /><path d="M18 4L21 7M21 4L18 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>`;
    }

    function updateZoomLabel() {
      elements.zoomSlider.value = state.zoom.toFixed(1);
      elements.zoomValue.textContent = `${state.zoom.toFixed(1).replace(/\.0$/, '')}x`;
    }

    function fitImageToViewport(resetZoom = true, _preserveView = false) {
      if (!state.image) return;

      const stageRect = elements.cropStage.getBoundingClientRect();
      const stageW = stageRect.width;
      const stageH = stageRect.height;

      if (resetZoom || !state.cropW || !state.cropH) {
        const aspect = state.width / state.height;
        let boxW, boxH;
        if (stageW / stageH > aspect) {
          boxH = stageH;
          boxW = boxH * aspect;
        } else {
          boxW = stageW;
          boxH = boxW / aspect;
        }
        state.cropX = (stageW - boxW) / 2;
        state.cropY = (stageH - boxH) / 2;
        state.cropW = boxW;
        state.cropH = boxH;
        updateCropBox();
      }

      const fitScale = Math.max(state.cropW / state.originalWidth, state.cropH / state.originalHeight);
      state.baseScale = fitScale;
      state.minScale = 1;
      state.imageWidth = state.originalWidth * fitScale;
      state.imageHeight = state.originalHeight * fitScale;

      if (resetZoom) {
        state.zoom = 1;
        elements.zoomSlider.value = '1';
        state.offsetX = 0;
        state.offsetY = 0;
      }

      updateZoomLabel();
      constrainOffsets();
      renderImageTransform();
      updateToast();
    }

    function displayWidth() {
      return state.imageWidth * state.zoom;
    }

    function displayHeight() {
      return state.imageHeight * state.zoom;
    }

    function constrainOffsets() {
      const stageRect = elements.cropStage.getBoundingClientRect();
      const stageW = stageRect.width;
      const stageH = stageRect.height;
      const dW = displayWidth();
      const dH = displayHeight();
      const minX = state.cropX + state.cropW - stageW / 2 - dW / 2;
      const maxX = state.cropX - stageW / 2 + dW / 2;
      const minY = state.cropY + state.cropH - stageH / 2 - dH / 2;
      const maxY = state.cropY - stageH / 2 + dH / 2;
      state.offsetX = clamp(state.offsetX, Math.min(minX, maxX), Math.max(minX, maxX));
      state.offsetY = clamp(state.offsetY, Math.min(minY, maxY), Math.max(minY, maxY));
    }

    function renderImageTransform() {
      if (!state.image) return;
      const width = displayWidth();
      const height = displayHeight();
      elements.cropImage.style.width = `${width}px`;
      elements.cropImage.style.height = `${height}px`;
      elements.cropImage.style.transform = `translate(calc(-50% + ${state.offsetX}px), calc(-50% + ${state.offsetY}px))`;
    }

    function updateToast() {
      const shouldShow = !!state.image && !state.toastDismissed;
      elements.dragToast.classList.toggle('hidden', !shouldShow);
    }

    function setupDragging() {
      let dragging = false;
      let startX = 0;
      let startY = 0;
      let originX = 0;
      let originY = 0;

      const onPointerMove = (event) => {
        if (!dragging) return;
        const clientX = event.clientX ?? (event.touches && event.touches[0]?.clientX);
        const clientY = event.clientY ?? (event.touches && event.touches[0]?.clientY);
        if (clientX == null || clientY == null) return;
        state.offsetX = originX + (clientX - startX);
        state.offsetY = originY + (clientY - startY);
        constrainOffsets();
        renderImageTransform();
      };

      const endDrag = () => {
        if (!dragging) return;
        dragging = false;
        elements.cropStage.classList.remove('dragging');
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerup', endDrag);
        estimateOutputSize();
      };

      elements.cropStage.addEventListener('pointerdown', (event) => {
        if (!state.image) return;
        dragging = true;
        elements.cropStage.classList.add('dragging');
        startX = event.clientX;
        startY = event.clientY;
        originX = state.offsetX;
        originY = state.offsetY;
        elements.cropStage.setPointerCapture?.(event.pointerId);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', endDrag);
      });

      elements.cropStage.addEventListener('wheel', (event) => {
        if (!state.image) return;
        event.preventDefault();
        const delta = Math.sign(event.deltaY) * -0.15;
        state.zoom = clamp(state.zoom + delta, 1, 10);
        updateZoomLabel();
        constrainOffsets();
        renderImageTransform();
        estimateOutputSize();
      }, { passive: false });
    }

    async function exportBlob() {
      if (!state.image) return null;
      const canvas = document.createElement('canvas');
      canvas.width = state.width;
      canvas.height = state.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      const stageRect = elements.cropStage.getBoundingClientRect();
      const stageW = stageRect.width;
      const stageH = stageRect.height;
      const scaleOutput = state.width / state.cropW;
      const drawWidth = displayWidth() * scaleOutput;
      const drawHeight = displayHeight() * scaleOutput;
      const imgCenterX = stageW / 2 + state.offsetX;
      const imgCenterY = stageH / 2 + state.offsetY;
      const cropCenterX = state.cropX + state.cropW / 2;
      const cropCenterY = state.cropY + state.cropH / 2;
      const centerX = state.width / 2 + (imgCenterX - cropCenterX) * scaleOutput;
      const centerY = state.height / 2 + (imgCenterY - cropCenterY) * scaleOutput;
      const dx = centerX - drawWidth / 2;
      const dy = centerY - drawHeight / 2;

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(state.image, dx, dy, drawWidth, drawHeight);

      return await new Promise((resolve) => {
        canvas.toBlob(
          (blob) => resolve(blob),
          state.fileType,
          state.fileType === 'image/jpeg' || state.fileType === 'image/webp' ? 0.92 : undefined
        );
      });
    }

    function updateCropBox() {
      const { cropX: x, cropY: y, cropW: w, cropH: h } = state;
      elements.cropGrid.style.left = `${x}px`;
      elements.cropGrid.style.top = `${y}px`;
      elements.cropGrid.style.width = `${w}px`;
      elements.cropGrid.style.height = `${h}px`;
      elements.cropOverlay.style.clipPath =
        `path('M 0 0 L 100000 0 L 100000 100000 L 0 100000 Z M ${x} ${y} L ${x} ${y + h} L ${x + w} ${y + h} L ${x + w} ${y} Z')`;
    }

    function setupCropBoxDragging() {
      const MIN = 50;

      elements.cropGrid.addEventListener('pointerdown', (e) => {
        if (!state.image) return;
        if (e.target.classList.contains('crop-handle')) return;
        e.stopPropagation();
        const stageRect = elements.cropStage.getBoundingClientRect();
        const startX = e.clientX;
        const startY = e.clientY;
        const origX = state.cropX;
        const origY = state.cropY;

        const onMove = (e) => {
          state.cropX = clamp(origX + e.clientX - startX, 0, stageRect.width - state.cropW);
          state.cropY = clamp(origY + e.clientY - startY, 0, stageRect.height - state.cropH);
          updateCropBox();
          constrainOffsets();
        };
        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          estimateOutputSize();
        };
        elements.cropGrid.setPointerCapture(e.pointerId);
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
      });

      elements.cropGrid.querySelectorAll('.crop-handle').forEach((handle) => {
        handle.addEventListener('pointerdown', (e) => {
          if (!state.image) return;
          e.stopPropagation();
          const dir = handle.dataset.handle;
          const stageRect = elements.cropStage.getBoundingClientRect();
          const startX = e.clientX;
          const startY = e.clientY;
          const origX = state.cropX;
          const origY = state.cropY;
          const origW = state.cropW;
          const origH = state.cropH;
          const scaleX = state.width / origW;
          const scaleY = state.height / origH;

          const onMove = (e) => {
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            let newX = origX, newY = origY, newW = origW, newH = origH;
            if (dir.includes('e')) newW = clamp(origW + dx, MIN, stageRect.width - origX);
            if (dir.includes('w')) { newW = clamp(origW - dx, MIN, origX + origW); newX = origX + origW - newW; }
            if (dir.includes('s')) newH = clamp(origH + dy, MIN, stageRect.height - origY);
            if (dir.includes('n')) { newH = clamp(origH - dy, MIN, origY + origH); newY = origY + origH - newH; }
            state.cropX = newX;
            state.cropY = newY;
            state.cropW = newW;
            state.cropH = newH;
            state.width = Math.max(50, Math.round(newW * scaleX));
            state.height = Math.max(50, Math.round(newH * scaleY));
            state.selectedGroup = 'Custom';
            state.activePresetId = null;
            elements.groupSelect.value = 'Custom';
            syncDimensionInputs();
            updateCropBox();
            constrainOffsets();
          };
          const onUp = () => {
            window.removeEventListener('pointermove', onMove);
            window.removeEventListener('pointerup', onUp);
            renderPresets();
            estimateOutputSize();
          };
          handle.setPointerCapture(e.pointerId);
          window.addEventListener('pointermove', onMove);
          window.addEventListener('pointerup', onUp);
        });
      });
    }

    function estimateOutputSize() {
      clearTimeout(state.estimateTimer);
      if (!state.image) {
        elements.outputSize.textContent = '--';
        return;
      }
      state.estimateTimer = setTimeout(async () => {
        const blob = await exportBlob();
        elements.outputSize.textContent = blob ? formatBytes(blob.size) : '--';
      }, 180);
    }

    function formatBytes(bytes) {
      if (!bytes || !Number.isFinite(bytes)) return '--';
      const units = ['B', 'KB', 'MB', 'GB'];
      let value = bytes;
      let unit = units[0];
      for (let i = 0; i < units.length; i++) {
        unit = units[i];
        if (value < 1024 || i === units.length - 1) break;
        value /= 1024;
      }
      return `${value.toFixed(value >= 100 || unit === 'B' ? 0 : value >= 10 ? 1 : 2)} ${unit}`;
    }

    function typeToExtension(type) {
      if (type === 'image/jpeg') return 'jpg';
      if (type === 'image/webp') return 'webp';
      return 'png';
    }

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    init();
  

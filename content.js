(() => {
  if (document.documentElement.hasAttribute('data-tadroid-content-mounted')) {
    return;
  }
  document.documentElement.setAttribute('data-tadroid-content-mounted', 'true');

  const EVENT_NAME = 'tadroid-4ll-update';
  const REQUEST_EVENT = 'tadroid-4ll-request';
  const STATUS_EVENT = 'tadroid-4ll-status';
  const APPLY_EVENT = 'tadroid-4ll-apply';
  const STORAGE_KEY_PREFIX = 'tadroid-course-progress';
  const COURSE_SOURCE_STORAGE_KEY = 'tadroid-custom-course-source';
  const QUIET_STATUS_MESSAGES = new Set([
    'Czekam na obszar roboczy Coding Canvas…',
    'Zsynchronizowano z obszarem roboczym.',
    'Zaktualizowano obszar roboczy.',
    'Waiting for Coding Canvas workspace…',
    'Synced with the workspace.',
    'Updated the workspace.',
  ]);
  const SHORTCUTS = {
    toggleLesson: [
      { metaKey: true, shiftKey: true, key: 'k', label: 'Command+Shift+K' },
      { ctrlKey: true, shiftKey: true, key: 'k', label: 'Control+Shift+K' },
      { altKey: true, shiftKey: true, key: 'k', label: 'Alt+Shift+K' },
    ],
    togglePanel: [
      { metaKey: true, shiftKey: true, key: 'o', label: 'Command+Shift+O' },
      { ctrlKey: true, shiftKey: true, key: 'o', label: 'Control+Shift+O' },
      { altKey: true, shiftKey: true, key: 'o', label: 'Alt+Shift+O' },
    ],
    toggleEditor: [
      { metaKey: true, shiftKey: true, key: 'u', label: 'Command+Shift+U' },
      { ctrlKey: true, shiftKey: true, key: 'u', label: 'Control+Shift+U' },
      { altKey: true, shiftKey: true, key: 'u', label: 'Alt+Shift+U' },
    ],
    speak: [
      { metaKey: true, shiftKey: true, key: 's', label: 'Command+Shift+S' },
      { ctrlKey: true, shiftKey: true, key: 's', label: 'Control+Shift+S' },
      { altKey: true, shiftKey: true, key: 's', label: 'Alt+Shift+S' },
    ],
    pause: [
      { metaKey: true, shiftKey: true, key: 'p', label: 'Command+Shift+P' },
      { ctrlKey: true, shiftKey: true, key: 'p', label: 'Control+Shift+P' },
      { altKey: true, shiftKey: true, key: 'p', label: 'Alt+Shift+P' },
    ],
    previousLine: [
      { metaKey: true, shiftKey: true, key: 'j', label: 'Command+Shift+J' },
      { ctrlKey: true, shiftKey: true, key: 'j', label: 'Control+Shift+J' },
      { altKey: true, shiftKey: true, key: 'j', label: 'Alt+Shift+J' },
    ],
    'previous-line': [
      { metaKey: true, shiftKey: true, key: 'j', label: 'Command+Shift+J' },
      { ctrlKey: true, shiftKey: true, key: 'j', label: 'Control+Shift+J' },
      { altKey: true, shiftKey: true, key: 'j', label: 'Alt+Shift+J' },
    ],
    skip: [
      { metaKey: true, shiftKey: true, key: 'l', label: 'Command+Shift+L' },
      { ctrlKey: true, shiftKey: true, key: 'l', label: 'Control+Shift+L' },
      { altKey: true, shiftKey: true, key: 'l', label: 'Alt+Shift+L' },
    ],
    stop: [
      { metaKey: true, shiftKey: true, key: 'x', label: 'Command+Shift+X' },
      { ctrlKey: true, shiftKey: true, key: 'x', label: 'Control+Shift+X' },
      { altKey: true, shiftKey: true, key: 'x', label: 'Alt+Shift+X' },
    ],
    refresh: [
      { metaKey: true, shiftKey: true, key: 'r', label: 'Command+Shift+R' },
      { ctrlKey: true, shiftKey: true, key: 'r', label: 'Control+Shift+R' },
      { altKey: true, shiftKey: true, key: 'r', label: 'Alt+Shift+R' },
    ],
    up: [
      { metaKey: true, shiftKey: true, key: 'ArrowUp', label: 'Command+Shift+Up Arrow' },
      { ctrlKey: true, shiftKey: true, key: 'ArrowUp', label: 'Control+Shift+Up Arrow' },
      { altKey: true, shiftKey: true, key: 'ArrowUp', label: 'Alt+Shift+Up Arrow' },
    ],
    down: [
      { metaKey: true, shiftKey: true, key: 'ArrowDown', label: 'Command+Shift+Down Arrow' },
      { ctrlKey: true, shiftKey: true, key: 'ArrowDown', label: 'Control+Shift+Down Arrow' },
      { altKey: true, shiftKey: true, key: 'ArrowDown', label: 'Alt+Shift+Down Arrow' },
    ],
    end: [
      { metaKey: true, shiftKey: true, key: 'End', label: 'Command+Shift+End' },
      { ctrlKey: true, shiftKey: true, key: 'End', label: 'Control+Shift+End' },
      { altKey: true, shiftKey: true, key: 'End', label: 'Alt+Shift+End' },
    ],
    delete: [
      { metaKey: true, shiftKey: true, key: 'Backspace', label: 'Command+Shift+Backspace' },
      { ctrlKey: true, shiftKey: true, key: 'Backspace', label: 'Control+Shift+Backspace' },
      { altKey: true, shiftKey: true, key: 'Backspace', label: 'Alt+Shift+Backspace' },
    ],
    deleteAll: [
      { metaKey: true, shiftKey: true, key: 'd', label: 'Command+Shift+D' },
      { ctrlKey: true, shiftKey: true, key: 'd', label: 'Control+Shift+D' },
      { altKey: true, shiftKey: true, key: 'd', label: 'Alt+Shift+D' },
    ],
    insert: [
      { metaKey: true, shiftKey: true, key: 'i', label: 'Command+Shift+I' },
      { ctrlKey: true, shiftKey: true, key: 'i', label: 'Control+Shift+I' },
      { altKey: true, shiftKey: true, key: 'i', label: 'Alt+Shift+I' },
    ],
    insertSample: [
      { metaKey: true, shiftKey: true, key: 'Enter', label: 'Command+Shift+Enter' },
      { ctrlKey: true, shiftKey: true, key: 'Enter', label: 'Control+Shift+Enter' },
      { altKey: true, shiftKey: true, key: 'Enter', label: 'Alt+Shift+Enter' },
      { shiftKey: true, key: 'Enter', label: 'Shift+Enter' },
    ],
    previousStep: [
      { metaKey: true, shiftKey: true, key: 'ArrowLeft', label: 'Command+Shift+Left Arrow' },
      { ctrlKey: true, shiftKey: true, key: 'ArrowLeft', label: 'Control+Shift+Left Arrow' },
      { altKey: true, shiftKey: true, key: 'ArrowLeft', label: 'Alt+Shift+Left Arrow' },
      { shiftKey: true, key: 'ArrowLeft', label: 'Shift+Left Arrow' },
    ],
    nextStep: [
      { metaKey: true, shiftKey: true, key: 'ArrowRight', label: 'Command+Shift+Right Arrow' },
      { ctrlKey: true, shiftKey: true, key: 'ArrowRight', label: 'Control+Shift+Right Arrow' },
      { altKey: true, shiftKey: true, key: 'ArrowRight', label: 'Alt+Shift+Right Arrow' },
      { shiftKey: true, key: 'ArrowRight', label: 'Shift+Right Arrow' },
    ],
    viewParts: [
      { metaKey: true, shiftKey: true, key: 'y', label: 'Command+Shift+Y' },
      { ctrlKey: true, shiftKey: true, key: 'y', label: 'Control+Shift+Y' },
      { altKey: true, shiftKey: true, key: 'y', label: 'Alt+Shift+Y' },
    ],
    uploadCourse: [
      { metaKey: true, shiftKey: true, key: 'b', label: 'Command+Shift+B' },
      { ctrlKey: true, shiftKey: true, key: 'b', label: 'Control+Shift+B' },
      { altKey: true, shiftKey: true, key: 'b', label: 'Alt+Shift+B' },
    ],
    close: [{ key: 'Escape', label: 'Escape' }],
  };

  const state = {
    project: null,
    ast: null,
    text: '',
    lines: [],
    speech: {
      active: false,
      paused: false,
      index: 0,
      timeoutId: null,
      rate: 1,
      voice: null,
      skipPending: false,
      skipToIndex: null,
    },
    editor: {
      insertionPoints: [],
      insertionIndex: -1,
      announceTimeoutId: null,
      deleteDialogReturnFocus: null,
    },
    lesson: {
      course: null,
      flatSteps: [],
      currentStepIndex: 0,
      isOpen: false,
      outlineOpen: false,
      progressKey: '',
      storageMode: chrome?.storage?.local ? 'browser' : 'memory',
      memoryStepIndex: 0,
      announceTimeoutId: null,
      errorText: '',
      lastInsertSignature: '',
      lastInsertAt: 0,
      partsDialogReturnFocus: null,
      modulePartsDialogReturnFocus: null,
      courseUploadDialogReturnFocus: null,
      pendingCourseUpload: null,
    },
  };

  const host = document.createElement('div');
  host.className = 'tadroid-root';
  const shadow = host.attachShadow({ mode: 'open' });
  const styleLink = document.createElement('link');
  styleLink.rel = 'stylesheet';
  styleLink.href = chrome.runtime.getURL('panel.css');
  shadow.appendChild(styleLink);

  const lessonToggle = document.createElement('button');
  lessonToggle.className = 'tadroid-toggle tadroid-toggle-left';
  lessonToggle.type = 'button';
  lessonToggle.textContent = 'Otwórz panel kursu';
  shadow.appendChild(lessonToggle);

  const lessonPanel = document.createElement('section');
  lessonPanel.className = 'tadroid-panel tadroid-panel-left tadroid-hidden';
  lessonPanel.setAttribute('tabindex', '-1');
  lessonPanel.setAttribute('aria-label', 'Lekcje TADroid');
  lessonPanel.innerHTML = `
    <div class="tadroid-header tadroid-lesson-header">
      <div class="tadroid-lesson-header-copy">
        <p class="tadroid-lesson-course" data-lesson-course>Lekcje TADroid</p>
        <p class="tadroid-title" data-lesson-module>Wczytywanie kursu…</p>
        <p class="tadroid-subtitle" data-lesson-lesson>Wczytywanie lekcji…</p>
      </div>
      <button class="tadroid-btn" type="button" data-course-upload-button>Wgraj kurs</button>
      <input type="file" accept=".txt,text/plain" data-course-upload-input hidden>
    </div>
    <div class="tadroid-status" data-lesson-status>Wczytywanie treści lekcji…</div>
    <div class="tadroid-lesson-main">
      <div class="tadroid-lesson-tabs" role="tablist" aria-label="Widoki lekcji">
        <button class="tadroid-lesson-tab" id="tadroid-lesson-tab" type="button" role="tab" aria-selected="true" aria-controls="tadroid-lesson-view" data-lesson-view-tab>Lekcja</button>
        <button class="tadroid-lesson-tab" id="tadroid-outline-tab" type="button" role="tab" aria-selected="false" aria-controls="tadroid-outline-view" tabindex="-1" data-lesson-outline-tab>Konspekt kursu</button>
      </div>
      <div class="tadroid-lesson-view" id="tadroid-lesson-view" role="tabpanel" aria-labelledby="tadroid-lesson-tab" data-lesson-view>
        <div class="tadroid-lesson-copy">
          <div
            class="tadroid-lesson-progress"
            data-lesson-progress
            role="progressbar"
            aria-label="Postęp kursu"
            aria-valuemin="0"
            aria-valuemax="1"
            aria-valuenow="0"
            aria-valuetext="Nie wczytano żadnej lekcji"
          >
            <span class="tadroid-lesson-progress-track" aria-hidden="true">
              <span class="tadroid-lesson-progress-fill" data-lesson-progress-fill></span>
            </span>
          </div>
          <p class="tadroid-lesson-heading" data-lesson-heading tabindex="-1">Nie wczytano żadnej lekcji</p>
        </div>
        <pre class="tadroid-lesson-text" data-lesson-text tabindex="0">Wczytywanie treści lekcji…</pre>
        <div class="tadroid-lesson-sample" data-lesson-sample-wrap>
          <div class="tadroid-lesson-sample-header">
            <div class="tadroid-lesson-sample-copy">
              <p class="tadroid-editor-label">Przykładowy kod</p>
            </div>
            <button class="tadroid-btn tadroid-btn-primary" type="button" data-lesson-action="insertSample">Wstaw do projektu</button>
          </div>
          <pre class="tadroid-lesson-sample-text" data-lesson-sample>Ten krok nie ma przypisanego przykładu.</pre>
        </div>
        <p class="tadroid-theory-note" data-lesson-theory-note hidden>Tylko teoria (ten krok nie zawiera przykładowego kodu).</p>
        <div class="tadroid-lesson-actions">
          <button class="tadroid-btn" type="button" data-lesson-action="previous">Poprzedni krok</button>
          <button class="tadroid-btn tadroid-btn-primary" type="button" data-lesson-action="next">Następny krok</button>
        </div>
        <div class="tadroid-editor-status tadroid-lesson-action-status" data-lesson-action-status role="alert" hidden></div>
      </div>
      <section class="tadroid-lesson-outline-view" id="tadroid-outline-view" role="tabpanel" aria-labelledby="tadroid-outline-tab" data-lesson-outline hidden>
        <div class="tadroid-lesson-outline-panel" data-lesson-outline-panel></div>
      </section>
    </div>
    <dialog
      class="tadroid-confirm-dialog tadroid-parts-dialog"
      data-parts-dialog
      role="dialog"
      aria-labelledby="tadroid-parts-dialog-title"
    >
      <p class="tadroid-confirm-title" id="tadroid-parts-dialog-title" data-parts-dialog-title>Potrzebne elementy</p>
      <ul class="tadroid-parts-dialog-list" data-parts-dialog-list></ul>
      <div class="tadroid-confirm-actions">
        <button class="tadroid-btn tadroid-btn-primary" type="button" data-parts-dialog-close>Zamknij</button>
      </div>
    </dialog>
    <dialog
      class="tadroid-confirm-dialog tadroid-parts-dialog tadroid-module-parts-dialog"
      data-module-parts-dialog
      role="dialog"
      aria-labelledby="tadroid-module-parts-dialog-title"
    >
      <p class="tadroid-confirm-title" id="tadroid-module-parts-dialog-title" data-module-parts-dialog-title>Potrzebne elementy modułu</p>
      <div class="tadroid-module-parts-dialog-content" data-module-parts-dialog-content></div>
      <div class="tadroid-confirm-actions">
        <button class="tadroid-btn tadroid-btn-primary" type="button" data-module-parts-dialog-close>Zamknij</button>
      </div>
    </dialog>
    <dialog
      class="tadroid-confirm-dialog"
      data-course-upload-dialog
      role="dialog"
      aria-labelledby="tadroid-course-upload-dialog-title"
    >
      <p class="tadroid-confirm-title" id="tadroid-course-upload-dialog-title" data-course-upload-dialog-title>Zastąpić bieżący kurs?</p>
      <p data-course-upload-dialog-message></p>
      <div class="tadroid-confirm-actions">
        <button class="tadroid-btn" type="button" data-course-upload-dialog-cancel>Anuluj</button>
        <button class="tadroid-btn tadroid-btn-primary" type="button" data-course-upload-dialog-confirm>Wgraj kurs</button>
      </div>
    </dialog>
    <div class="tadroid-sr-only" data-lesson-action-announcer role="status" aria-live="polite" aria-atomic="true" aria-relevant="additions"></div>
    <div class="tadroid-sr-only" data-lesson-announcer role="status" aria-live="polite" aria-atomic="true" aria-relevant="additions"></div>
  `;
  shadow.appendChild(lessonPanel);

  const toggle = document.createElement('button');
  toggle.className = 'tadroid-toggle tadroid-toggle-right';
  toggle.type = 'button';
  toggle.textContent = 'Otwórz panel kodu';
  shadow.appendChild(toggle);

  const panel = document.createElement('section');
  panel.className = 'tadroid-panel tadroid-panel-right tadroid-hidden';
  panel.setAttribute('aria-label', 'Panel kodu');
  panel.innerHTML = `
    <div class="tadroid-header">
      <div>
        <p class="tadroid-title">Panel kodu</p>
        <p class="tadroid-subtitle">Okno do odczytu i analizy kodu w bieżącym projekcie</p>
      </div>
      <button class="tadroid-icon-btn" type="button" data-action="refresh">Odśwież</button>
    </div>
    <div class="tadroid-reader-body">
      <div class="tadroid-main">
        <div class="tadroid-meta" data-meta>Nie wczytano jeszcze żadnego projektu.</div>
        <pre class="tadroid-text" data-text tabindex="0">Czekam na obszar roboczy Coding Canvas…</pre>
      </div>
      <div class="tadroid-controls">
        <div class="tadroid-grid">
          <label class="tadroid-field">
            <span>Głos</span>
            <select class="tadroid-select" data-voice></select>
          </label>
          <label class="tadroid-field">
            <span>Tempo</span>
            <input class="tadroid-range" data-rate type="range" min="0.6" max="1.4" step="0.1" value="1" />
          </label>
        </div>
        <div class="tadroid-actions">
          <button class="tadroid-btn tadroid-btn-primary" type="button" data-action="speak">Czytaj</button>
          <button class="tadroid-btn" type="button" data-action="pause">Pauza</button>
          <button class="tadroid-btn" type="button" data-action="previous-line">Poprzednia linia</button>
          <button class="tadroid-btn" type="button" data-action="skip">Pomiń linię</button>
        </div>
      </div>
      <details class="tadroid-editor" data-editor>
        <summary class="tadroid-editor-toggle">Narzędzia edycji</summary>
        <div class="tadroid-editor-panel">
          <div class="tadroid-editor-copy">
            <p class="tadroid-editor-title">Dodaj więcej kroków</p>
            <p class="tadroid-editor-hint">Wpisuj komendy w języku angielskim i wstawiaj je do projektu.</p>
          </div>
          <div class="tadroid-insertion">
            <p class="tadroid-insertion-label" data-insertion-label>Otwórz projekt, aby wybrać, gdzie mają trafić nowe kroki.</p>
            <p class="tadroid-sr-only" data-insertion-announcer aria-live="polite" aria-atomic="true" role="status"></p>
            <div class="tadroid-editor-actions tadroid-editor-navigation-actions">
              <button class="tadroid-btn" type="button" data-editor-action="up"><span aria-hidden="true">↑</span> Wyżej</button>
              <button class="tadroid-btn" type="button" data-editor-action="down"><span aria-hidden="true">↓</span> Niżej</button>
              <button class="tadroid-btn" type="button" data-editor-action="end"><span aria-hidden="true">⇓</span> Koniec</button>
            </div>
            <div class="tadroid-editor-actions tadroid-editor-delete-actions">
              <button class="tadroid-btn tadroid-btn-danger" type="button" data-editor-action="delete">Usuń poprzedni krok</button>
              <button class="tadroid-btn tadroid-btn-danger" type="button" data-editor-action="delete-all">Usuń cały kod</button>
            </div>
          </div>
          <textarea
            id="tadroid-compose-input"
            class="tadroid-editor-input"
            data-compose-input
            rows="5"
            placeholder="Przykład: Move forward for 10 steps"
          ></textarea>
          <div class="tadroid-editor-actions tadroid-editor-actions-main">
            <button class="tadroid-btn tadroid-btn-primary" type="button" data-editor-action="insert">Wstaw do projektu</button>
          </div>
          <div class="tadroid-editor-status" data-compose-status role="alert" hidden></div>
          <details class="tadroid-editor-examples">
            <summary class="tadroid-examples-toggle">Przykładowe polecenia</summary>
            <p class="tadroid-editor-hint tadroid-editor-hint-examples">“Move forward for 10 steps”, “Write &quot;Hello&quot;”, “Repeat 3 times”, “Send message &quot;up&quot; and continue” oraz „When up key is pressed”.</p>
          </details>
        </div>
      </details>
    </div>
    <dialog
      class="tadroid-confirm-dialog"
      data-delete-dialog
      role="alertdialog"
      aria-labelledby="tadroid-delete-dialog-title"
      aria-describedby="tadroid-delete-dialog-description"
    >
      <p class="tadroid-confirm-title" id="tadroid-delete-dialog-title">Usunąć cały kod?</p>
      <p class="tadroid-confirm-description" id="tadroid-delete-dialog-description">Spowoduje to usunięcie wszystkich skryptów, zmiennych i dźwięków z bieżącego projektu. Tej operacji nie można wycofać.</p>
      <div class="tadroid-confirm-actions">
        <button class="tadroid-btn" type="button" data-delete-dialog-cancel>Anuluj</button>
        <button class="tadroid-btn tadroid-btn-danger" type="button" data-delete-dialog-confirm>Usuń cały kod</button>
      </div>
    </dialog>
    <div class="tadroid-sr-only" data-compose-announcer role="status" aria-live="polite" aria-atomic="true" aria-relevant="additions"></div>
  `;
  shadow.appendChild(panel);
  document.documentElement.appendChild(host);

  const ui = {
    lessonToggle,
    lessonPanel,
    lessonCourse: lessonPanel.querySelector('[data-lesson-course]'),
    lessonModule: lessonPanel.querySelector('[data-lesson-module]'),
    lessonLesson: lessonPanel.querySelector('[data-lesson-lesson]'),
    lessonStatus: lessonPanel.querySelector('[data-lesson-status]'),
    lessonTabs: lessonPanel.querySelector('.tadroid-lesson-tabs'),
    lessonViewTab: lessonPanel.querySelector('[data-lesson-view-tab]'),
    lessonOutlineTab: lessonPanel.querySelector('[data-lesson-outline-tab]'),
    lessonView: lessonPanel.querySelector('[data-lesson-view]'),
    lessonProgress: lessonPanel.querySelector('[data-lesson-progress]'),
    lessonProgressFill: lessonPanel.querySelector('[data-lesson-progress-fill]'),
    lessonHeading: lessonPanel.querySelector('[data-lesson-heading]'),
    lessonText: lessonPanel.querySelector('[data-lesson-text]'),
    lessonSampleWrap: lessonPanel.querySelector('[data-lesson-sample-wrap]'),
    lessonSample: lessonPanel.querySelector('[data-lesson-sample]'),
    lessonTheoryNote: lessonPanel.querySelector('[data-lesson-theory-note]'),
    lessonActions: lessonPanel.querySelectorAll('[data-lesson-action]'),
    lessonOutline: lessonPanel.querySelector('[data-lesson-outline]'),
    lessonOutlinePanel: lessonPanel.querySelector('[data-lesson-outline-panel]'),
    lessonActionStatus: lessonPanel.querySelector('[data-lesson-action-status]'),
    lessonActionAnnouncer: lessonPanel.querySelector('[data-lesson-action-announcer]'),
    lessonAnnouncer: lessonPanel.querySelector('[data-lesson-announcer]'),
    partsDialog: lessonPanel.querySelector('[data-parts-dialog]'),
    partsDialogTitle: lessonPanel.querySelector('[data-parts-dialog-title]'),
    partsDialogList: lessonPanel.querySelector('[data-parts-dialog-list]'),
    partsDialogClose: lessonPanel.querySelector('[data-parts-dialog-close]'),
    modulePartsDialog: lessonPanel.querySelector('[data-module-parts-dialog]'),
    modulePartsDialogTitle: lessonPanel.querySelector('[data-module-parts-dialog-title]'),
    modulePartsDialogContent: lessonPanel.querySelector('[data-module-parts-dialog-content]'),
    modulePartsDialogClose: lessonPanel.querySelector('[data-module-parts-dialog-close]'),
    courseUploadButton: lessonPanel.querySelector('[data-course-upload-button]'),
    courseUploadInput: lessonPanel.querySelector('[data-course-upload-input]'),
    courseUploadDialog: lessonPanel.querySelector('[data-course-upload-dialog]'),
    courseUploadDialogMessage: lessonPanel.querySelector('[data-course-upload-dialog-message]'),
    courseUploadDialogCancel: lessonPanel.querySelector('[data-course-upload-dialog-cancel]'),
    courseUploadDialogConfirm: lessonPanel.querySelector('[data-course-upload-dialog-confirm]'),
    toggle,
    panel,
    meta: panel.querySelector('[data-meta]'),
    text: panel.querySelector('[data-text]'),
    controls: panel.querySelector('.tadroid-controls'),
    voice: panel.querySelector('[data-voice]'),
    rate: panel.querySelector('[data-rate]'),
    actions: panel.querySelectorAll('[data-action]'),
    speakButton: panel.querySelector('[data-action="speak"]'),
    pauseButton: panel.querySelector('[data-action="pause"]'),
    editor: panel.querySelector('[data-editor]'),
    editorToggle: panel.querySelector('.tadroid-editor-toggle'),
    insertionLabel: panel.querySelector('[data-insertion-label]'),
    insertionAnnouncer: panel.querySelector('[data-insertion-announcer]'),
    composeInput: panel.querySelector('[data-compose-input]'),
    composeStatus: panel.querySelector('[data-compose-status]'),
    composeAnnouncer: panel.querySelector('[data-compose-announcer]'),
    editorActions: panel.querySelectorAll('[data-editor-action]'),
    deleteStepButton: panel.querySelector('[data-editor-action="delete"]'),
    deleteAllButton: panel.querySelector('[data-editor-action="delete-all"]'),
    deleteDialog: panel.querySelector('[data-delete-dialog]'),
    deleteDialogCancel: panel.querySelector('[data-delete-dialog-cancel]'),
    deleteDialogConfirm: panel.querySelector('[data-delete-dialog-confirm]'),
  };
  const operationAnnouncementTimers = new WeakMap();
  const cloneJson = window.LecpAdapter.cloneJson;

  function setStatus(message) {
    const normalized = String(message || '').trim();
    if (normalized && !QUIET_STATUS_MESSAGES.has(normalized)) {
      console.warn('[4LL]', normalized);
    }
  }

  function announceOperation(element, message) {
    if (!element || !message) return;
    const previousTimer = operationAnnouncementTimers.get(element);
    if (previousTimer) clearTimeout(previousTimer);
    element.setAttribute('aria-busy', 'true');
    element.replaceChildren();
    const timerId = setTimeout(() => {
      const announcement = document.createElement('span');
      announcement.textContent = message;
      element.appendChild(announcement);
      element.setAttribute('aria-busy', 'false');
      operationAnnouncementTimers.delete(element);
    }, 100);
    operationAnnouncementTimers.set(element, timerId);
  }

  function clearOperationAnnouncement(element) {
    if (!element) return;
    const previousTimer = operationAnnouncementTimers.get(element);
    if (previousTimer) clearTimeout(previousTimer);
    operationAnnouncementTimers.delete(element);
    element.replaceChildren();
    element.setAttribute('aria-busy', 'false');
  }

  function setComposeStatus(message, tone = '') {
    const normalized = String(message || '').trim();
    const isError = tone === 'error';
    ui.composeStatus.hidden = !normalized;
    ui.composeStatus.textContent = normalized;
    ui.composeStatus.classList.toggle('tadroid-editor-status-error', isError);
    if (!isError && normalized) announceOperation(ui.composeAnnouncer, normalized);
    if (!isError && !normalized) clearOperationAnnouncement(ui.composeAnnouncer);
  }

  function setLessonStatus(message, tone = '') {
    const normalized = String(message || '').trim();
    ui.lessonStatus.hidden = !normalized;
    ui.lessonStatus.textContent = normalized;
    ui.lessonStatus.classList.toggle('tadroid-status-error', tone === 'error');
  }

  function setLessonActionStatus(message, tone = '') {
    const normalized = String(message || '').trim();
    const isError = tone === 'error';
    ui.lessonActionStatus.hidden = !normalized;
    ui.lessonActionStatus.textContent = normalized;
    ui.lessonActionStatus.classList.toggle('tadroid-editor-status-error', isError);
    if (!isError && normalized) announceOperation(ui.lessonActionAnnouncer, normalized);
    if (!isError && !normalized) clearOperationAnnouncement(ui.lessonActionAnnouncer);
  }

  function syncReaderEditorMode() {
    const isEditorOpen = Boolean(ui.editor?.open);
    panel.classList.toggle('tadroid-editor-mode', isEditorOpen);
    if (ui.controls) ui.controls.hidden = isEditorOpen;
  }

  function flattenShortcutDefinitions(definitions) {
    return definitions.flatMap((definition) => Array.isArray(definition) ? definition : [definition]).filter(Boolean);
  }

  function describeShortcut(...definitions) {
    return flattenShortcutDefinitions(definitions).map((definition) => definition.label).join(' lub ');
  }

  function applyShortcutMetadata(element, ...definitions) {
    if (!element || typeof element.setAttribute !== 'function') return;
    const shortcutText = describeShortcut(...definitions);
    if (!shortcutText) return;
    const ariaShortcuts = flattenShortcutDefinitions(definitions)
      .map((definition) => {
        const parts = [];
        if (definition.ctrlKey) parts.push('Control');
        if (definition.metaKey) parts.push('Meta');
        if (definition.altKey) parts.push('Alt');
        if (definition.shiftKey) parts.push('Shift');
        parts.push(definition.key === ' ' ? 'Space' : definition.key);
        return parts.join('+');
      })
      .join(' ');
    element.setAttribute('aria-keyshortcuts', ariaShortcuts);
    element.title = `${element.textContent || element.getAttribute?.('aria-label') || 'Akcja'} (${shortcutText})`;
  }

  function matchesShortcut(event, definition) {
    if (!definition || !event) return false;
    return Boolean(definition.altKey) === Boolean(event.altKey) &&
      Boolean(definition.ctrlKey) === Boolean(event.ctrlKey) &&
      Boolean(definition.metaKey) === Boolean(event.metaKey) &&
      Boolean(definition.shiftKey) === Boolean(event.shiftKey) &&
      String(event.key || '').toLowerCase() === String(definition.key || '').toLowerCase();
  }

  function matchesAnyShortcut(event, definitions) {
    return flattenShortcutDefinitions([definitions]).some((definition) => matchesShortcut(event, definition));
  }

  function panelIsOpen() {
    return !panel.classList.contains('tadroid-hidden');
  }

  function lessonPanelIsOpen() {
    return !lessonPanel.classList.contains('tadroid-hidden');
  }

  function isEditableTarget(target) {
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest('textarea, input, select, [contenteditable=""], [contenteditable="true"], [role="textbox"]'));
  }

  function announceInsertionPoint(message) {
    if (!ui.insertionAnnouncer) return;
    ui.insertionAnnouncer.textContent = '';
    if (state.editor.announceTimeoutId) clearTimeout(state.editor.announceTimeoutId);
    state.editor.announceTimeoutId = setTimeout(() => {
      ui.insertionAnnouncer.textContent = message;
      state.editor.announceTimeoutId = null;
    }, 30);
  }

  function announceLesson(message) {
    if (!ui.lessonAnnouncer) return;
    ui.lessonAnnouncer.textContent = '';
    if (state.lesson.announceTimeoutId) clearTimeout(state.lesson.announceTimeoutId);
    state.lesson.announceTimeoutId = setTimeout(() => {
      ui.lessonAnnouncer.textContent = message;
      state.lesson.announceTimeoutId = null;
    }, 30);
  }

  function getLessonStorageArea() {
    return chrome?.storage?.local || null;
  }

  function getLessonProgressKey(course) {
    if (!course?.id) return '';
    return `${STORAGE_KEY_PREFIX}:${course.id}:v${course.version || '1'}`;
  }

  function useInMemoryLessonProgress() {
    state.lesson.storageMode = 'memory';
  }

  function readStoredLessonStepIndex() {
    const storageArea = getLessonStorageArea();
    const progressKey = state.lesson.progressKey;

    if (!storageArea?.get || !progressKey) {
      if (!storageArea?.get) useInMemoryLessonProgress();
      return Promise.resolve(state.lesson.memoryStepIndex);
    }

    return new Promise((resolve) => {
      try {
        storageArea.get([progressKey], (result) => {
          if (chrome.runtime?.lastError) {
            console.warn('[TADroid Lessons] Could not restore saved progress.', chrome.runtime.lastError.message);
            useInMemoryLessonProgress();
            resolve(state.lesson.memoryStepIndex);
            return;
          }
          const storedValue = result?.[progressKey];
          const parsedValue = Number(storedValue);
          resolve(Number.isInteger(parsedValue) ? parsedValue : state.lesson.memoryStepIndex);
        });
      } catch (error) {
        console.warn('[TADroid Lessons] Could not restore saved progress.', error);
        useInMemoryLessonProgress();
        resolve(state.lesson.memoryStepIndex);
      }
    });
  }

  function saveLessonStepIndex(stepIndex) {
    state.lesson.memoryStepIndex = stepIndex;

    const storageArea = getLessonStorageArea();
    const progressKey = state.lesson.progressKey;
    if (!storageArea?.set || !progressKey) {
      if (!storageArea?.set) useInMemoryLessonProgress();
      return;
    }

    try {
      storageArea.set({ [progressKey]: stepIndex }, () => {
        if (chrome.runtime?.lastError) {
          console.warn('[TADroid Lessons] Could not save lesson progress.', chrome.runtime.lastError.message);
          useInMemoryLessonProgress();
        }
      });
    } catch (error) {
      console.warn('[TADroid Lessons] Could not save lesson progress.', error);
      useInMemoryLessonProgress();
    }
  }

  function getCurrentLessonStep() {
    return state.lesson.flatSteps[state.lesson.currentStepIndex] || null;
  }

  function updateLessonProgress(currentStep, totalSteps) {
    const total = Math.max(0, Number(totalSteps) || 0);
    const current = total ? Math.max(1, Math.min(total, Number(currentStep) || 1)) : 0;
    const label = total ? `Krok ${current} z ${total}` : 'Brak dostępnych kroków lekcji';
    const percentage = total ? (current / total) * 100 : 0;

    ui.lessonProgress.setAttribute('aria-valuemin', '0');
    ui.lessonProgress.setAttribute('aria-valuemax', String(total || 1));
    ui.lessonProgress.setAttribute('aria-valuenow', String(current));
    ui.lessonProgress.setAttribute('aria-valuetext', label);
    ui.lessonProgressFill.style.width = `${percentage}%`;
  }

  function updateLessonActionAvailability() {
    const currentStep = getCurrentLessonStep();
    const hasCourse = Boolean(state.lesson.course && state.lesson.flatSteps.length);
    const hasSample = Boolean(currentStep?.sampleText?.trim());

    ui.lessonActions.forEach((button) => {
      const action = button.dataset.lessonAction;
      if (action === 'previous') {
        button.disabled = !hasCourse || state.lesson.currentStepIndex <= 0;
        return;
      }
      if (action === 'next') {
        button.disabled = !hasCourse || state.lesson.currentStepIndex >= state.lesson.flatSteps.length - 1;
        return;
      }
      if (action === 'insertSample') {
        button.disabled = !hasCourse || !hasSample;
      }
    });
  }

  function buildLessonStepAnnouncement(step) {
    if (!step) return 'Lekcja niedostępna.';
    return `Krok ${step.globalStepNumber} z ${state.lesson.flatSteps.length}. ${step.moduleTitle}. ${step.lessonTitle}. ${step.title}.`;
  }

  function setLessonOutlineOpen(isOpen, options = {}) {
    const outlineIsOpen = Boolean(isOpen && !ui.lessonOutlineTab.disabled);
    state.lesson.outlineOpen = outlineIsOpen;
    ui.lessonView.hidden = outlineIsOpen;
    ui.lessonOutline.hidden = !outlineIsOpen;
    ui.lessonViewTab.setAttribute('aria-selected', String(!outlineIsOpen));
    ui.lessonOutlineTab.setAttribute('aria-selected', String(outlineIsOpen));
    ui.lessonViewTab.tabIndex = outlineIsOpen ? -1 : 0;
    ui.lessonOutlineTab.tabIndex = outlineIsOpen ? 0 : -1;
    if (options.focusTab) {
      (outlineIsOpen ? ui.lessonOutlineTab : ui.lessonViewTab).focus();
    }
  }

  function getModuleStepsWithParts(module) {
    const steps = [];
    module?.lessons?.forEach((lesson) => {
      lesson.steps?.forEach((step) => {
        if (step.hasParts && step.parts?.length) {
          steps.push(step);
        }
      });
    });
    return steps;
  }

  function moduleHasParts(module) {
    return Boolean(module?.lessons?.some((lesson) => lesson.steps?.some((step) => step.hasParts && step.parts?.length)));
  }

  function renderLessonOutline() {
    ui.lessonOutlinePanel.innerHTML = '';
    const course = state.lesson.course;
    if (!course?.modules?.length) {
      ui.lessonOutlineTab.disabled = true;
      setLessonOutlineOpen(false);
      return;
    }

    ui.lessonOutlineTab.disabled = false;
    setLessonOutlineOpen(state.lesson.outlineOpen);
    const fragment = document.createDocumentFragment();

    course.modules.forEach((module, moduleIndex) => {
      const moduleSection = document.createElement('section');
      moduleSection.className = 'tadroid-lesson-outline-section';

      const hasParts = moduleHasParts(module);

      const moduleHeader = document.createElement('div');
      moduleHeader.className = 'tadroid-lesson-outline-module-header';

      const moduleHeading = document.createElement('p');
      moduleHeading.className = 'tadroid-lesson-outline-heading';
      moduleHeading.textContent = module.title;
      moduleHeader.appendChild(moduleHeading);

      if (hasParts) {
        const partsButton = document.createElement('button');
        partsButton.type = 'button';
        partsButton.className = 'tadroid-lesson-outline-parts-button tadroid-lesson-outline-module-parts-button';
        partsButton.dataset.lessonModulePartsIndex = String(moduleIndex);
        partsButton.innerHTML = '<span role="img" aria-label="Elementy">🧱</span>';
        partsButton.setAttribute('aria-label', `Elementy potrzebne do modułu: ${module.title}`);
        partsButton.title = `Elementy potrzebne do modułu: ${module.title}`;
        applyShortcutMetadata(partsButton, SHORTCUTS.viewParts);
        moduleHeader.appendChild(partsButton);
      }

      moduleSection.appendChild(moduleHeader);

      module.lessons.forEach((lesson, lessonIndex) => {
        const lessonGroup = document.createElement('div');
        lessonGroup.className = 'tadroid-lesson-outline-group';

        const lessonHeading = document.createElement('p');
        lessonHeading.className = 'tadroid-lesson-outline-lesson';
        lessonHeading.textContent = lesson.title;
        lessonGroup.appendChild(lessonHeading);

        const list = document.createElement('div');
        list.className = 'tadroid-lesson-outline-list';

        lesson.steps.forEach((step, stepIndex) => {
          const stepRow = document.createElement('div');
          stepRow.className = 'tadroid-lesson-outline-step-row';

          const button = document.createElement('button');
          button.type = 'button';
          button.className = 'tadroid-lesson-outline-step';
          button.dataset.lessonStepIndex = String(step.globalIndex);
          if (step.globalIndex === state.lesson.currentStepIndex) button.setAttribute('aria-current', 'step');
          button.textContent = `${moduleIndex + 1}.${lessonIndex + 1}.${stepIndex + 1} · ${step.title}`;
          stepRow.appendChild(button);

          if (step.hasParts) {
            const partsButton = document.createElement('button');
            partsButton.type = 'button';
            partsButton.className = 'tadroid-lesson-outline-parts-button';
            partsButton.dataset.lessonPartsStepIndex = String(step.globalIndex);
            partsButton.innerHTML = '<span role="img" aria-label="Elementy">🧱</span>';
            partsButton.setAttribute('aria-label', `Elementy potrzebne do kroku: ${step.title}`);
            applyShortcutMetadata(partsButton, SHORTCUTS.viewParts);
            stepRow.appendChild(partsButton);
          }

          list.appendChild(stepRow);
        });

        lessonGroup.appendChild(list);
        moduleSection.appendChild(lessonGroup);
      });

      fragment.appendChild(moduleSection);
    });

    ui.lessonOutlinePanel.appendChild(fragment);
  }

  function renderPartsDialogList(parts) {
    ui.partsDialogList.innerHTML = '';
    const fragment = document.createDocumentFragment();

    parts.forEach((part) => {
      const item = document.createElement('li');
      item.className = 'tadroid-parts-dialog-item';

      if (part.image) {
        const image = document.createElement('img');
        image.className = 'tadroid-parts-dialog-thumb';
        image.src = chrome.runtime.getURL(part.image);
        image.alt = '';
        item.appendChild(image);
      }

      const copy = document.createElement('div');
      copy.className = 'tadroid-parts-dialog-copy';

      const name = document.createElement('p');
      name.className = 'tadroid-parts-dialog-name';
      name.textContent = `${part.description}`;
      copy.appendChild(name);

      const meta = document.createElement('p');
      meta.className = 'tadroid-parts-dialog-meta';
      meta.textContent = `Potrzebna ilość: ${part.quantity}`;
      copy.appendChild(meta);

      item.appendChild(copy);
      fragment.appendChild(item);
    });

    ui.partsDialogList.appendChild(fragment);
  }

  function renderModulePartsDialogContent(module) {
    ui.modulePartsDialogContent.innerHTML = '';
    const stepsWithParts = getModuleStepsWithParts(module);

    if (!stepsWithParts.length) {
      const emptyNote = document.createElement('p');
      emptyNote.className = 'tadroid-confirm-description';
      emptyNote.textContent = 'Ten moduł nie wymaga żadnych elementów klocków LEGO.';
      ui.modulePartsDialogContent.appendChild(emptyNote);
      return;
    }

    const fragment = document.createDocumentFragment();

    stepsWithParts.forEach((step) => {
      const stepGroup = document.createElement('section');
      stepGroup.className = 'tadroid-module-parts-step-group';

      const stepHeader = document.createElement('p');
      stepHeader.className = 'tadroid-module-parts-step-title';
      stepHeader.textContent = `${step.moduleIndex + 1}.${step.lessonIndex + 1}.${step.stepIndex + 1} · ${step.title}`;
      stepGroup.appendChild(stepHeader);

      const list = document.createElement('ul');
      list.className = 'tadroid-parts-dialog-list tadroid-module-parts-list';

      step.parts.forEach((part) => {
        const item = document.createElement('li');
        item.className = 'tadroid-parts-dialog-item';

        if (part.image) {
          const image = document.createElement('img');
          image.className = 'tadroid-parts-dialog-thumb';
          image.src = chrome.runtime.getURL(part.image);
          image.alt = '';
          item.appendChild(image);
        }

        const copy = document.createElement('div');
        copy.className = 'tadroid-parts-dialog-copy';

        const name = document.createElement('p');
        name.className = 'tadroid-parts-dialog-name';
        name.textContent = `${part.description}`;
        copy.appendChild(name);

        const meta = document.createElement('p');
        meta.className = 'tadroid-parts-dialog-meta';
        meta.textContent = `Potrzebna ilość: ${part.quantity}`;
        copy.appendChild(meta);

        item.appendChild(copy);
        list.appendChild(item);
      });

      stepGroup.appendChild(list);
      fragment.appendChild(stepGroup);
    });

    ui.modulePartsDialogContent.appendChild(fragment);
  }

  function closePartsDialog(options = {}) {
    if (!ui.partsDialog.open) return;
    const returnFocus = state.lesson.partsDialogReturnFocus;
    ui.partsDialog.close();
    state.lesson.partsDialogReturnFocus = null;
    if (options.restoreFocus !== false) {
      const focusTarget = returnFocus?.isConnected ? returnFocus : ui.lessonOutlineTab;
      setTimeout(() => focusTarget?.focus({ preventScroll: true }), 0);
    }
  }

  function closeModulePartsDialog(options = {}) {
    if (!ui.modulePartsDialog?.open) return;
    const returnFocus = state.lesson.modulePartsDialogReturnFocus;
    ui.modulePartsDialog.close();
    state.lesson.modulePartsDialogReturnFocus = null;
    if (options.restoreFocus !== false) {
      const focusTarget = returnFocus?.isConnected ? returnFocus : ui.lessonOutlineTab;
      setTimeout(() => focusTarget?.focus({ preventScroll: true }), 0);
    }
  }

  function openPartsDialog(step) {
    if (!step?.hasParts || !step.parts.length) return;
    if (ui.partsDialog.open || ui.modulePartsDialog?.open) return;
    state.lesson.partsDialogReturnFocus = shadow.activeElement;
    ui.partsDialogTitle.textContent = `Potrzebne elementy`;
    renderPartsDialogList(step.parts);
    ui.partsDialog.showModal();
    ui.partsDialogClose.focus({ preventScroll: true });
  }

  function openModulePartsDialog(module) {
    if (!module) return;
    if (ui.modulePartsDialog.open || ui.partsDialog.open) return;
    state.lesson.modulePartsDialogReturnFocus = shadow.activeElement;
    ui.modulePartsDialogTitle.textContent = `Potrzebne elementy: ${module.title}`;
    renderModulePartsDialogContent(module);
    ui.modulePartsDialog.showModal();
    ui.modulePartsDialogClose.focus({ preventScroll: true });
  }

  function getPartsDialogTargetStep() {
    const activeElement = shadow.activeElement;
    if (activeElement instanceof Element) {
      const stepRow = activeElement.closest('[data-lesson-step-index], [data-lesson-parts-step-index]');
      if (stepRow) {
        const index = Number(stepRow.getAttribute('data-lesson-step-index') || stepRow.getAttribute('data-lesson-parts-step-index'));
        if (Number.isInteger(index)) return state.lesson.flatSteps[index] || null;
      }
    }
    return getCurrentLessonStep();
  }

  function renderLessonError(message, options = {}) {
    const noCourse = Boolean(options.noCourse);
    state.lesson.course = null;
    state.lesson.flatSteps = [];
    ui.lessonCourse.textContent = 'Lekcje TADroid';
    ui.lessonModule.textContent = noCourse ? 'Kurs nie został jeszcze wgrany' : 'Kurs niedostępny';
    ui.lessonLesson.textContent = noCourse ? 'Wgraj plik z treścią lekcji' : 'Sprawdź treść wgranego pliku kursu';
    updateLessonProgress(0, 0);
    ui.lessonHeading.textContent = noCourse ? 'Brak wgranego kursu' : 'Treść kursu niedostępna';
    ui.lessonText.textContent = message;
    ui.lessonSampleWrap.hidden = true;
    ui.lessonTheoryNote.hidden = true;
    ui.lessonOutlineTab.disabled = true;
    setLessonOutlineOpen(false);
    setLessonStatus(noCourse ? '' : 'Plik kursu zawiera błędy.', noCourse ? '' : 'error');
    setLessonActionStatus(
      noCourse
        ? 'Użyj przycisku „Wgraj kurs”, aby dodać plik z treścią lekcji.'
        : 'Popraw plik kursu i wgraj go ponownie.',
      'error'
    );
    updateLessonActionAvailability();
  }

  function splitLessonBodyIntoParagraphs(bodyText) {
    return String(bodyText || '').split(/\n{2,}/);
  }

  function appendSrOnlyMarker(fragment, text) {
    const marker = document.createElement('span');
    marker.className = 'tadroid-sr-only';
    marker.textContent = text;
    fragment.appendChild(marker);
  }

  function renderLessonBodyText(bodyText) {
    const paragraphs = splitLessonBodyIntoParagraphs(bodyText);
    const fragment = document.createDocumentFragment();
    paragraphs.forEach((paragraph, paragraphIndex) => {
      const lines = paragraph.split('\n');
      lines.forEach((line, lineIndex) => {
        fragment.appendChild(document.createTextNode(line));
        if (lineIndex < lines.length - 1) {
          appendSrOnlyMarker(fragment, '. ');
          fragment.appendChild(document.createTextNode('\n'));
        }
      });
      if (paragraphIndex < paragraphs.length - 1) {
        appendSrOnlyMarker(fragment, '. ');
        fragment.appendChild(document.createTextNode('\n\n'));
      }
    });
    ui.lessonText.replaceChildren(fragment);
  }

  function renderCurrentLessonStep(options = {}) {
    const step = getCurrentLessonStep();
    if (!step) {
      renderLessonError(state.lesson.errorText || 'Brak dostępnych kroków lekcji.');
      return;
    }

    ui.lessonCourse.textContent = state.lesson.course.title;
    ui.lessonModule.textContent = step.moduleTitle;
    ui.lessonLesson.textContent = step.lessonTitle;
    updateLessonProgress(step.globalStepNumber, state.lesson.flatSteps.length);
    ui.lessonHeading.textContent = step.title;
    renderLessonBodyText(step.bodyText);
    const hasSample = Boolean(step.sampleText?.trim());
    ui.lessonSampleWrap.hidden = !hasSample;
    ui.lessonTheoryNote.hidden = hasSample;
    if (hasSample) {
      ui.lessonSample.textContent = step.sampleText;
    }
    setLessonStatus('');
    setLessonActionStatus('');
    renderLessonOutline();
    updateLessonActionAvailability();

    if (options.persist !== false) saveLessonStepIndex(state.lesson.currentStepIndex);
    if (options.announce !== false && !options.focusHeading) announceLesson(buildLessonStepAnnouncement(step));
    if (options.focusHeading) ui.lessonHeading.focus();
  }

  function goToLessonStep(stepIndex, options = {}) {
    if (!state.lesson.flatSteps.length) return;
    state.lesson.currentStepIndex = Math.max(0, Math.min(state.lesson.flatSteps.length - 1, stepIndex));
    renderCurrentLessonStep(options);
  }

  function moveLessonStep(delta, options = {}) {
    goToLessonStep(state.lesson.currentStepIndex + delta, options);
  }

  function applyCourse(course) {
    state.lesson.course = course?.isValid ? course : null;
    state.lesson.flatSteps = course?.flatSteps || [];
    state.lesson.errorText = course?.errorText || '';
    state.lesson.currentStepIndex = 0;
    state.lesson.progressKey = getLessonProgressKey(course);
    state.lesson.memoryStepIndex = 0;

    if (!course) {
      renderLessonError('Nie wgrano jeszcze żadnego kursu. Użyj przycisku „Wgraj kurs”, aby dodać plik z treścią lekcji.', { noCourse: true });
      return;
    }

    if (!course.isValid) {
      renderLessonError(course.errorText || 'Plik kursu zawiera błędy.');
      return;
    }

    renderCurrentLessonStep({ announce: false, persist: false });
    readStoredLessonStepIndex().then((storedIndex) => {
      const numericIndex = Number(storedIndex);
      if (Number.isInteger(numericIndex) && numericIndex >= 0 && numericIndex < state.lesson.flatSteps.length) {
        state.lesson.currentStepIndex = numericIndex;
      }
      renderCurrentLessonStep({ announce: false, persist: false });
    });
  }

  function initializeLessons() {
    const storageArea = getLessonStorageArea();
    if (!storageArea?.get) {
      useInMemoryLessonProgress();
      applyCourse(null);
      return;
    }

    try {
      storageArea.get([COURSE_SOURCE_STORAGE_KEY], (result) => {
        if (chrome.runtime?.lastError) {
          console.warn('[TADroid Lessons] Could not read the uploaded course file.', chrome.runtime.lastError.message);
          useInMemoryLessonProgress();
          applyCourse(null);
          return;
        }
        const storedSource = result?.[COURSE_SOURCE_STORAGE_KEY];
        applyCourse(storedSource ? window.TadroidParseCourse(storedSource) : null);
      });
    } catch (error) {
      console.warn('[TADroid Lessons] Could not read the uploaded course file.', error);
      useInMemoryLessonProgress();
      applyCourse(null);
    }
  }

  function insertCurrentLessonSample() {
    const currentStep = getCurrentLessonStep();
    if (!currentStep) {
      setLessonActionStatus('Nie wczytano żadnego kroku lekcji.', 'error');
      return;
    }
    if (!currentStep.sampleText) {
      setLessonActionStatus('Ten krok nie ma przypisanego przykładowego polecenia.', 'error');
      return;
    }
    if (!state.ast) {
      requestProject({ force: true });
      setLessonActionStatus('Otwórz lub utwórz projekt Coding Canvas przed wstawieniem tego przykładu.', 'error');
      return;
    }

    const insertSignature = `${currentStep.id}::${currentStep.sampleText}`;
    const now = Date.now();
    if (
      state.lesson.lastInsertSignature === insertSignature &&
      now - state.lesson.lastInsertAt < 750
    ) {
      setLessonActionStatus('Wstawianie przykładu już trwa.');
      return;
    }

    state.lesson.lastInsertSignature = insertSignature;
    state.lesson.lastInsertAt = now;
    const result = appendCommandsToProject(currentStep.sampleText, {
      statusTarget: 'lesson',
      missingProjectMessage: 'Otwórz lub utwórz projekt Coding Canvas przed wstawieniem tego przykładu.',
    });

    if (!result || !result.ok) {
      state.lesson.lastInsertSignature = '';
      state.lesson.lastInsertAt = 0;
    }
  }

  function getAvailableSounds() {
    return window.LecpAdapter.AVAILABLE_SOUND_NAMES;
  }

  function numberLabel(value, singular, plural) {
    return Math.abs(Number(value) - 1) < 0.0001 ? singular : plural;
  }

  function polishCount(value, one, few, many) {
    const n = Math.abs(Number(value));
    if (n === 1) return one;
    const lastDigit = n % 10;
    const lastTwoDigits = n % 100;
    if (lastDigit >= 2 && lastDigit <= 4 && !(lastTwoDigits >= 12 && lastTwoDigits <= 14)) return few;
    return many;
  }

  function polishStepWord(count) {
    return polishCount(count, 'krok', 'kroki', 'kroków');
  }

  function polishScriptWord(count) {
    return polishCount(count, 'skrypt', 'skrypty', 'skryptów');
  }

  function humanizeArrowKey(key) {
    return String(key || 'a key').replace(/^Arrow/, '').replace(/([a-z])([A-Z])/g, '$1 $2').trim();
  }

  function expressionToText(expression) {
    if (!expression) return 'an unknown condition';
    switch (expression.kind) {
      case 'keyPressedExpression':
        return `the ${humanizeArrowKey(expression.key)} key is pressed`;
      case 'literalExpression':
        return expression.value === '' ? 'empty' : String(expression.value);
      case 'genericExpression':
      case 'unknownExpression':
        return expression.label || 'an unknown condition';
      default:
        return 'an unknown condition';
    }
  }

  function directionText(value) {
    return String(value || 'forward').toLowerCase();
  }

  const motorDirectionText = window.LecpAdapter.motorDirectionText;

  function triggerToText(trigger) {
    if (!trigger) return 'Unknown start';
    switch (trigger.kind) {
      case 'programStart':
        return 'When the program starts';
      case 'messageReceivedTrigger':
        return `When message "${trigger.message || ''}" is received`;
      case 'doubleMotorTappedTrigger':
        return 'When the double motor is tapped';
      case 'keyPressedTrigger':
        return `When the ${humanizeArrowKey(trigger.key)} key is pressed`;
      case 'colorSensorWhenColorTrigger':
        return `When the color sensor detects ${window.LecpAdapter.colorValueToText(trigger.color)}`;
      case 'genericTrigger':
      case 'unknownTrigger':
        return trigger.label || 'Unknown start';
      default:
        return 'Unknown start';
    }
  }

  function branchNameToText(name) {
    const normalized = String(name || 'body').toUpperCase();
    if (['BODY', 'THEN', 'DO', 'IFBODY'].includes(normalized)) return '';
    if (['ELSE', 'ELSEBODY'].includes(normalized)) return 'Otherwise';
    return normalized.replace(/_/g, ' ').toLowerCase();
  }

  function branchToLine(branch) {
    const label = branchNameToText(branch?.name);
    const children = buildLines(branch?.body);
    if (!label) return children;
    return {
      text: label,
      children,
    };
  }

  function statementToLine(statement) {
    if (!statement) return { text: 'Unknown step' };
    switch (statement.kind) {
      case 'move':
        return { text: `Move ${directionText(statement.direction)} for ${statement.value} ${numberLabel(statement.value, 'step', 'steps')}` };
      case 'turn':
        return { text: `Turn ${directionText(statement.direction)} for ${statement.degrees} ${numberLabel(statement.degrees, 'degree', 'degrees')}` };
      case 'repeat':
        return { text: `Repeat ${statement.times} ${numberLabel(statement.times, 'time', 'times')}`, children: buildLines(statement.body) };
      case 'motorRunForRotations':
        return { text: `Run the motor ${motorDirectionText(statement.direction)} for ${statement.value} ${String(statement.unit || 'ROTATIONS').toLowerCase()}` };
      case 'dataVariableSet':
        return {
          text: `Set variable ${statement.name} to ${statement.valueType === 'text' ? `"${statement.value}"` : statement.value}`,
        };
      case 'dataVariableChangeBy':
        return { text: `Change variable ${statement.name} by ${statement.value}` };
      case 'if':
        return { text: `If ${expressionToText(statement.condition)}`, children: buildLines(statement.body) };
      case 'waitUntil':
        return { text: `Wait until ${expressionToText(statement.condition)}` };
      case 'startMove':
        return { text: `Start moving ${directionText(statement.direction)}` };
      case 'stopMove':
        return { text: 'Stop moving' };
      case 'playSound':
        return { text: `Play sound of ${statement.soundLabel || statement.sound}` };
      case 'genericStatement':
        return {
          text: statement.label || 'Unknown step',
          children: (statement.branches || []).flatMap((branch) => {
            const line = branchToLine(branch);
            return Array.isArray(line) ? line : [line];
          }),
        };
      case 'unknownStatement':
      default:
        return { text: statement.label || 'Unknown step' };
    }
  }

  function buildLines(statements) {
    return (statements || []).map(statementToLine);
  }

  function linesToText(lines, prefix = '') {
    return lines.flatMap((line, index) => {
      const currentPrefix = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
      const own = `${currentPrefix}: ${line.text}`;
      const nested = line.children?.length ? [linesToText(line.children, currentPrefix)] : [];
      return [own, ...nested];
    }).join('\n');
  }

  function getChildContainers(statement) {
    if (!statement) return [];
    if (statement.kind === 'repeat' || statement.kind === 'if') {
      return [{ name: 'BODY', body: statement.body || [] }];
    }
    if (statement.kind === 'genericStatement') {
      return (statement.branches || []).map((branch) => ({ name: branch.name, body: branch.body || [] }));
    }
    return [];
  }

  function clonePath(path) {
    return (path || []).map((segment) => ({ ...segment }));
  }

  function getStatementsAtPath(scriptIndex, path) {
    let statements = state.ast?.scripts?.[scriptIndex]?.body;
    if (!statements) return null;

    for (const segment of path || []) {
      const statement = statements[segment.statementIndex];
      if (!statement) return null;

      if (segment.childName === 'BODY') {
        statement.body = statement.body || [];
        statements = statement.body;
        continue;
      }

      statement.branches = statement.branches || [];
      let branch = statement.branches.find((item) => item.name === segment.childName);
      if (!branch) {
        branch = { name: segment.childName, body: [] };
        statement.branches.push(branch);
      }
      branch.body = branch.body || [];
      statements = branch.body;
    }

    return statements;
  }

  function buildContainerLabel(scriptIndex, path) {
    if (!path?.length) {
      const triggerText = triggerToText(state.ast?.scripts?.[scriptIndex]?.trigger);
      return `Skrypt ${scriptIndex + 1}: ${triggerText}`;
    }

    const labels = [`Skrypt ${scriptIndex + 1}`];
    let statements = state.ast?.scripts?.[scriptIndex]?.body || [];

    path.forEach((segment) => {
      const statement = statements?.[segment.statementIndex];
      if (!statement) return;
      const line = statementToLine(statement);
      if (segment.childName === 'BODY') {
        labels.push(`wewnątrz "${line.text}"`);
        statements = statement.body || [];
        return;
      }
      const branchText = branchNameToText(segment.childName);
      if (!branchText) {
        labels.push(`wewnątrz "${line.text}"`);
      } else {
        labels.push(`${branchText.toLowerCase()} – "${line.text}"`);
      }
      const branch = (statement.branches || []).find((item) => item.name === segment.childName);
      statements = branch?.body || [];
    });

    return labels.join(', ');
  }

  function buildInsertionPoints() {
    if (!state.ast?.scripts?.length) return [];

    const points = [];

    function visitContainer(statements, scriptIndex, path) {
      const containerLabel = buildContainerLabel(scriptIndex, path);
      points.push({
        scriptIndex,
        path: clonePath(path),
        index: 0,
        label: statements.length
          ? `${containerLabel}, przed "${statementToLine(statements[0]).text}"`
          : `${containerLabel}, pusty blok`,
      });

      statements.forEach((statement, statementIndex) => {
        getChildContainers(statement).forEach((child) => {
          visitContainer(child.body, scriptIndex, [
            ...clonePath(path),
            { statementIndex, childName: child.name },
          ]);
        });

        const nextStatement = statements[statementIndex + 1];
        points.push({
          scriptIndex,
          path: clonePath(path),
          index: statementIndex + 1,
          label: nextStatement
            ? `${containerLabel}, przed "${statementToLine(nextStatement).text}"`
            : `${containerLabel}, po "${statementToLine(statement).text}"`,
        });
      });
    }

    state.ast.scripts.forEach((script, scriptIndex) => {
      visitContainer(script.body || [], scriptIndex, []);
    });

    return points;
  }

  function samePath(first, second) {
    const a = first || [];
    const b = second || [];
    if (a.length !== b.length) return false;
    return a.every((step, index) => (
      step.statementIndex === b[index].statementIndex && step.childName === b[index].childName
    ));
  }

  function getCurrentInsertionPoint() {
    if (state.editor.insertionIndex < 0) return null;
    return state.editor.insertionPoints[state.editor.insertionIndex] || null;
  }

  function canDeleteEmptyScriptAtPoint(point, statements) {
    return Boolean(
      point &&
      Array.isArray(statements) &&
      point.index === 0 &&
      !point.path?.length &&
      statements.length === 0 &&
      state.ast?.scripts?.[point.scriptIndex]
    );
  }

  function hasDeletableProjectCode() {
    return Boolean(
      state.ast && (
        (state.ast.scripts?.length || 0) > 0 ||
        (state.ast.metadata?.variables?.length || 0) > 0 ||
        (state.ast.metadata?.sounds?.length || 0) > 0
      )
    );
  }

  function updateEditorAvailability() {
    const hasProject = Boolean(state.ast);
    const pointCount = state.editor.insertionPoints.length;
    const currentPoint = getCurrentInsertionPoint();
    const currentStatements = currentPoint ? getStatementsAtPath(currentPoint.scriptIndex, currentPoint.path) : null;
    const canDelete = Boolean(
      (Array.isArray(currentStatements) && currentPoint && currentPoint.index > 0) ||
      canDeleteEmptyScriptAtPoint(currentPoint, currentStatements)
    );
    const canDeleteAll = hasDeletableProjectCode();

    ui.composeInput.disabled = !hasProject;
    ui.editorActions.forEach((button) => {
      const action = button.dataset.editorAction;
      if (action === 'insert') {
        button.disabled = !hasProject;
        return;
      }
      if (action === 'delete') {
        button.disabled = !hasProject || !canDelete;
        return;
      }
      if (action === 'delete-all') {
        button.disabled = !canDeleteAll;
        return;
      }
      if (action === 'up') {
        button.disabled = pointCount < 2 || state.editor.insertionIndex <= 0;
        return;
      }
      if (action === 'down') {
        button.disabled = pointCount < 2 || state.editor.insertionIndex >= pointCount - 1;
        return;
      }
      if (action === 'end') {
        button.disabled = pointCount < 1;
      }
    });
  }

  function updateInsertionPointLabel(options = {}) {
    const point = getCurrentInsertionPoint();
    if (!point) {
      const message = 'Otwórz projekt, aby wybrać, gdzie mają trafić nowe kroki.';
      ui.insertionLabel.textContent = message;
      ui.deleteStepButton.textContent = 'Usuń poprzedni krok';
      applyShortcutMetadata(ui.deleteStepButton, SHORTCUTS.delete);
      if (options.announce) announceInsertionPoint(message);
      updateEditorAvailability();
      return;
    }

    const targetStatements = getStatementsAtPath(point.scriptIndex, point.path);
    const canDeletePreviousStep = Array.isArray(targetStatements) && point.index > 0;
    const canDeleteEmptyScript = canDeleteEmptyScriptAtPoint(point, targetStatements);
    const nextStatement = targetStatements?.[point.index];
    const previousStatement = point.index > 0 ? targetStatements?.[point.index - 1] : null;
    const containerLabel = buildContainerLabel(point.scriptIndex, point.path);
    const scriptText = `Skrypt ${point.scriptIndex + 1}`;
    const relation = nextStatement ? 'przed' : previousStatement ? 'po' : 'przy';
    const containerContext = containerLabel.replace(/^Skrypt\s+\d+\s*[:,]?\s*/i, '');
    const targetText = nextStatement
      ? `“${statementToLine(nextStatement).text}”`
      : previousStatement
        ? `“${statementToLine(previousStatement).text}”`
        : `${containerContext || 'Punkt wstawiania'} (pusty blok)`;
    const scriptStrong = document.createElement('strong');
    scriptStrong.textContent = scriptText;
    const targetStrong = document.createElement('strong');
    targetStrong.textContent = targetText;
    ui.insertionLabel.replaceChildren(
      document.createTextNode('Wstawianie w '),
      scriptStrong,
      document.createTextNode(` ${relation}: `),
      targetStrong
    );

    ui.deleteStepButton.textContent = canDeleteEmptyScript
      ? 'Usuń pusty blok początkowy'
      : 'Usuń poprzedni krok';
    applyShortcutMetadata(ui.deleteStepButton, SHORTCUTS.delete);

    const deleteContext = canDeletePreviousStep
      ? 'Usunięcie usuwa krok znajdujący się przed tym punktem wstawiania.'
      : canDeleteEmptyScript
        ? `Usunięcie usuwa pusty początkowy blok ${triggerToText(state.ast?.scripts?.[point.scriptIndex]?.trigger)}.`
        : 'Nie ma tu poprzedniego kroku do usunięcia.';
    const announcement = `Wstawianie w ${scriptText} ${relation}: ${targetText}. ${deleteContext}`;
    if (options.announce) announceInsertionPoint(announcement);
    updateEditorAvailability();
  }

  function refreshInsertionPoints(preferredPoint = null) {
    const nextPoints = buildInsertionPoints();
    state.editor.insertionPoints = nextPoints;

    if (!nextPoints.length) {
      state.editor.insertionIndex = -1;
      updateInsertionPointLabel();
      return;
    }

    let nextIndex = nextPoints.length - 1;
    if (preferredPoint) {
      const found = nextPoints.findIndex((point) => (
        point.scriptIndex === preferredPoint.scriptIndex &&
        point.index === preferredPoint.index &&
        samePath(point.path, preferredPoint.path)
      ));
      if (found >= 0) nextIndex = found;
    } else if (state.editor.insertionIndex >= 0 && state.editor.insertionIndex < nextPoints.length) {
      nextIndex = state.editor.insertionIndex;
    }

    state.editor.insertionIndex = nextIndex;
    updateInsertionPointLabel();
  }

  function moveInsertionPoint(delta) {
    if (!state.editor.insertionPoints.length) return;
    state.editor.insertionIndex = Math.max(
      0,
      Math.min(state.editor.insertionPoints.length - 1, state.editor.insertionIndex + delta)
    );
    updateInsertionPointLabel({ announce: true });
  }

  function moveInsertionPointToEnd() {
    if (!state.editor.insertionPoints.length) return;
    state.editor.insertionIndex = state.editor.insertionPoints.length - 1;
    updateInsertionPointLabel({ announce: true });
  }

  function renderCodeLines() {
    const fragment = document.createDocumentFragment();
    state.lines.forEach((line, index) => {
      const lineElement = document.createElement('span');
      lineElement.className = 'tadroid-text-line';
      lineElement.dataset.speechLine = String(index);
      lineElement.textContent = line || '\u00a0';
      fragment.appendChild(lineElement);
    });
    ui.text.replaceChildren(fragment);
  }

  function setSpeechLineHighlight(index = -1) {
    const currentLine = ui.text.querySelector('.tadroid-text-line-active');
    if (currentLine) {
      currentLine.classList.remove('tadroid-text-line-active');
      currentLine.removeAttribute('aria-current');
    }

    if (!Number.isInteger(index) || index < 0) return;
    const nextLine = ui.text.querySelector(`[data-speech-line="${index}"]`);
    if (!nextLine) return;
    nextLine.classList.add('tadroid-text-line-active');
    nextLine.setAttribute('aria-current', 'true');
    nextLine.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function updateSpeechButton() {
    if (ui.speakButton) {
      const isActive = state.speech.active;
      ui.speakButton.textContent = isActive ? 'Przerwij' : 'Czytaj';
      ui.speakButton.setAttribute('aria-label', isActive ? 'Przerwij czytanie kodu' : 'Czytaj kod');
      ui.speakButton.setAttribute('aria-pressed', String(isActive));
      applyShortcutMetadata(ui.speakButton, SHORTCUTS.speak);
    }
    if (ui.pauseButton) {
      const isPaused = state.speech.paused;
      ui.pauseButton.textContent = isPaused ? 'Wznów' : 'Pauza';
      ui.pauseButton.setAttribute('aria-label', isPaused ? 'Wznów czytanie kodu' : 'Wstrzymaj czytanie kodu');
      ui.pauseButton.setAttribute('aria-pressed', String(isPaused));
      applyShortcutMetadata(ui.pauseButton, SHORTCUTS.pause);
    }
  }

  function updateMetaText() {
    if (!state.ast) return;
    const scripts = state.ast.scripts || [];
    ui.meta.textContent = `Projekt: ${state.ast.name}. Znalezione skrypty: ${scripts.length}.`;
  }

  function renderProject(project, options = {}) {
    if (state.speech.active) cancelSpeech();
    state.project = cloneJson(project);
    state.ast = window.LecpAdapter.projectToAst(project);
    const scripts = state.ast.scripts || [];
    const chunks = [];
    scripts.forEach((script, index) => {
      chunks.push(`Script ${index + 1}: ${triggerToText(script.trigger)}`);
      chunks.push(linesToText(buildLines(script.body)) || 'No steps in this script.');
    });
    state.text = chunks.join('\n\n').trim();
    state.lines = state.text.split(/\n/);
    updateMetaText();
    if (state.text) {
      renderCodeLines();
    } else {
      ui.text.textContent = 'Brak dostępnego kodu.';
    }
    refreshInsertionPoints(options.preferredPoint || null);
    if (state.ast) {
      setStatus('Zsynchronizowano z obszarem roboczym.');
    }
    updateLessonActionAvailability();
  }

  function populateVoices() {
    if (!('speechSynthesis' in window)) {
      ui.voice.innerHTML = '<option>Mowa nieobsługiwana</option>';
      return;
    }
    const voices = speechSynthesis.getVoices();
    ui.voice.innerHTML = '';
    voices.forEach((voice, index) => {
      const option = document.createElement('option');
      option.value = String(index);
      option.textContent = `${voice.name} (${voice.lang})`;
      ui.voice.appendChild(option);
    });
    if (!voices.length) {
      const option = document.createElement('option');
      option.textContent = 'Brak dostępnych głosów';
      ui.voice.appendChild(option);
    }
  }

  function cancelSpeech() {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    if (state.speech.timeoutId) {
      clearTimeout(state.speech.timeoutId);
      state.speech.timeoutId = null;
    }
    state.speech.active = false;
    state.speech.paused = false;
    state.speech.skipPending = false;
    state.speech.skipToIndex = null;
    setSpeechLineHighlight();
    updateSpeechButton();
  }

  function getCurrentVoice() {
    const voices = speechSynthesis.getVoices();
    return voices[Number(ui.voice.value)] || null;
  }

  function getSpeechPause(line) {
    if (!line.trim()) return 450;
    if (/^Project:/i.test(line)) return 650;
    if (/^Script\s+\d+:/i.test(line)) return 650;
    return 250;
  }

  function speakNextLine() {
    if (!state.speech.active) return;
    if (state.speech.index >= state.lines.length) {
      cancelSpeech();
      return;
    }
    const line = state.lines[state.speech.index];
    const pauseMs = getSpeechPause(line);
    if (!line.trim()) {
      setSpeechLineHighlight();
      state.speech.index += 1;
      state.speech.timeoutId = setTimeout(speakNextLine, pauseMs);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(line);
    setSpeechLineHighlight(state.speech.index);
    utterance.rate = Number(ui.rate.value);
    const voice = getCurrentVoice();
    if (voice) utterance.voice = voice;
    utterance.onend = () => {
      if (!state.speech.active) return;
      setSpeechLineHighlight();
      if (state.speech.skipPending) {
        state.speech.index = state.speech.skipToIndex ?? state.speech.index + 1;
        state.speech.skipPending = false;
        state.speech.skipToIndex = null;
        state.speech.timeoutId = setTimeout(speakNextLine, 50);
        return;
      }
      state.speech.index += 1;
      state.speech.timeoutId = setTimeout(speakNextLine, pauseMs);
    };
    utterance.onerror = () => {
      if (!state.speech.active) return;
      setSpeechLineHighlight();
      if (state.speech.skipPending) {
        state.speech.index = state.speech.skipToIndex ?? state.speech.index + 1;
        state.speech.skipPending = false;
        state.speech.skipToIndex = null;
        state.speech.timeoutId = setTimeout(speakNextLine, 50);
        return;
      }
      state.speech.index += 1;
      state.speech.timeoutId = setTimeout(speakNextLine, pauseMs);
    };
    speechSynthesis.speak(utterance);
  }

  function startSpeech() {
    if (!state.text) return;
    if (!('speechSynthesis' in window)) {
      setStatus('Ta przeglądarka nie obsługuje mowy.');
      return;
    }
    cancelSpeech();
    state.speech.active = true;
    state.speech.paused = false;
    state.speech.index = 0;
    state.speech.skipPending = false;
    state.speech.skipToIndex = null;
    updateSpeechButton();
    speakNextLine();
  }

  function pauseSpeech() {
    if (!('speechSynthesis' in window) || !state.speech.active) return;
    if (speechSynthesis.paused) {
      speechSynthesis.resume();
      state.speech.paused = false;
    } else if (speechSynthesis.speaking) {
      speechSynthesis.pause();
      state.speech.paused = true;
    }
    updateSpeechButton();
  }

  function previousLine() {
    if (!('speechSynthesis' in window) || !state.speech.active) return;
    if (state.speech.timeoutId) {
      clearTimeout(state.speech.timeoutId);
      state.speech.timeoutId = null;
    }
    let targetIndex = state.speech.index - 1;
    while (targetIndex >= 0 && !state.lines[targetIndex]?.trim()) {
      targetIndex -= 1;
    }
    if (targetIndex < 0) {
      targetIndex = state.lines.findIndex((line) => Boolean(line.trim()));
      if (targetIndex < 0) targetIndex = 0;
    }
    const isSpeaking = speechSynthesis.speaking || speechSynthesis.paused;
    if (isSpeaking) {
      state.speech.skipPending = true;
      state.speech.skipToIndex = targetIndex;
      state.speech.paused = false;
      setSpeechLineHighlight();
      speechSynthesis.cancel();
      updateSpeechButton();
      return;
    }
    state.speech.index = targetIndex;
    state.speech.paused = false;
    updateSpeechButton();
    state.speech.timeoutId = setTimeout(speakNextLine, 50);
  }

  function skipLine() {
    if (!('speechSynthesis' in window) || !state.speech.active) return;
    if (state.speech.timeoutId) {
      clearTimeout(state.speech.timeoutId);
      state.speech.timeoutId = null;
    }
    let targetIndex = state.speech.index + 1;
    while (targetIndex < state.lines.length && !state.lines[targetIndex]?.trim()) {
      targetIndex += 1;
    }
    const isSpeaking = speechSynthesis.speaking || speechSynthesis.paused;
    if (isSpeaking) {
      state.speech.skipPending = true;
      state.speech.skipToIndex = targetIndex;
      state.speech.paused = false;
      setSpeechLineHighlight();
      speechSynthesis.cancel();
      updateSpeechButton();
      return;
    }
    state.speech.index = targetIndex;
    state.speech.paused = false;
    updateSpeechButton();
    state.speech.timeoutId = setTimeout(speakNextLine, 50);
  }

  function requestProject(options = {}) {
    window.dispatchEvent(new CustomEvent(REQUEST_EVENT, { detail: options }));
  }

  function requestProjectApply(project) {
    window.dispatchEvent(new CustomEvent(APPLY_EVENT, { detail: project }));
  }

  function capitalize(text) {
    return text ? text.charAt(0).toUpperCase() + text.slice(1).toLowerCase() : '';
  }

  function normalizeSoundKey(name) {
    return String(name || '').trim().toLowerCase().replace(/[\s_-]+/g, '');
  }

  let soundLookupCache = null;

  function normalizeSoundName(name) {
    if (!soundLookupCache) {
      soundLookupCache = new Map(getAvailableSounds().map((sound) => [normalizeSoundKey(sound), sound]));
    }
    return soundLookupCache.get(normalizeSoundKey(name)) || '';
  }

  function parseArrowKeyName(value) {
    const normalized = String(value || '').trim().toLowerCase();
    return {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight',
    }[normalized] || '';
  }

  function parseComparisonOperator(value) {
    const normalized = String(value || '').trim().toLowerCase();
    if (normalized === 'is greater than' || normalized === 'greater than' || normalized === '>') return '>';
    if (normalized === 'is less than' || normalized === 'less than' || normalized === '<') return '<';
    if (normalized === 'is equal to' || normalized === 'equal to' || normalized === '=') return '=';
    return '';
  }

  function parseSensorNumericSource(value) {
    const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (normalized === 'reflection' || normalized === 'the color sensor reflection') return { type: 'reflection', label: 'reflection' };
    if (normalized === 'hue' || normalized === 'the color sensor hue') return { type: 'hsb', option: 'HUE', label: 'hue' };
    if (normalized === 'saturation' || normalized === 'the color sensor saturation') return { type: 'hsb', option: 'SATURATION', label: 'saturation' };
    if (normalized === 'brightness' || normalized === 'the color sensor brightness') return { type: 'hsb', option: 'VALUE', label: 'brightness' };
    const match = normalized.match(/^(?:the\s+)?(left|right)\s+lever\s+(angle|position)$/);
    if (match) {
      return {
        type: match[2] === 'angle' ? 'leverAngle' : 'leverPosition',
        lever: match[1].toUpperCase(),
        label: `${match[1]} lever ${match[2]}`,
      };
    }
    return null;
  }

  function parseNumericReporterSource(value) {
    const sensor = parseSensorNumericSource(value);
    if (sensor) return sensor;
    const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    if (normalized === 'yaw angle' || normalized === 'double motor yaw angle' || normalized === 'the double motor yaw angle in degrees') return { type: 'yawPitchRoll', option: 'yaw', label: 'yaw angle' };
    if (normalized === 'pitch angle' || normalized === 'double motor pitch angle' || normalized === 'the double motor pitch angle in degrees') return { type: 'yawPitchRoll', option: 'pitch', label: 'pitch angle' };
    if (normalized === 'roll angle' || normalized === 'double motor roll angle' || normalized === 'the double motor roll angle in degrees') return { type: 'yawPitchRoll', option: 'roll', label: 'roll angle' };
    let match = normalized.match(/^(?:the\s+double\s+motor\s+)?(accelerometer|gyroscope)\s+on\s+(?:the\s+)?([xyz])\s+axis$/);
    if (match) {
      return { type: 'advancedMotion', option: match[1].toUpperCase(), axis: match[2], label: `${match[1]} on ${match[2]} axis` };
    }
    return null;
  }

  function parseMotorAcceleration(value) {
    const normalized = String(value || '').trim().toLowerCase();
    return ({ fast: 'FAST', normal: 'NORMAL', slow: 'SLOW' })[normalized] || '';
  }

  function parseEndState(value) {
    const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    return ({ 'smart brake': 'Smart_brake', 'smart coast': 'Smart_coast', brake: 'Brake', coast: 'Coast', hold: 'Hold', continue: 'Continue' })[normalized] || '';
  }

  function parseTiltDirection(value) {
    const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    return ({ any: '-1', flat: '0', down: '1', left: '2', 'upside down': '3', up: '4', right: '5' })[normalized] || '';
  }

  function parseColorValue(value) {
    const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    return ({
      red: '1',
      yellow: '2',
      blue: '3',
      teal: '4',
      green: '5',
      purple: '6',
      white: '7',
      'no colour': '0',
      'no color': '0',
      'any colour': '-1',
      'any color': '-1',
    })[normalized] || '';
  }

  function parseLeverDirection(value) {
    const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    return ({ up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT' })[normalized] || '';
  }

  function parseMotorGesture(value) {
    const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    return ({ clockwise: 'Cw', counterclockwise: 'Ccw' })[normalized] || '';
  }

  function parseMathFunction(value) {
    const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    return ({ round: 'ROUND', 'absolute value': 'ABS', absolute: 'ABS', 'round down': 'FLOOR', floor: 'FLOOR', 'round up': 'CEILING', ceiling: 'CEILING', ceil: 'CEILING', 'square root': 'SQRT', sqrt: 'SQRT', sine: 'SIN', cosine: 'COS', tangent: 'TAN' })[normalized] || '';
  }

  function parseNumericComparison(text, prefix) {
    const escapedPrefix = String(prefix || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const match = String(text || '').trim().match(new RegExp(`^${escapedPrefix}\\s+(.+?)\\s+(is greater than|is less than|is equal to|>|<|=)\\s+([\\d.-]+)$`, 'i'));
    if (!match) return null;
    const source = parseNumericReporterSource(match[1]);
    const operator = parseComparisonOperator(match[2]);
    if (!source || !operator) return null;
    return { source, operator, value: Number(match[3]) };
  }

  function parseBooleanReporterExpression(text) {
    const normalized = String(text || '').trim().toLowerCase().replace(/\s+/g, ' ');
    let match = normalized.match(/^(?:the\s+)?(up|down|left|right)\s+key\s+is\s+pressed$/);
    if (match) {
      const key = parseArrowKeyName(match[1]);
      if (key) return { type: 'keyPressed', key };
    }
    match = normalized.match(/^the\s+color\s+sensor\s+detects\s+(.+)$/);
    if (match) {
      const color = parseColorValue(match[1]);
      if (color) return { type: 'colorDetected', color, label: match[1].trim() };
    }
    match = normalized.match(/^the\s+(left|right)\s+lever\s+is\s+pushed\s+(up|down|left|right)$/);
    if (match) {
      const option = parseLeverDirection(match[2]);
      if (option) return { type: 'leverDirection', lever: match[1].toUpperCase(), option, label: `${match[1]} ${match[2]}` };
    }
    match = normalized.match(/^the\s+double\s+motor\s+is\s+tilted\s+(any|flat|down|left|upside down|up|right)$/);
    if (match) {
      const option = parseTiltDirection(match[1]);
      if (option) return { type: 'tilted', option, label: match[1].trim() };
    }
    match = normalized.match(/^the\s+motor\s+detects\s+a\s+(clockwise|counterclockwise)\s+gesture$/);
    if (match) {
      const gesture = parseMotorGesture(match[1]);
      if (gesture) return { type: 'motorGesture', gesture, label: match[1].trim() };
    }
    match = normalized.match(/^the\s+(left|right)\s+motor\s+detects\s+a\s+(clockwise|counterclockwise)\s+gesture$/);
    if (match) {
      const gesture = parseMotorGesture(match[2]);
      if (gesture) return { type: 'doubleMotorGesture', motor: match[1].toUpperCase(), gesture, label: `${match[1]} ${match[2]}` };
    }
    return null;
  }

  function makeShadowNumberBlock(value) {
    return {
      type: 'ShadowNumber',
      id: window.LecpAdapter.createId(),
      fields: { NUMBER: Number(value) },
    };
  }

  function makeShadowTextBlock(value) {
    return {
      type: 'ShadowText',
      id: window.LecpAdapter.createId(),
      fields: { TEXT: String(value) },
    };
  }

  function makeShadowSoundBlock(value) {
    return {
      type: 'soundShadow',
      id: window.LecpAdapter.createId(),
      fields: { VALUE: normalizeSoundName(value) || String(value) },
    };
  }

  function makeMessageShadowBlock(value) {
    return {
      type: 'MessageMenuShadow',
      id: window.LecpAdapter.createId(),
      fields: { VALUE: String(value) },
    };
  }

  function makeGenericReporterBlock(type, fields = {}, inputs = {}) {
    return {
      type,
      id: window.LecpAdapter.createId(),
      ...(Object.keys(fields).length ? { fields } : {}),
      ...(Object.keys(inputs).length ? { inputs } : {}),
    };
  }

  function makeVariableReference(name, type) {
    return { id: window.LecpAdapter.createId(), name: String(name), type };
  }

  const makeInputState = window.LecpAdapter.makeInputState;

  function makeGenericStatement(rawBlock, branches = []) {
    return {
      kind: 'genericStatement',
      id: rawBlock.id || window.LecpAdapter.createId(),
      label: window.LecpAdapter.describeBlock(rawBlock, { omitBodyInputs: true }),
      branches,
      rawBlock,
    };
  }

  function ensureProjectVariable(name, type) {
    if (!state.ast) return makeVariableReference(name, type);
    state.ast.metadata = state.ast.metadata || {};
    state.ast.metadata.variables = state.ast.metadata.variables || [];
    const existing = state.ast.metadata.variables.find((entry) => (
      String(entry?.name || '').toLowerCase() === String(name || '').toLowerCase() &&
      String(entry?.type || '') === String(type || '')
    ));
    if (existing) return existing;
    const created = makeVariableReference(name, type);
    state.ast.metadata.variables.push(created);
    return created;
  }

  function parsePlainCommandText(text) {
    const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    const commands = [];
    const errors = [];

    lines.forEach((line, index) => {
      const cleaned = line.replace(/[.!?]+$/, '').trim();
      const lower = cleaned.toLowerCase();
      let match = null;

      match = lower.match(/^move\s+(forward|backward)\s+for\s+([\d.]+)\s+(step|steps|rotation|rotations)$/);
      if (match) {
        commands.push({ type: 'move', direction: capitalize(match[1]), value: Number(match[2]) });
        return;
      }

      match = lower.match(/^turn\s+(left|right)\s+for\s+([\d.]+)\s+(degree|degrees)$/);
      if (match) {
        commands.push({ type: 'turn', direction: capitalize(match[1]), degrees: Number(match[2]) });
        return;
      }

      match = lower.match(/^start\s+moving\s+(forward|backward)$/);
      if (match) {
        commands.push({ type: 'startMove', direction: capitalize(match[1]) });
        return;
      }

      if (lower === 'stop moving') {
        commands.push({ type: 'stopMove' });
        return;
      }

      match = cleaned.match(/^write\s+"([^"]+)"$/i);
      if (match) {
        commands.push({ type: 'dataWrite', message: match[1] });
        return;
      }

      if (lower === 'write answer') {
        commands.push({ type: 'dataWriteAnswer' });
        return;
      }

      if (lower === 'write timer') {
        commands.push({ type: 'dataWriteTimer' });
        return;
      }

      match = cleaned.match(/^write\s+length\s+of\s+"([^"]+)"$/i);
      if (match) {
        commands.push({ type: 'dataWriteLength', text: match[1] });
        return;
      }

      match = cleaned.match(/^write\s+"([^"]+)"\s+in\s+"([^"]+)"$/i);
      if (match) {
        commands.push({ type: 'dataWriteContains', substring: match[1], word: match[2] });
        return;
      }

      match = cleaned.match(/^write\s+letter\s+([\d.]+)\s+of\s+"([^"]+)"$/i);
      if (match) {
        commands.push({ type: 'dataWriteLetterOf', index: Number(match[1]), word: match[2] });
        return;
      }

      match = cleaned.match(/^set\s+variable\s+([a-z0-9_ -]+)\s+to\s+"([^"]*)"$/i);
      if (match) {
        commands.push({ type: 'dataVariableSet', name: match[1].trim(), value: match[2], valueType: 'text' });
        return;
      }

      match = lower.match(/^set\s+variable\s+([a-z0-9_ -]+)\s+to\s+([\d.-]+)$/);
      if (match) {
        commands.push({ type: 'dataVariableSet', name: match[1].trim(), value: Number(match[2]), valueType: 'number' });
        return;
      }

      match = lower.match(/^change\s+variable\s+([a-z0-9_ -]+)\s+by\s+([\d.-]+)$/);
      if (match) {
        commands.push({ type: 'dataVariableChangeBy', name: match[1].trim(), value: Number(match[2]) });
        return;
      }

      match = lower.match(/^write\s+variable\s+([a-z0-9_ -]+)$/);
      if (match) {
        commands.push({ type: 'dataWriteVariable', name: match[1].trim() });
        return;
      }

      const writeComparison = parseNumericComparison(cleaned, 'write');
      if (writeComparison) {
        commands.push({ type: 'dataWriteBooleanCompare', ...writeComparison });
        return;
      }

      match = cleaned.match(/^write\s+(.+)$/i);
      if (match) {
        const expression = parseBooleanReporterExpression(match[1]);
        if (expression) {
          commands.push({ type: 'dataWriteBooleanExpression', expression });
          return;
        }

        const sensorSource = parseSensorNumericSource(match[1]);
        if (sensorSource) {
          commands.push({ type: 'dataWriteSensorValue', source: sensorSource });
          return;
        }

        const reporterSource = parseNumericReporterSource(match[1]);
        if (reporterSource) {
          commands.push({ type: 'dataWriteSensorValue', source: reporterSource });
          return;
        }
      }

      match = cleaned.match(/^write\s+(round|absolute value|absolute|round down|round up|ceiling|ceil|floor|square root|sqrt|sine|cosine|tangent)\s+of\s+(.+)$/i);
      if (match) {
        const fun = parseMathFunction(match[1]);
        const source = parseNumericReporterSource(match[2]);
        const value = Number(match[2]);
        if (fun && (source || Number.isFinite(value))) {
          commands.push({ type: 'dataWriteMathFunction', fun, source, value: Number.isFinite(value) ? value : null, label: match[1].trim() });
          return;
        }
      }

      match = cleaned.match(/^add\s+"([^"]*)"\s+to\s+list\s+([a-z0-9_ -]+)$/i);
      if (match) {
        commands.push({ type: 'dataListAddText', value: match[1], listName: match[2].trim() });
        return;
      }

      match = lower.match(/^add\s+answer\s+to\s+list\s+([a-z0-9_ -]+)$/);
      if (match) {
        commands.push({ type: 'dataListAddAnswer', listName: match[1].trim() });
        return;
      }

      match = lower.match(/^delete\s+all\s+of\s+list\s+([a-z0-9_ -]+)$/);
      if (match) {
        commands.push({ type: 'dataListClear', listName: match[1].trim() });
        return;
      }

      match = lower.match(/^write\s+item\s+([\d.]+)\s+of\s+list\s+([a-z0-9_ -]+)$/);
      if (match) {
        commands.push({ type: 'dataWriteListItem', index: Number(match[1]), listName: match[2].trim() });
        return;
      }

      match = lower.match(/^write\s+length\s+of\s+list\s+([a-z0-9_ -]+)$/);
      if (match) {
        commands.push({ type: 'dataWriteListLength', listName: match[1].trim() });
        return;
      }

      match = cleaned.match(/^ask\s+"([^"]+)"$/i);
      if (match) {
        commands.push({ type: 'dataAsk', message: match[1] });
        return;
      }

      match = lower.match(/^wait\s+([\d.]+)\s+seconds?$/);
      if (match) {
        commands.push({ type: 'controlWait', seconds: Number(match[1]) });
        return;
      }

      match = lower.match(/^repeat\s+([\d.]+)\s+times?$/);
      if (match) {
        commands.push({ type: 'controlRepeat', times: Number(match[1]) });
        return;
      }

      if (lower === 'repeat forever') {
        commands.push({ type: 'controlForever' });
        return;
      }

      match = lower.match(/^if\s+(up|down|left|right)\s+key\s+is\s+pressed$/);
      if (match) {
        commands.push({ type: 'controlIfKeyPressed', key: parseArrowKeyName(match[1]) });
        return;
      }

      const ifComparison = parseNumericComparison(cleaned, 'if');
      if (ifComparison) {
        commands.push({ type: 'controlIfSensorCompare', ...ifComparison });
        return;
      }

      match = lower.match(/^wait\s+until\s+(up|down|left|right)\s+key\s+is\s+pressed$/);
      if (match) {
        commands.push({ type: 'waitUntilKeyPressed', key: parseArrowKeyName(match[1]) });
        return;
      }

      const waitUntilComparison = parseNumericComparison(cleaned, 'wait until');
      if (waitUntilComparison) {
        commands.push({ type: 'waitUntilSensorCompare', ...waitUntilComparison });
        return;
      }

      match = lower.match(/^repeat\s+until\s+(up|down|left|right)\s+key\s+is\s+pressed$/);
      if (match) {
        commands.push({ type: 'controlRepeatUntilKeyPressed', key: parseArrowKeyName(match[1]) });
        return;
      }

      const repeatUntilComparison = parseNumericComparison(cleaned, 'repeat until');
      if (repeatUntilComparison) {
        commands.push({ type: 'controlRepeatUntilSensorCompare', ...repeatUntilComparison });
        return;
      }

      match = cleaned.match(/^if\s+the\s+double\s+motor\s+is\s+tilted\s+(any|flat|down|left|upside down|up|right)$/i);
      if (match) {
        const option = parseTiltDirection(match[1]);
        if (option) {
          commands.push({ type: 'controlIfTilted', option, label: match[1].trim() });
          return;
        }
      }

      match = cleaned.match(/^wait\s+until\s+the\s+double\s+motor\s+is\s+tilted\s+(any|flat|down|left|upside down|up|right)$/i);
      if (match) {
        const option = parseTiltDirection(match[1]);
        if (option) {
          commands.push({ type: 'waitUntilTilted', option, label: match[1].trim() });
          return;
        }
      }

      match = cleaned.match(/^repeat\s+until\s+the\s+double\s+motor\s+is\s+tilted\s+(any|flat|down|left|upside down|up|right)$/i);
      if (match) {
        const option = parseTiltDirection(match[1]);
        if (option) {
          commands.push({ type: 'controlRepeatUntilTilted', option, label: match[1].trim() });
          return;
        }
      }

      match = cleaned.match(/^start\s+(?:the\s+)?motor\s+at\s+power\s+([\d.-]+)%?$/i);
      if (match) { commands.push({ type: 'motorStartAtPower', value: Number(match[1]) }); return; }

      match = cleaned.match(/^start\s+(?:the\s+)?motor\s+(clockwise|counterclockwise)$/i);
      if (match) {
        const direction = parseMotorGesture(match[1]);
        if (direction) {
          commands.push({ type: 'motorStartDirection', direction });
          return;
        }
      }

      if (lower === 'stop the motor' || lower === 'stop motor') {
        commands.push({ type: 'motorStop' });
        return;
      }

      match = cleaned.match(/^set\s+(?:the\s+)?motor\s+speed\s+to\s+([\d.-]+)%?$/i);
      if (match) { commands.push({ type: 'motorSetSpeed', value: Number(match[1]) }); return; }

      match = cleaned.match(/^set\s+(?:the\s+)?motor\s+acceleration\s+to\s+(fast|normal|slow)$/i);
      if (match) { const value = parseMotorAcceleration(match[1]); if (value) { commands.push({ type: 'motorSetAcceleration', value }); return; } }

      match = cleaned.match(/^set\s+(?:the\s+)?motor\s+end\s+state\s+to\s+(smart brake|smart coast|brake|coast|hold|continue)$/i);
      if (match) { const endState = parseEndState(match[1]); if (endState) { commands.push({ type: 'motorSetEndstate', endState }); return; } }

      if (lower === 'reset the motor rotations counted' || lower === 'reset motor rotations counted') { commands.push({ type: 'motorSetRotationsCounted' }); return; }

      match = cleaned.match(/^run\s+(?:the\s+)?motor\s+(clockwise|counterclockwise)\s+for\s+([\d.-]+)\s+(rotation|rotations)$/i);
      if (match) {
        const direction = parseMotorGesture(match[1]);
        if (direction) {
          commands.push({
            type: 'motorRunForRotations',
            direction,
            unit: 'ROTATIONS',
            value: Number(match[2]),
          });
          return;
        }
      }

      match = cleaned.match(/^run\s+(?:the\s+)?(left|right)\s+motor\s+(clockwise|counterclockwise)\s+for\s+([\d.-]+)\s+(rotation|rotations)$/i);
      if (match) {
        const direction = parseMotorGesture(match[2]);
        if (direction) {
          commands.push({
            type: 'doubleMotorRunForRotations',
            motor: match[1].toUpperCase(),
            direction,
            unit: 'ROTATIONS',
            value: Number(match[3]),
          });
          return;
        }
      }

      match = cleaned.match(/^start\s+(?:the\s+)?(left|right)\s+motor\s+(clockwise|counterclockwise)$/i);
      if (match) {
        const direction = parseMotorGesture(match[2]);
        if (direction) {
          commands.push({
            type: 'doubleMotorStartDirection',
            motor: match[1].toUpperCase(),
            direction,
          });
          return;
        }
      }

      match = cleaned.match(/^stop\s+(?:the\s+)?(left|right)\s+motor$/i);
      if (match) {
        commands.push({
          type: 'doubleMotorStop',
          motor: match[1].toUpperCase(),
        });
        return;
      }

      match = cleaned.match(/^set\s+(?:the\s+)?(left|right)\s+motor\s+speed\s+to\s+([\d.-]+)%?$/i);
      if (match) {
        commands.push({
          type: 'doubleMotorSetSpeed',
          motor: match[1].toUpperCase(),
          value: Number(match[2]),
        });
        return;
      }

      match = cleaned.match(/^start\s+(?:the\s+)?(left|right)\s+motor\s+at\s+power\s+([\d.-]+)%?$/i);
      if (match) { commands.push({ type: 'doubleMotorStartAtPower', motor: match[1].toUpperCase(), value: Number(match[2]) }); return; }

      match = cleaned.match(/^set\s+(?:the\s+)?(left|right)\s+motor\s+acceleration\s+to\s+(fast|normal|slow)$/i);
      if (match) { const value = parseMotorAcceleration(match[2]); if (value) { commands.push({ type: 'doubleMotorSetAcceleration', motor: match[1].toUpperCase(), value }); return; } }

      match = cleaned.match(/^set\s+(?:the\s+)?(left|right)\s+motor\s+end\s+state\s+to\s+(smart brake|smart coast|brake|coast|hold|continue)$/i);
      if (match) { const endState = parseEndState(match[2]); if (endState) { commands.push({ type: 'doubleMotorSetEndstate', motor: match[1].toUpperCase(), endState }); return; } }

      match = cleaned.match(/^reset\s+(?:the\s+)?(left|right)\s+motor\s+rotations\s+counted$/i);
      if (match) { commands.push({ type: 'doubleMotorSetRotationsCounted', motor: match[1].toUpperCase() }); return; }

      match = cleaned.match(/^set\s+(?:the\s+)?turn\s+steering\s+to\s+([\d.-]+)$/i);
      if (match) { commands.push({ type: 'doubleMotorSetTurnSteering', value: Number(match[1]) }); return; }

      match = cleaned.match(/^start\s+driving\s+with\s+left\s+speed\s+([\d.-]+)%?\s+and\s+right\s+speed\s+([\d.-]+)%?$/i);
      if (match) { commands.push({ type: 'doubleMotorStartDualSpeed', left: Number(match[1]), right: Number(match[2]) }); return; }

      if (lower === 'reset the double motor yaw' || lower === 'reset double motor yaw') { commands.push({ type: 'doubleMotorResetYaw' }); return; }

      if (lower === 'stop this script') {
        commands.push({ type: 'controlStop', mode: 'STACK' });
        return;
      }

      if (lower === 'stop all scripts') {
        commands.push({ type: 'controlStop', mode: 'ALL' });
        return;
      }

      match = cleaned.match(/^send\s+message\s+"([^"]+)"\s+and\s+(wait|continue)$/i);
      if (match) {
        commands.push({ type: 'eventsSendMessage', message: match[1], option: match[2].toUpperCase() });
        return;
      }

      if (lower === 'when the program starts') {
        commands.push({ type: 'scriptProgramStart' });
        return;
      }

      if (lower === 'when the double motor is tapped') {
        commands.push({ type: 'scriptDoubleMotorTapped' });
        return;
      }

      match = lower.match(/^when\s+(up|down|left|right)\s+key\s+is\s+pressed$/);
      if (match) {
        commands.push({ type: 'scriptKeyPressed', key: parseArrowKeyName(match[1]) });
        return;
      }

      match = cleaned.match(/^when\s+message\s+"([^"]+)"\s+is\s+received$/i);
      if (match) {
        commands.push({ type: 'scriptMessageReceived', message: match[1] });
        return;
      }

      match = lower.match(/^when\s+the\s+color\s+sensor\s+detects\s+(.+)$/);
      if (match) {
        const colorName = match[1].trim();
        const color = parseColorValue(colorName);
        if (color === '') {
          errors.push(
            `Line ${index + 1}: "${line}"\nThe color "${colorName}" is not recognized.\nUse: When the color sensor detects red, yellow, blue, teal, green, purple, white, no color, or any color`
          );
          return;
        }
        commands.push({ type: 'scriptColorSensorWhenColor', color });
        return;
      }

      match = lower.match(/^play\s+sound(?:\s+of)?\s+variable\s+([a-z0-9_ -]+)$/);
      if (match) {
        commands.push({ type: 'playSoundVariable', name: match[1].trim() });
        return;
      }

      match = lower.match(/^play\s+sound(?:\s+of)?\s+(.+)$/);
      if (match) {
        const userSound = cleaned.replace(/^play\s+sound(?:\s+of)?\s+/i, '').trim();
        const sound = normalizeSoundName(userSound);
        if (!sound) {
          errors.push(
            `Line ${index + 1}: "${line}"\nThe sound "${userSound}" is not available.\nAvailable sounds: ${getAvailableSounds().join(', ')}`
          );
          return;
        }
        commands.push({ type: 'playSound', sound });
        return;
      }

      errors.push(describeCommandError(index, line, lower));
    });

    return { commands, errors };
  }

  function parseJsonComposerInput(text) {
    try {
      const parsed = JSON.parse(text);
      const result = window.LecpAdapter.parseJsonInput(parsed);
      const statements = result.statements || [];
      const scripts = result.scripts || [];

      if (!statements.length && !scripts.length) {
        return {
          statements: [],
          scripts: [],
          errors: ['The JSON did not contain a Blockly block, statement, or script that I can append.'],
        };
      }

      return { statements, scripts, errors: [] };
    } catch (error) {
      return {
        statements: [],
        scripts: [],
        errors: [`The JSON could not be parsed.\n${error.message}`],
      };
    }
  }

  function parseComposerInput(text) {
    const trimmed = text.trim();
    if (!trimmed) {
      return { statements: [], scripts: [], errors: [] };
    }

    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      return parseJsonComposerInput(trimmed);
    }

    const { commands, errors } = parsePlainCommandText(text);
    const statements = [];
    const scripts = [];
    let activeScript = null;

    commands.forEach((command) => {
      const script = commandToAstScript(command);
      if (script) {
        scripts.push(script);
        activeScript = script;
        return;
      }

      const statement = commandToAstStatement(command);
      if (statement) {
        if (activeScript) {
          activeScript.body = activeScript.body || [];
          activeScript.body.push(statement);
          return;
        }
        statements.push(statement);
        return;
      }

      activeScript = null;
    });

    return { statements, scripts, errors };
  }

  function describeCommandError(index, line, normalizedLine) {
    const samples = {
      move: 'The format is: "Move forward for 10 steps"',
      turn: 'The format is: "Turn left for 90 degrees"',
      startMove: 'The command should be: "Start moving forward" or "Start moving backward"',
      stopMove: 'Use "Stop moving"',
      dataWrite: 'Use: Write "Hello"',
      dataWriteAnswer: 'Use: "Write answer"',
      dataWriteTimer: 'Use: "Write timer"',
      dataWriteLength: 'Use: Write length of "Lego"',
      dataWriteContains: 'Use: Write "L" in "Lego"',
      dataWriteLetterOf: 'Use: Write letter 1 of "Lego"',
      dataVariableSet: 'Use: Set variable index to "1" or Set variable counter to 0',
      dataVariableChangeBy: 'Use: Change variable index by 1',
      dataWriteVariable: 'Use: Write variable index',
      dataWriteSensorValue: 'Use: Write reflection, Write hue, Write yaw angle, Write the color sensor reflection is equal to 50, Write the double motor is tilted up, Write the color sensor detects red, or Write the left lever is pushed up',
      dataWriteMathFunction: 'Use: Write round of 1.6 or Write absolute value of reflection',
      dataListAdd: 'Use: Add "Dog" to list my_sounds or Add answer to list my_sounds',
      dataListClear: 'Use: Delete all of list my_sounds',
      dataWriteListItem: 'Use: Write item 1 of list my_sounds',
      dataWriteListLength: 'Use: Write length of list my_sounds',
      dataAsk: 'Use: Ask "What is your name?"',
      controlWait: 'Use: "Wait 1 seconds"',
      controlRepeat: 'Use: "Repeat 3 times" or "Repeat forever"',
      controlIf: 'Use: "If left key is pressed" or "If reflection is greater than 50"',
      waitUntil: 'Use: "Wait until left key is pressed" or "Wait until brightness is less than 20"',
      repeatUntil: 'Use: "Repeat until left key is pressed" or "Repeat until right lever angle is equal to 0"',
      controlStop: 'Use: "Stop this script" or "Stop all scripts"',
      motor: 'Use: Start the motor at power 50, Start the motor clockwise, Stop the motor, Set the left motor acceleration to fast, Set the turn steering to 0, Start driving with left speed 50 and right speed 50, or Reset the double motor yaw',
      tilted: 'Use: If the double motor is tilted up, Wait until the double motor is tilted flat, or Repeat until the double motor is tilted right',
      eventSend: 'Use: Send message "up" and continue',
      eventScript: 'Use: "When the program starts", "When up key is pressed", "When the double motor is tapped", "When the color sensor detects red", or When message "up" is received',
      get playSound() {
        return `Use "Play sound of Dog" or "Play sound of variable sound". Available sounds: ${getAvailableSounds().join(', ')}`;
      },
      sensorCompare: 'Use: If reflection is greater than 50, Wait until hue is less than 30, or Repeat until left lever angle is equal to 0',
      generic: 'I can append supported movement, sound, data, control, and event commands in the correct format',
    };

    let reason = samples.generic;
    if (normalizedLine.startsWith('move ')) {
      reason = samples.move;
    } else if (normalizedLine.startsWith('turn ')) {
      reason = samples.turn;
    } else if (normalizedLine.startsWith('start moving')) {
      reason = samples.startMove;
    } else if (normalizedLine === 'stop moving' || normalizedLine.startsWith('stop moving ')) {
      reason = samples.stopMove;
    } else if (normalizedLine.startsWith('write ')) {
      if (normalizedLine === 'write answer') reason = samples.dataWriteAnswer;
      else if (normalizedLine === 'write timer') reason = samples.dataWriteTimer;
      else if (normalizedLine.startsWith('write variable ')) reason = samples.dataWriteVariable;
      else if (/^write\s+(.+)$/.test(normalizedLine) && (parseNumericComparison(normalizedLine, 'write') || parseBooleanReporterExpression(normalizedLine.replace(/^write\s+/, '')) || parseNumericReporterSource(normalizedLine.replace(/^write\s+/, '')))) reason = samples.dataWriteSensorValue;
      else if (/^write\s+(round|absolute value|absolute|round down|round up|ceiling|ceil|floor|square root|sqrt|sine|cosine|tangent)\s+of\s+/.test(normalizedLine)) reason = samples.dataWriteMathFunction;
      else if (normalizedLine.startsWith('write item ')) reason = samples.dataWriteListItem;
      else if (normalizedLine.startsWith('write length of list ')) reason = samples.dataWriteListLength;
      else if (normalizedLine.startsWith('write length of ')) reason = samples.dataWriteLength;
      else if (normalizedLine.startsWith('write letter ')) reason = samples.dataWriteLetterOf;
      else if (/^write\s+".+"\s+in\s+".+"$/.test(normalizedLine)) reason = samples.dataWriteContains;
      else reason = samples.dataWrite;
    } else if (normalizedLine.startsWith('set variable ')) {
      reason = samples.dataVariableSet;
    } else if (normalizedLine.startsWith('change variable ')) {
      reason = samples.dataVariableChangeBy;
    } else if (normalizedLine.startsWith('add ')) {
      reason = samples.dataListAdd;
    } else if (normalizedLine.startsWith('delete all of list ')) {
      reason = samples.dataListClear;
    } else if (normalizedLine.startsWith('ask ')) {
      reason = samples.dataAsk;
    } else if (normalizedLine.startsWith('wait ')) {
      reason = normalizedLine.startsWith('wait until ')
        ? (/^wait\s+until\s+(reflection|hue|saturation|brightness|left\s+lever\s+angle|right\s+lever\s+angle|left\s+lever\s+position|right\s+lever\s+position)\s+/.test(normalizedLine) ? samples.sensorCompare : samples.waitUntil)
        : samples.controlWait;
    } else if (normalizedLine.startsWith('repeat ')) {
      reason = normalizedLine.startsWith('repeat until ')
        ? (/^repeat\s+until\s+(reflection|hue|saturation|brightness|left\s+lever\s+angle|right\s+lever\s+angle|left\s+lever\s+position|right\s+lever\s+position)\s+/.test(normalizedLine) ? samples.sensorCompare : samples.repeatUntil)
        : samples.controlRepeat;
    } else if (normalizedLine.startsWith('if ')) {
      reason = /^if\s+(reflection|hue|saturation|brightness|left\s+lever\s+angle|right\s+lever\s+angle|left\s+lever\s+position|right\s+lever\s+position)\s+/.test(normalizedLine) ? samples.sensorCompare : samples.controlIf;
    } else if (/^(start\s+(?:the\s+)?motor|stop\s+(?:the\s+)?motor|set\s+(?:the\s+)?motor|reset\s+(?:the\s+)?motor|run\s+(?:the\s+)?motor|run\s+(?:the\s+)?(left|right)\s+motor|start\s+(?:the\s+)?(left|right)\s+motor|stop\s+(?:the\s+)?(left|right)\s+motor|set\s+(?:the\s+)?(left|right)\s+motor|reset\s+(?:the\s+)?(left|right)\s+motor|set\s+(?:the\s+)?turn\s+steering|start\s+driving\s+with\s+left\s+speed|reset\s+(?:the\s+)?double\s+motor\s+yaw)/.test(normalizedLine)) {
      reason = samples.motor;
    } else if (/^(if|wait until|repeat until)\s+the\s+double\s+motor\s+is\s+tilted\s+/.test(normalizedLine)) {
      reason = samples.tilted;
    } else if (normalizedLine.startsWith('stop ')) {
      reason = samples.controlStop;
    } else if (normalizedLine.startsWith('send message ')) {
      reason = samples.eventSend;
    } else if (normalizedLine.startsWith('when ')) {
      reason = samples.eventScript;
    } else if (normalizedLine.startsWith('play sound')) {
      reason = samples.playSound;
    }

    return `Linia ${index + 1}: "${line}"\n${reason}`;
  }

  function formatCommandErrors(errors) {
    const prefix = errors.length === 1 ? 'Nie zrozumiałem tego kroku:' : 'Nie zrozumiałem tych kroków:';
    return [prefix, ...errors.map((error) => `- ${error}`)].join('\n');
  }

  function makeNumericReporterBlock(source) {
    if (!source) return null;
    switch (source.type) {
      case 'yawPitchRoll':
        return makeGenericReporterBlock('DoubleMotorYawPitchRoll', { OPTION: source.option || 'yaw' });
      case 'advancedMotion':
        return makeGenericReporterBlock('DoubleMotorAdvancedMotion', { OPTION: source.option || 'ACCELEROMETER', AXIS: source.axis || 'x' });
      default:
        return makeSensorReporterBlock(source);
    }
  }

  function makeMathOperandInput(command) {
    if (command?.source) {
      const reporter = makeNumericReporterBlock(command.source);
      if (reporter) return makeInputState(reporter, null);
    }
    return makeInputState(null, makeShadowNumberBlock(command?.value ?? 0));
  }

  function makeTiltedExpression(command) {
    if (!command?.option) return null;
    return {
      kind: 'genericExpression',
      id: window.LecpAdapter.createId(),
      label: `double motor tilted ${command.label || command.option}`,
      rawBlock: makeGenericReporterBlock('DoubleMotorIsTilted', { OPTION: command.option }),
    };
  }

  function makeBooleanReporterExpression(expression) {
    if (!expression) return null;
    switch (expression.type) {
      case 'keyPressed':
        return {
          kind: 'keyPressedExpression',
          id: window.LecpAdapter.createId(),
          key: expression.key,
          rawBlock: makeGenericReporterBlock('EventsIsKeyPressed', { KEY: expression.key }),
        };
      case 'colorDetected':
        return {
          kind: 'genericExpression',
          id: window.LecpAdapter.createId(),
          label: `color sensor detects ${expression.label || expression.color}`,
          rawBlock: makeGenericReporterBlock('ColorSensorIsColor', { COLOR: expression.color }),
        };
      case 'leverDirection':
        return {
          kind: 'genericExpression',
          id: window.LecpAdapter.createId(),
          label: `${String(expression.lever || '').toLowerCase()} lever pushed ${String(expression.option || '').toLowerCase()}`,
          rawBlock: makeGenericReporterBlock('ControllerIsLever', { LEVER: expression.lever, OPTION: expression.option }),
        };
      case 'tilted':
        return makeTiltedExpression(expression);
      case 'motorGesture':
        return {
          kind: 'genericExpression',
          id: window.LecpAdapter.createId(),
          label: `motor detects ${expression.label || expression.gesture} gesture`,
          rawBlock: makeGenericReporterBlock('MotorIsGesture', { GESTURE: expression.gesture }),
        };
      case 'doubleMotorGesture':
        return {
          kind: 'genericExpression',
          id: window.LecpAdapter.createId(),
          label: `${String(expression.motor || '').toLowerCase()} motor detects ${expression.label || expression.gesture} gesture`,
          rawBlock: makeGenericReporterBlock('DoubleMotorIsGesture', { MOTOR: expression.motor, GESTURE: expression.gesture }),
        };
      default:
        return null;
    }
  }

  function makeSensorReporterBlock(source) {
    if (!source) return null;
    switch (source.type) {
      case 'reflection':
        return makeGenericReporterBlock('ColorSensorReflection');
      case 'hsb':
        return makeGenericReporterBlock('ColorSensorHsb', { OPTION: source.option || 'HUE' });
      case 'leverAngle':
        return makeGenericReporterBlock('ControllerAngle', { LEVER: source.lever || 'LEFT' });
      case 'leverPosition':
        return makeGenericReporterBlock('ControllerPosition', { LEVER: source.lever || 'LEFT' });
      default:
        return null;
    }
  }

  function makeSensorComparisonExpression(command) {
    if (!command?.source || !command?.operator) return null;
    if (command.source.type === 'reflection') {
      return {
        kind: 'genericExpression',
        id: window.LecpAdapter.createId(),
        label: `${command.source.label} ${command.operator} ${command.value}`,
        rawBlock: makeGenericReporterBlock('ColorSensorIsReflection', { COMPARATOR: command.operator }, {
          VALUE: makeInputState(null, makeShadowNumberBlock(command.value)),
        }),
      };
    }

    const reporter = makeNumericReporterBlock(command.source);
    if (!reporter) return null;
    return {
      kind: 'genericExpression',
      id: window.LecpAdapter.createId(),
      label: `${command.source.label} ${command.operator} ${command.value}`,
      rawBlock: makeGenericReporterBlock('OperatorsCompare', {
        OP: command.operator === '>' ? 'GT' : command.operator === '<' ? 'LT' : 'EQ',
      }, {
        A: makeInputState(reporter, null),
        B: makeInputState(null, makeShadowNumberBlock(command.value)),
      }),
    };
  }

  function commandToAstStatement(command) {
    const id = window.LecpAdapter.createId();
    switch (command.type) {
      case 'move':
        return { kind: 'move', id, direction: command.direction, value: command.value };
      case 'turn':
        return { kind: 'turn', id, direction: command.direction, degrees: command.degrees };
      case 'startMove':
        return { kind: 'startMove', id, direction: command.direction };
      case 'stopMove':
        return { kind: 'stopMove', id };
      case 'playSound':
        return { kind: 'playSound', id, sound: command.sound, option: 'CONTINUE' };
      case 'playSoundVariable': {
        const variableRef = ensureProjectVariable(command.name, 'Var');
        return makeGenericStatement({
          type: 'SoundPlaySound',
          id,
          fields: { OPTION: 'CONTINUE' },
          inputs: {
            SOUND: makeInputState(
              makeGenericReporterBlock('DataVariableGet', { LABEL: variableRef.name, VARIABLE: variableRef }),
              makeShadowSoundBlock('Dog')
            ),
          },
        });
      }
      case 'dataWrite':
        return makeGenericStatement({
          type: 'DataWrite',
          id,
          inputs: { MESSAGE: makeInputState(null, makeShadowTextBlock(command.message)) },
        });
      case 'dataWriteAnswer':
        return makeGenericStatement({
          type: 'DataWrite',
          id,
          inputs: { MESSAGE: makeInputState(makeGenericReporterBlock('DataAnswer'), makeShadowTextBlock('')) },
        });
      case 'dataWriteTimer':
        return makeGenericStatement({
          type: 'DataWrite',
          id,
          inputs: { MESSAGE: makeInputState(makeGenericReporterBlock('DataTimer'), makeShadowTextBlock('')) },
        });
      case 'dataWriteLength':
        return makeGenericStatement({
          type: 'DataWrite',
          id,
          inputs: {
            MESSAGE: makeInputState(
              makeGenericReporterBlock('DataLength', {}, { A: makeInputState(null, makeShadowTextBlock(command.text)) }),
              makeShadowTextBlock('')
            ),
          },
        });
      case 'dataWriteContains':
        return makeGenericStatement({
          type: 'DataWrite',
          id,
          inputs: {
            MESSAGE: makeInputState(
              makeGenericReporterBlock('DataContains', {}, {
                WORD: makeInputState(null, makeShadowTextBlock(command.word)),
                SUBSTRING: makeInputState(null, makeShadowTextBlock(command.substring)),
              }),
              makeShadowTextBlock('')
            ),
          },
        });
      case 'dataWriteLetterOf':
        return makeGenericStatement({
          type: 'DataWrite',
          id,
          inputs: {
            MESSAGE: makeInputState(
              makeGenericReporterBlock('DataLetterOf', {}, {
                INDEX: makeInputState(null, makeShadowNumberBlock(command.index)),
                WORD: makeInputState(null, makeShadowTextBlock(command.word)),
              }),
              makeShadowTextBlock('')
            ),
          },
        });
      case 'dataVariableSet': {
        const variableRef = ensureProjectVariable(command.name, 'Var');
        return makeGenericStatement({
          type: 'DataVariableSet',
          id,
          fields: { VARIABLE: variableRef },
          inputs: {
            VALUE: makeInputState(
              null,
              command.valueType === 'number'
                ? makeShadowNumberBlock(command.value)
                : makeShadowTextBlock(command.value)
            ),
          },
        });
      }
      case 'dataVariableChangeBy': {
        const variableRef = ensureProjectVariable(command.name, 'Var');
        return makeGenericStatement({
          type: 'DataVariableChangeBy',
          id,
          fields: { VARIABLE: variableRef },
          inputs: { VALUE: makeInputState(null, makeShadowNumberBlock(command.value)) },
        });
      }
      case 'dataWriteVariable': {
        const variableRef = ensureProjectVariable(command.name, 'Var');
        return makeGenericStatement({
          type: 'DataWrite',
          id,
          inputs: {
            MESSAGE: makeInputState(
              makeGenericReporterBlock('DataVariableGet', { LABEL: variableRef.name, VARIABLE: variableRef }),
              makeShadowTextBlock('')
            ),
          },
        });
      }
      case 'dataWriteSensorValue': {
        const reporter = makeNumericReporterBlock(command.source);
        if (!reporter) return null;
        return makeGenericStatement({
          type: 'DataWrite',
          id,
          inputs: {
            MESSAGE: makeInputState(reporter, makeShadowTextBlock('')),
          },
        });
      }
      case 'dataWriteBooleanCompare': {
        const expression = makeSensorComparisonExpression(command);
        if (!expression?.rawBlock) return null;
        return makeGenericStatement({
          type: 'DataWrite',
          id,
          inputs: {
            MESSAGE: makeInputState(expression.rawBlock, makeShadowTextBlock('')),
          },
        });
      }
      case 'dataWriteBooleanExpression': {
        const expression = makeBooleanReporterExpression(command.expression);
        if (!expression?.rawBlock) return null;
        return makeGenericStatement({
          type: 'DataWrite',
          id,
          inputs: {
            MESSAGE: makeInputState(expression.rawBlock, makeShadowTextBlock('')),
          },
        });
      }
      case 'dataWriteMathFunction':
        return makeGenericStatement({
          type: 'DataWrite',
          id,
          inputs: {
            MESSAGE: makeInputState(
              makeGenericReporterBlock('OperatorsMathFunction', { FUN: command.fun }, { A: makeMathOperandInput(command) }),
              makeShadowTextBlock('')
            ),
          },
        });
      case 'dataListAddText': {
        const listRef = ensureProjectVariable(command.listName, 'List');
        return makeGenericStatement({
          type: 'DataListAddItems',
          id,
          fields: { LIST: listRef },
          inputs: {
            VALUES: makeInputState(null, {
              type: 'ListFieldShadow',
              id: window.LecpAdapter.createId(),
              fields: { VALUE: [command.value] },
            }),
          },
        });
      }
      case 'dataListAddAnswer': {
        const listRef = ensureProjectVariable(command.listName, 'List');
        return makeGenericStatement({
          type: 'DataListAddItems',
          id,
          fields: { LIST: listRef },
          inputs: { VALUES: makeInputState(makeGenericReporterBlock('DataAnswer'), null) },
        });
      }
      case 'dataListClear': {
        const listRef = ensureProjectVariable(command.listName, 'List');
        return makeGenericStatement({ type: 'DataListClear', id, fields: { LIST: listRef } });
      }
      case 'dataWriteListItem': {
        const listRef = ensureProjectVariable(command.listName, 'List');
        return makeGenericStatement({
          type: 'DataWrite',
          id,
          inputs: {
            MESSAGE: makeInputState(
              makeGenericReporterBlock('DataListItemAtIndex', {}, {
                INDEX: makeInputState(null, makeShadowNumberBlock(command.index)),
                LIST: makeInputState(null, {
                  type: 'DataListShadow',
                  id: window.LecpAdapter.createId(),
                  fields: { VALUE: listRef },
                }),
              }),
              makeShadowTextBlock('')
            ),
          },
        });
      }
      case 'dataWriteListLength': {
        const listRef = ensureProjectVariable(command.listName, 'List');
        return makeGenericStatement({
          type: 'DataWrite',
          id,
          inputs: {
            MESSAGE: makeInputState(
              makeGenericReporterBlock('DataListAggregate', { AGG: 'LENGTH' }, {
                LIST: makeInputState(null, {
                  type: 'DataListShadow',
                  id: window.LecpAdapter.createId(),
                  fields: { VALUE: listRef },
                }),
              }),
              makeShadowTextBlock('')
            ),
          },
        });
      }
      case 'dataAsk':
        return makeGenericStatement({
          type: 'DataAsk',
          id,
          inputs: { MESSAGE: makeInputState(null, makeShadowTextBlock(command.message)) },
        });
      case 'controlWait':
        return makeGenericStatement({
          type: 'ControlWait',
          id,
          inputs: { SECONDS: makeInputState(null, makeShadowNumberBlock(command.seconds)) },
        });
      case 'controlRepeat':
        return { kind: 'repeat', id, times: command.times, body: [] };
      case 'controlForever':
        return makeGenericStatement({
          type: 'ControlForever',
          id,
          inputs: { BODY: makeInputState(null, null) },
        }, [{ name: 'BODY', body: [] }]);
      case 'controlIfKeyPressed':
        return {
          kind: 'if',
          id,
          condition: { kind: 'keyPressedExpression', id: window.LecpAdapter.createId(), key: command.key },
          body: [],
        };
      case 'controlIfSensorCompare': {
        const condition = makeSensorComparisonExpression(command);
        if (!condition) return null;
        return {
          kind: 'if',
          id,
          condition,
          body: [],
        };
      }
      case 'waitUntilKeyPressed':
        return {
          kind: 'waitUntil',
          id,
          condition: { kind: 'keyPressedExpression', id: window.LecpAdapter.createId(), key: command.key },
        };
      case 'waitUntilSensorCompare': {
        const condition = makeSensorComparisonExpression(command);
        if (!condition) return null;
        return {
          kind: 'waitUntil',
          id,
          condition,
        };
      }
      case 'controlRepeatUntilKeyPressed':
        return makeGenericStatement({
          type: 'ControlRepeatUntil',
          id,
          inputs: {
            CONDITION: makeInputState({
              type: 'EventsIsKeyPressed',
              id: window.LecpAdapter.createId(),
              fields: { KEY: command.key },
            }, null),
            BODY: makeInputState(null, null),
          },
        }, [{ name: 'BODY', body: [] }]);
      case 'controlRepeatUntilSensorCompare': {
        const condition = makeSensorComparisonExpression(command);
        if (!condition?.rawBlock) return null;
        return makeGenericStatement({
          type: 'ControlRepeatUntil',
          id,
          inputs: {
            CONDITION: makeInputState(condition.rawBlock, null),
            BODY: makeInputState(null, null),
          },
        }, [{ name: 'BODY', body: [] }]);
      }
      case 'controlIfTilted': {
        const condition = makeTiltedExpression(command);
        if (!condition) return null;
        return { kind: 'if', id, condition, body: [] };
      }
      case 'waitUntilTilted': {
        const condition = makeTiltedExpression(command);
        if (!condition) return null;
        return { kind: 'waitUntil', id, condition };
      }
      case 'controlRepeatUntilTilted': {
        const condition = makeTiltedExpression(command);
        if (!condition?.rawBlock) return null;
        return makeGenericStatement({
          type: 'ControlRepeatUntil',
          id,
          inputs: { CONDITION: makeInputState(condition.rawBlock, null), BODY: makeInputState(null, null) },
        }, [{ name: 'BODY', body: [] }]);
      }
      case 'motorRunForRotations':
        return {
          kind: 'motorRunForRotations',
          id,
          direction: command.direction,
          unit: command.unit || 'ROTATIONS',
          value: command.value,
        };
      case 'motorStartAtPower':
        return makeGenericStatement({ type: 'MotorStartAtPower', id, inputs: { VALUE: makeInputState(null, { type: 'PowerShadow', id: window.LecpAdapter.createId(), fields: { VALUE: Number(command.value) } }) } });
      case 'motorStartDirection':
        return makeGenericStatement({ type: 'MotorStartDirection', id, fields: { DIRECTION: command.direction } });
      case 'motorStop':
        return makeGenericStatement({ type: 'MotorStop', id });
      case 'motorSetSpeed':
        return makeGenericStatement({ type: 'MotorSetSpeed', id, inputs: { SPEED: makeInputState(null, makeShadowNumberBlock(command.value)) } });
      case 'motorSetAcceleration':
        return makeGenericStatement({ type: 'MotorSetAcceleration', id, inputs: { VALUE: makeInputState(null, { type: 'MotorAccelerationShadow', id: window.LecpAdapter.createId(), fields: { VALUE: command.value } }) } });
      case 'motorSetEndstate':
        return makeGenericStatement({ type: 'MotorSetEndstate', id, fields: { ENDSTATE: command.endState } });
      case 'motorSetRotationsCounted':
        return makeGenericStatement({ type: 'MotorSetRotationsCounted', id });
      case 'doubleMotorRunForRotations':
        return makeGenericStatement({
          type: 'DoubleMotorRunForRotations',
          id,
          fields: { MOTOR: command.motor, DIRECTION: command.direction, UNIT: command.unit || 'ROTATIONS' },
          inputs: {
            VALUE: makeInputState(null, {
              type: 'RotationsShadow',
              id: window.LecpAdapter.createId(),
              fields: { VALUE: Number(command.value) },
            }),
          },
        });
      case 'doubleMotorStartDirection':
        return makeGenericStatement({
          type: 'DoubleMotorStartDirection',
          id,
          fields: { MOTOR: command.motor, DIRECTION: command.direction },
        });
      case 'doubleMotorStop':
        return makeGenericStatement({
          type: 'DoubleMotorStop',
          id,
          fields: { MOTOR: command.motor },
        });
      case 'doubleMotorSetSpeed':
        return makeGenericStatement({
          type: 'DoubleMotorSetSpeed',
          id,
          fields: { MOTOR: command.motor },
          inputs: { SPEED: makeInputState(null, makeShadowNumberBlock(command.value)) },
        });
      case 'doubleMotorStartAtPower':
        return makeGenericStatement({ type: 'DoubleMotorStartAtPower', id, fields: { MOTOR: command.motor }, inputs: { VALUE: makeInputState(null, { type: 'PowerShadow', id: window.LecpAdapter.createId(), fields: { VALUE: Number(command.value) } }) } });
      case 'doubleMotorSetAcceleration':
        return makeGenericStatement({ type: 'DoubleMotorSetAcceleration', id, fields: { MOTOR: command.motor }, inputs: { VALUE: makeInputState(null, { type: 'DoubleMotorAccelerationShadow', id: window.LecpAdapter.createId(), fields: { VALUE: command.value } }) } });
      case 'doubleMotorSetEndstate':
        return makeGenericStatement({ type: 'DoubleMotorSetEndstate', id, fields: { MOTOR: command.motor, ENDSTATE: command.endState } });
      case 'doubleMotorSetRotationsCounted':
        return makeGenericStatement({ type: 'DoubleMotorSetRotationsCounted', id, fields: { MOTOR: command.motor } });
      case 'doubleMotorSetTurnSteering':
        return makeGenericStatement({ type: 'DoubleMotorSetTurnSteering', id, inputs: { VALUE: makeInputState(null, makeShadowNumberBlock(command.value)) } });
      case 'doubleMotorStartDualSpeed':
        return makeGenericStatement({ type: 'DoubleMotorStartDualSpeed', id, inputs: { LEFT: makeInputState(null, { type: 'SpeedShadow', id: window.LecpAdapter.createId(), fields: { VALUE: Number(command.left) } }), RIGHT: makeInputState(null, { type: 'SpeedShadow', id: window.LecpAdapter.createId(), fields: { VALUE: Number(command.right) } }) } });
      case 'doubleMotorResetYaw':
        return makeGenericStatement({ type: 'DoubleMotorResetYaw', id });
      case 'controlStop':
        return makeGenericStatement({ type: 'ControlStop', id, fields: { STOP: command.mode } });
      case 'eventsSendMessage':
        return makeGenericStatement({
          type: 'EventsSendMessage',
          id,
          fields: { OPTION: command.option },
          inputs: { MESSAGE: makeInputState(null, makeMessageShadowBlock(command.message)) },
        });
      default:
        return null;
    }
  }

  function commandToAstScript(command) {
    const yPosition = 100 + (state.ast?.scripts?.length || 0) * 120;
    switch (command.type) {
      case 'scriptProgramStart':
        return {
          id: window.LecpAdapter.createId(),
          trigger: { kind: 'programStart', id: window.LecpAdapter.createId() },
          body: [],
          position: { x: 125, y: yPosition },
        };
      case 'scriptKeyPressed':
        return {
          id: window.LecpAdapter.createId(),
          trigger: { kind: 'keyPressedTrigger', id: window.LecpAdapter.createId(), key: command.key },
          body: [],
          position: { x: 125, y: yPosition },
        };
      case 'scriptDoubleMotorTapped':
        return {
          id: window.LecpAdapter.createId(),
          trigger: { kind: 'doubleMotorTappedTrigger', id: window.LecpAdapter.createId() },
          body: [],
          position: { x: 125, y: yPosition },
        };
      case 'scriptMessageReceived':
        return {
          id: window.LecpAdapter.createId(),
          trigger: {
            kind: 'messageReceivedTrigger',
            id: window.LecpAdapter.createId(),
            message: command.message,
          },
          body: [],
          position: { x: 125, y: yPosition },
        };
      case 'scriptColorSensorWhenColor':
        return {
          id: window.LecpAdapter.createId(),
          trigger: {
            kind: 'colorSensorWhenColorTrigger',
            id: window.LecpAdapter.createId(),
            color: command.color,
          },
          body: [],
          position: { x: 125, y: yPosition },
        };
      default:
        return null;
    }
  }

  function buildProjectFromAst() {
    if (!state.ast || !window.LecpAdapter?.applyAstToProject) return null;
    state.ast.metadata = state.ast.metadata || {};
    state.ast.metadata.sounds = window.LecpAdapter.collectReferencedSounds(state.ast);
    return window.LecpAdapter.applyAstToProject(state.ast, cloneJson(state.project || {}));
  }

  function appendCommandsToProject(commandText, options = {}) {
    const setTargetStatus = options.statusTarget === 'lesson' ? setLessonActionStatus : setComposeStatus;

    if (!state.ast) {
      setTargetStatus(options.missingProjectMessage || 'Otwórz projekt przed dodaniem poleceń.', 'error');
      return { ok: false, reason: 'missing-workspace' };
    }

    const { statements, scripts, errors } = parseComposerInput(commandText);
    if (errors.length) {
      setTargetStatus(formatCommandErrors(errors), 'error');
      return { ok: false, reason: 'parse-error', errors };
    }
    if (!statements.length && !scripts.length) {
      setTargetStatus('Dodaj co najmniej jedną linię polecenia lub blok JSON do wstawienia.', 'error');
      return { ok: false, reason: 'empty-input' };
    }

    if (!state.ast.scripts.length && statements.length) {
      state.ast.scripts.push({
        id: window.LecpAdapter.createId(),
        trigger: { kind: 'programStart', id: window.LecpAdapter.createId() },
        body: [],
        position: { x: 125, y: 100 },
      });
    }

    const insertionPoint = getCurrentInsertionPoint();

    if (statements.length) {
      const targetPoint = insertionPoint || {
        scriptIndex: state.ast.scripts.length - 1,
        path: [],
        index: state.ast.scripts[state.ast.scripts.length - 1]?.body?.length || 0,
      };
      const targetStatements = getStatementsAtPath(targetPoint.scriptIndex, targetPoint.path);
      if (!targetStatements) {
        setTargetStatus('Wybrany punkt wstawiania nie jest już dostępny. Wybierz inne miejsce.', 'error');
        refreshInsertionPoints();
        return { ok: false, reason: 'missing-insertion-point' };
      }
      targetStatements.splice(targetPoint.index, 0, ...statements);
    }

    if (scripts.length) {
      if (
        state.ast.scripts.length === 1 &&
        state.ast.scripts[0].trigger?.kind === 'programStart' &&
        (!state.ast.scripts[0].body || state.ast.scripts[0].body.length === 0) &&
        scripts[0].trigger?.kind === 'programStart'
      ) {
        state.ast.scripts = cloneJson(scripts);
      } else {
        state.ast.scripts.push(...cloneJson(scripts));
      }
    }

    const project = buildProjectFromAst();
    if (!project) {
      setTargetStatus('Nie udało się zbudować zaktualizowanego projektu.', 'error');
      return { ok: false, reason: 'build-failed' };
    }

    renderProject(project, {
      preferredPoint: statements.length && insertionPoint
        ? {
            scriptIndex: insertionPoint.scriptIndex,
            path: insertionPoint.path,
            index: insertionPoint.index + statements.length,
          }
        : null,
    });
    if (!statements.length && scripts.length) {
      moveInsertionPointToEnd();
    }
    requestProjectApply(project);
    if (options.statusTarget !== 'lesson') ui.composeInput.value = '';
    const appendedStepCount = statements.length + scripts.reduce((count, script) => count + (script.body?.length || 0), 0);
    const stepText = appendedStepCount ? `${appendedStepCount} ${polishStepWord(appendedStepCount)}` : null;
    const scriptText = scripts.length ? `${scripts.length} ${polishScriptWord(scripts.length)}` : null;
    const insertedContent = [stepText, scriptText].filter(Boolean).join(' i ');
    const successMessage = options.statusTarget === 'lesson'
      ? `Przykład wstawiony pomyślnie. Dodano do projektu: ${insertedContent}.`
      : `Polecenie wstawione pomyślnie. Dodano do projektu: ${insertedContent}.`;
    setTargetStatus(successMessage);
    setStatus('Zaktualizowano obszar roboczy.');
    return { ok: true, statements: appendedStepCount, scripts: scripts.length, message: successMessage };
  }

  function deleteStepAtInsertionPoint() {
    if (!state.ast) {
      setComposeStatus('Otwórz projekt przed usunięciem kroków.', 'error');
      return;
    }

    const insertionPoint = getCurrentInsertionPoint();
    if (!insertionPoint) {
      setComposeStatus('Wybierz punkt wstawiania przed usunięciem.', 'error');
      return;
    }

    const targetStatements = getStatementsAtPath(insertionPoint.scriptIndex, insertionPoint.path);
    if (canDeleteEmptyScriptAtPoint(insertionPoint, targetStatements)) {
      const removedScript = state.ast.scripts.splice(insertionPoint.scriptIndex, 1)[0];
      const project = buildProjectFromAst();
      if (!project) {
        setComposeStatus('Nie udało się zbudować zaktualizowanego projektu.', 'error');
        return;
      }

      renderProject(project);
      requestProjectApply(project);
      setComposeStatus(`Usunięto pusty blok początkowy: ${triggerToText(removedScript?.trigger)}.`);
      setStatus('Zaktualizowano obszar roboczy.');
      return;
    }

    if (!Array.isArray(targetStatements) || insertionPoint.index <= 0) {
      setComposeStatus('W tym miejscu nie ma poprzedniego kroku do usunięcia.', 'error');
      updateInsertionPointLabel({ announce: true });
      return;
    }

    const removedStatement = targetStatements.splice(insertionPoint.index - 1, 1)[0];
    const project = buildProjectFromAst();
    if (!project) {
      setComposeStatus('Nie udało się zbudować zaktualizowanego projektu.', 'error');
      return;
    }

    renderProject(project, {
      preferredPoint: {
        scriptIndex: insertionPoint.scriptIndex,
        path: insertionPoint.path,
        index: insertionPoint.index - 1,
      },
    });
    requestProjectApply(project);
    const removedLine = removedStatement ? statementToLine(removedStatement).text : 'krok';
    setComposeStatus(`Usunięto: ${removedLine}.`);
    setStatus('Zaktualizowano obszar roboczy.');
  }

  function closeDeleteAllConfirmation(options = {}) {
    if (!ui.deleteDialog.open) return;
    const returnFocus = state.editor.deleteDialogReturnFocus;
    ui.deleteDialog.close();
    state.editor.deleteDialogReturnFocus = null;
    if (options.restoreFocus !== false) {
      const focusTarget = returnFocus?.isConnected ? returnFocus : ui.deleteAllButton;
      setTimeout(() => focusTarget?.focus({ preventScroll: true }), 0);
    }
  }

  function requestDeleteAllProjectCode() {
    if (!state.ast) {
      setComposeStatus('Otwórz projekt przed usunięciem kodu.', 'error');
      return;
    }
    if (!hasDeletableProjectCode()) {
      setComposeStatus('W bieżącym projekcie nie ma kodu do usunięcia.', 'error');
      return;
    }
    if (ui.deleteDialog.open) return;
    state.editor.deleteDialogReturnFocus = shadow.activeElement;
    ui.deleteDialog.showModal();
    ui.deleteDialogCancel.focus({ preventScroll: true });
  }

  function deleteAllProjectCode() {
    if (!hasDeletableProjectCode()) {
      setComposeStatus('W bieżącym projekcie nie ma kodu do usunięcia.', 'error');
      return;
    }

    state.ast.scripts = [];
    state.ast.metadata = state.ast.metadata || {};
    state.ast.metadata.variables = [];
    state.ast.metadata.sounds = [];

    const project = buildProjectFromAst();
    if (!project) {
      setComposeStatus('Nie udało się zbudować zaktualizowanego projektu.', 'error');
      return;
    }

    renderProject(project);
    requestProjectApply(project);
    setComposeStatus('Usunięto cały kod z projektu.');
    setStatus('Zaktualizowano obszar roboczy.');
  }

  function closeCourseUploadDialog(options = {}) {
    if (!ui.courseUploadDialog.open) return;
    const returnFocus = state.lesson.courseUploadDialogReturnFocus;
    ui.courseUploadDialog.close();
    state.lesson.courseUploadDialogReturnFocus = null;
    state.lesson.pendingCourseUpload = null;
    if (options.restoreFocus !== false) {
      const focusTarget = returnFocus?.isConnected ? returnFocus : ui.courseUploadButton;
      setTimeout(() => focusTarget?.focus({ preventScroll: true }), 0);
    }
  }

  function requestCourseUpload(course, text, fileName) {
    state.lesson.pendingCourseUpload = { course, text, fileName };
    ui.courseUploadDialogMessage.textContent = `Kurs „${course.title}” (plik: ${fileName}) zastąpi bieżący kurs i zresetuje postęp ucznia.`;
    state.lesson.courseUploadDialogReturnFocus = shadow.activeElement;
    ui.courseUploadDialog.showModal();
    ui.courseUploadDialogCancel.focus({ preventScroll: true });
  }

  function confirmCourseUpload() {
    const pending = state.lesson.pendingCourseUpload;
    if (!pending) {
      closeCourseUploadDialog();
      return;
    }

    const storageArea = getLessonStorageArea();
    if (storageArea?.set) {
      try {
        storageArea.set({ [COURSE_SOURCE_STORAGE_KEY]: pending.text }, () => {
          if (chrome.runtime?.lastError) {
            console.warn('[TADroid Lessons] Could not save the uploaded course file.', chrome.runtime.lastError.message);
            useInMemoryLessonProgress();
          }
        });
      } catch (error) {
        console.warn('[TADroid Lessons] Could not save the uploaded course file.', error);
        useInMemoryLessonProgress();
      }
    } else {
      useInMemoryLessonProgress();
    }

    closeCourseUploadDialog({ restoreFocus: false });
    applyCourse(pending.course);
    setLessonStatus(`Wgrano kurs: „${pending.course.title}”.`);
    setTimeout(() => ui.lessonHeading.focus({ preventScroll: true }), 0);
  }

  async function handleCourseFileSelected(file) {
    if (!file) return;

    let text;
    try {
      text = await file.text();
    } catch (error) {
      console.warn('[TADroid Lessons] Could not read the selected file.', error);
      setLessonStatus('Nie udało się odczytać wybranego pliku.', 'error');
      return;
    }

    const course = window.TadroidParseCourse(text);
    if (!course.isValid) {
      setLessonStatus(course.errorText || 'Plik kursu zawiera błędy.', 'error');
      return;
    }

    requestCourseUpload(course, text, file.name);
  }

  function setReaderPanelOpen(isOpen) {
    panel.classList.toggle('tadroid-hidden', !isOpen);
    toggle.textContent = isOpen ? 'Zamknij panel kodu' : 'Otwórz panel kodu';
    applyShortcutMetadata(toggle, SHORTCUTS.togglePanel);
    syncReaderEditorMode();
    updateLessonActionAvailability();
    if (isOpen) requestProject();
    if (!isOpen) {
      closeDeleteAllConfirmation({ restoreFocus: false });
      toggle.focus({ preventScroll: true });
    }
  }

  function setLessonPanelOpen(isOpen, options = {}) {
    state.lesson.isOpen = Boolean(isOpen);
    lessonPanel.classList.toggle('tadroid-hidden', !state.lesson.isOpen);
    lessonToggle.textContent = state.lesson.isOpen ? 'Zamknij panel kursu' : 'Otwórz panel kursu';
    applyShortcutMetadata(lessonToggle, SHORTCUTS.toggleLesson);
    if (state.lesson.isOpen) {
      requestProject();
      if (options.focus !== false) {
        if (state.lesson.outlineOpen) {
          ui.lessonOutlineTab.focus({ preventScroll: true });
        } else {
          ui.lessonHeading.focus({ preventScroll: true });
        }
      }
    }
    if (!state.lesson.isOpen) {
      closePartsDialog({ restoreFocus: false });
      closeModulePartsDialog({ restoreFocus: false });
      closeCourseUploadDialog({ restoreFocus: false });
      lessonToggle.focus({ preventScroll: true });
    }
  }

  lessonToggle.addEventListener('click', () => {
    setLessonPanelOpen(!lessonPanelIsOpen());
  });

  toggle.addEventListener('click', () => {
    setReaderPanelOpen(!panelIsOpen());
  });

  function handlePrimaryAction(action) {
    switch (action) {
      case 'speak': state.speech.active ? cancelSpeech() : startSpeech(); break;
      case 'pause': pauseSpeech(); break;
      case 'previous':
      case 'previous-line':
      case 'previousLine': previousLine(); break;
      case 'skip': skipLine(); break;
      case 'stop': cancelSpeech(); break;
      case 'refresh': requestProject({ force: true }); break;
    }
  }

  function handleEditorAction(action) {
    switch (action) {
      case 'up': moveInsertionPoint(-1); break;
      case 'down': moveInsertionPoint(1); break;
      case 'end': moveInsertionPointToEnd(); break;
      case 'delete': deleteStepAtInsertionPoint(); break;
      case 'delete-all': requestDeleteAllProjectCode(); break;
      case 'insert': appendCommandsToProject(ui.composeInput.value); break;
    }
  }

  function handleLessonAction(action) {
    switch (action) {
      case 'previous': moveLessonStep(-1); break;
      case 'next': moveLessonStep(1, { focusHeading: true }); break;
      case 'insertSample': insertCurrentLessonSample(); break;
    }
  }

  ui.actions.forEach((button) => {
    button.addEventListener('click', () => {
      handlePrimaryAction(button.dataset.action);
    });
  });

  ui.editorActions.forEach((button) => {
    button.addEventListener('click', () => {
      handleEditorAction(button.dataset.editorAction);
    });
  });

  ui.deleteDialogCancel.addEventListener('click', () => {
    closeDeleteAllConfirmation();
  });

  ui.deleteDialogConfirm.addEventListener('click', () => {
    closeDeleteAllConfirmation({ restoreFocus: false });
    deleteAllProjectCode();
    setTimeout(() => ui.composeInput.focus({ preventScroll: true }), 0);
  });

  ui.deleteDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeDeleteAllConfirmation();
  });

  ui.deleteDialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    closeDeleteAllConfirmation();
  });

  ui.courseUploadButton.addEventListener('click', () => {
    ui.courseUploadInput.click();
  });

  ui.courseUploadInput.addEventListener('change', () => {
    const file = ui.courseUploadInput.files?.[0] || null;
    ui.courseUploadInput.value = '';
    handleCourseFileSelected(file);
  });

  ui.courseUploadDialogCancel.addEventListener('click', () => {
    closeCourseUploadDialog();
  });

  ui.courseUploadDialogConfirm.addEventListener('click', () => {
    confirmCourseUpload();
  });

  ui.courseUploadDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeCourseUploadDialog();
  });

  ui.courseUploadDialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    closeCourseUploadDialog();
  });

  ui.partsDialogClose.addEventListener('click', () => {
    closePartsDialog();
  });

  ui.partsDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closePartsDialog();
  });

  ui.partsDialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    closePartsDialog();
  });

  ui.modulePartsDialogClose.addEventListener('click', () => {
    closeModulePartsDialog();
  });

  ui.modulePartsDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    closeModulePartsDialog();
  });

  ui.modulePartsDialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    event.preventDefault();
    event.stopPropagation();
    closeModulePartsDialog();
  });

  ui.lessonActions.forEach((button) => {
    button.addEventListener('click', () => {
      handleLessonAction(button.dataset.lessonAction);
    });
  });

  ui.lessonOutlinePanel.addEventListener('click', (event) => {
    const target = event.target instanceof Element
      ? event.target.closest('[data-lesson-step-index], [data-lesson-parts-step-index], [data-lesson-module-parts-index]')
      : null;
    if (!target) return;

    if (target.hasAttribute('data-lesson-module-parts-index')) {
      const moduleIndex = Number(target.getAttribute('data-lesson-module-parts-index'));
      if (!Number.isInteger(moduleIndex)) return;
      openModulePartsDialog(state.lesson.course?.modules[moduleIndex]);
      return;
    }

    if (target.hasAttribute('data-lesson-parts-step-index')) {
      const stepIndex = Number(target.getAttribute('data-lesson-parts-step-index'));
      if (!Number.isInteger(stepIndex)) return;
      openPartsDialog(state.lesson.flatSteps[stepIndex]);
      return;
    }

    const nextIndex = Number(target.getAttribute('data-lesson-step-index'));
    if (!Number.isInteger(nextIndex)) return;
    setLessonOutlineOpen(false);
    goToLessonStep(nextIndex, { focusHeading: true });
  });

  ui.lessonViewTab.addEventListener('click', () => {
    setLessonOutlineOpen(false);
  });

  ui.lessonOutlineTab.addEventListener('click', () => {
    setLessonOutlineOpen(true);
  });

  ui.lessonTabs.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
    const openOutline = event.key === 'ArrowRight' || event.key === 'End';
    setLessonOutlineOpen(openOutline, { focusTab: true });
  });

  ui.composeInput.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && !event.shiftKey && event.key === 'Enter') {
      event.preventDefault();
      appendCommandsToProject(ui.composeInput.value);
    }
  });

  ui.editor.addEventListener('toggle', () => {
    syncReaderEditorMode();
    if (ui.editor.open) announceInsertionPoint(ui.insertionLabel.textContent);
  });

  ui.lessonPanel.addEventListener('keydown', (event) => {
    const target = event.composedPath?.()[0] || event.target;
    if (isEditableTarget(target) || event.altKey || event.ctrlKey || event.metaKey) return;
    if (target instanceof Element && target.closest('button, summary, [role="tab"]')) return;

    if (event.key === 'ArrowLeft' || event.key === 'PageUp') {
      event.preventDefault();
      moveLessonStep(-1, { focus: false });
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'PageDown') {
      event.preventDefault();
      moveLessonStep(1, { focus: false });
      return;
    }
    if (event.key === 'Home') {
      event.preventDefault();
      goToLessonStep(0, { focus: false });
      return;
    }
    if (event.key === 'End') {
      event.preventDefault();
      goToLessonStep(state.lesson.flatSteps.length - 1, { focus: false });
    }
  });

  document.addEventListener('keydown', (event) => {
    const eventTarget = event.composedPath?.()[0] || event.target;

    if (matchesAnyShortcut(event, SHORTCUTS.toggleLesson)) {
      event.preventDefault();
      lessonToggle.click();
      return;
    }

    if (matchesAnyShortcut(event, SHORTCUTS.togglePanel)) {
      event.preventDefault();
      toggle.click();
      return;
    }

    if (!panelIsOpen() && !lessonPanelIsOpen()) return;

    if (matchesAnyShortcut(event, SHORTCUTS.close)) {
      event.preventDefault();
      if (ui.partsDialog?.open) {
        closePartsDialog();
        return;
      }
      if (ui.modulePartsDialog?.open) {
        closeModulePartsDialog();
        return;
      }
      const activeElement = shadow.activeElement;
      const lessonHasFocus = Boolean(activeElement && lessonPanel.contains(activeElement));
      if (lessonPanelIsOpen() && (!panelIsOpen() || lessonHasFocus)) {
        setLessonPanelOpen(false, { focus: false });
        return;
      }
      if (panelIsOpen()) {
        setReaderPanelOpen(false);
        return;
      }
      setLessonPanelOpen(false, { focus: false });
      return;
    }

    if (lessonPanelIsOpen()) {
      if (matchesAnyShortcut(event, SHORTCUTS.viewParts)) {
        event.preventDefault();
        const activeElement = shadow.activeElement;
        if (activeElement instanceof Element) {
          const moduleButton = activeElement.closest('[data-lesson-module-parts-index]');
          if (moduleButton) {
            const moduleIndex = Number(moduleButton.getAttribute('data-lesson-module-parts-index'));
            if (Number.isInteger(moduleIndex) && state.lesson.course?.modules[moduleIndex]) {
              openModulePartsDialog(state.lesson.course.modules[moduleIndex]);
              return;
            }
          }
        }
        const targetStep = getPartsDialogTargetStep();
        if (targetStep?.hasParts) openPartsDialog(targetStep);
        return;
      }

      if (matchesAnyShortcut(event, SHORTCUTS.uploadCourse)) {
        event.preventDefault();
        ui.courseUploadInput.click();
        return;
      }

      if (matchesAnyShortcut(event, SHORTCUTS.previousStep)) {
        event.preventDefault();
        handleLessonAction('previous');
        return;
      }

      if (matchesAnyShortcut(event, SHORTCUTS.nextStep)) {
        event.preventDefault();
        handleLessonAction('next');
        return;
      }

      if (matchesAnyShortcut(event, SHORTCUTS.insertSample)) {
        event.preventDefault();
        handleLessonAction('insertSample');
        return;
      }
    }

    if (!panelIsOpen()) return;

    if (matchesAnyShortcut(event, SHORTCUTS.toggleEditor)) {
      event.preventDefault();
      ui.editor.open = !ui.editor.open;
      return;
    }

    if (isEditableTarget(eventTarget) && !event.altKey && !event.ctrlKey && !event.metaKey) return;

    if (matchesAnyShortcut(event, SHORTCUTS.speak)) {
      event.preventDefault();
      handlePrimaryAction('speak');
      return;
    }
    if (matchesAnyShortcut(event, SHORTCUTS.pause)) {
      event.preventDefault();
      handlePrimaryAction('pause');
      return;
    }
    if (matchesAnyShortcut(event, SHORTCUTS.previousLine)) {
      event.preventDefault();
      handlePrimaryAction('previous-line');
      return;
    }
    if (matchesAnyShortcut(event, SHORTCUTS.skip)) {
      event.preventDefault();
      handlePrimaryAction('skip');
      return;
    }
    if (matchesAnyShortcut(event, SHORTCUTS.stop)) {
      event.preventDefault();
      handlePrimaryAction('stop');
      return;
    }
    if (matchesAnyShortcut(event, SHORTCUTS.refresh)) {
      event.preventDefault();
      handlePrimaryAction('refresh');
      return;
    }
    if (matchesAnyShortcut(event, SHORTCUTS.up)) {
      event.preventDefault();
      handleEditorAction('up');
      return;
    }
    if (matchesAnyShortcut(event, SHORTCUTS.down)) {
      event.preventDefault();
      handleEditorAction('down');
      return;
    }
    if (matchesAnyShortcut(event, SHORTCUTS.end)) {
      event.preventDefault();
      handleEditorAction('end');
      return;
    }
    if (matchesAnyShortcut(event, SHORTCUTS.delete)) {
      event.preventDefault();
      handleEditorAction('delete');
      return;
    }
    if (matchesAnyShortcut(event, SHORTCUTS.deleteAll)) {
      event.preventDefault();
      handleEditorAction('delete-all');
      return;
    }
    if (matchesAnyShortcut(event, SHORTCUTS.insert)) {
      event.preventDefault();
      handleEditorAction('insert');
      return;
    }
    if (matchesAnyShortcut(event, SHORTCUTS.insertSample)) {
      event.preventDefault();
      handleLessonAction('insertSample');
      return;
    }
  });

  applyShortcutMetadata(lessonToggle, SHORTCUTS.toggleLesson);
  applyShortcutMetadata(ui.courseUploadButton, SHORTCUTS.uploadCourse);
  applyShortcutMetadata(toggle, SHORTCUTS.togglePanel);
  applyShortcutMetadata(ui.editorToggle, SHORTCUTS.toggleEditor);
  ui.actions.forEach((button) => applyShortcutMetadata(button, SHORTCUTS[button.dataset.action]));
  ui.editorActions.forEach((button) => {
    const action = button.dataset.editorAction;
    if (action === 'delete-all') {
      applyShortcutMetadata(button, SHORTCUTS.deleteAll);
      return;
    }
    applyShortcutMetadata(button, SHORTCUTS[action]);
  });
  ui.lessonActions.forEach((button) => {
    const action = button.dataset.lessonAction;
    if (action === 'previous') {
      applyShortcutMetadata(button, SHORTCUTS.previousStep);
      return;
    }
    if (action === 'next') {
      applyShortcutMetadata(button, SHORTCUTS.nextStep);
      return;
    }
    applyShortcutMetadata(button, SHORTCUTS[action]);
  });

  window.addEventListener(EVENT_NAME, (event) => {
    try {
      renderProject(event.detail);
    } catch (error) {
      console.error('[4LL] Could not render project', error);
      setStatus(`Nie udało się przekonwertować projektu: ${error.message}`);
    }
  });

  syncReaderEditorMode();
  updateSpeechButton();

  window.addEventListener(STATUS_EVENT, (event) => {
    if (event.detail?.message) setStatus(event.detail.message);
  });

  if ('speechSynthesis' in window) {
    populateVoices();
    speechSynthesis.onvoiceschanged = populateVoices;
  }

  initializeLessons();
  updateEditorAvailability();
  updateLessonActionAvailability();
  requestProject();
})();

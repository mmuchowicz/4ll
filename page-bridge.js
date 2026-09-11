(() => {
  if (window.__tadroidPageBridgeMounted) {
    return;
  }
  window.__tadroidPageBridgeMounted = true;

  const EVENT_NAME = 'tadroid-4ll-update';
  const REQUEST_EVENT = 'tadroid-4ll-request';
  const STATUS_EVENT = 'tadroid-4ll-status';
  const APPLY_EVENT = 'tadroid-4ll-apply';
  let attachedWorkspace = null;
  let lastPayload = '';
  let debounceId = null;
  let cachedWorkspaceApi = null;

  function getBlockly() {
    const blockly = globalThis.Blockly || null;
    if (!blockly) return null;
    if (blockly.serialization?.workspaces?.save) return blockly;
    if (blockly.common?.getMainWorkspace || blockly.getMainWorkspace) return blockly;
    return null;
  }

  function isWorkspaceLike(workspace) {
    return Boolean(
      workspace &&
      typeof workspace.addChangeListener === 'function' &&
      (typeof workspace.getTopBlocks === 'function' || typeof workspace.getAllBlocks === 'function')
    );
  }

  function getReactRootFiber() {
    const root = document.getElementById('root');
    if (!root) return null;

    const containerKey = Object.getOwnPropertyNames(root).find((name) => name.startsWith('__reactContainer$'));
    if (containerKey && root[containerKey]) return root[containerKey];

    const firstChild = root.firstElementChild;
    if (!firstChild) return null;
    const fiberKey = Object.getOwnPropertyNames(firstChild).find((name) => name.startsWith('__reactFiber$'));
    return fiberKey ? firstChild[fiberKey] : null;
  }

  function getWorkspaceApiFromEffects(lastEffect) {
    if (!lastEffect) return null;

    const startEffect = lastEffect.next || lastEffect;
    let effect = startEffect;
    do {
      const deps = Array.isArray(effect?.deps) ? effect.deps : [];
      for (const dep of deps) {
        const workspaceApi = dep?.currentWorkspace;
        if (isWorkspaceLike(workspaceApi?.workspace)) return workspaceApi;
      }
      effect = effect?.next || null;
    } while (effect && effect !== startEffect);

    return null;
  }

  function getCurrentWorkspaceApi(forceRefresh = false) {
    if (!forceRefresh && isWorkspaceLike(cachedWorkspaceApi?.workspace)) return cachedWorkspaceApi;
    if (forceRefresh) cachedWorkspaceApi = null;

    const rootFiber = getReactRootFiber();
    if (!rootFiber) return null;

    const queue = [rootFiber];
    const seen = new WeakSet();

    while (queue.length) {
      const fiber = queue.shift();
      if (!fiber || seen.has(fiber)) continue;
      seen.add(fiber);

      const workspaceApi = getWorkspaceApiFromEffects(fiber.updateQueue?.lastEffect);
      if (workspaceApi) {
        cachedWorkspaceApi = workspaceApi;
        return workspaceApi;
      }

      if (fiber.child) queue.push(fiber.child);
      if (fiber.sibling) queue.push(fiber.sibling);
    }

    return null;
  }

  function isManifestLike(candidate) {
    return Boolean(
      candidate &&
      typeof candidate === 'object' &&
      typeof candidate.name === 'string' &&
      candidate.name.trim() &&
      typeof candidate.type === 'string'
    );
  }

  function findManifestInDeps(deps) {
    for (const dep of deps) {
      if (!dep || typeof dep !== 'object') continue;
      if (isManifestLike(dep.manifest)) return dep.manifest;
      if (isManifestLike(dep.currentProject?.manifest)) return dep.currentProject.manifest;
      if (isManifestLike(dep.project?.manifest)) return dep.project.manifest;
      if (isManifestLike(dep)) return dep;
    }
    return null;
  }

  function getManifestFromEffects(lastEffect) {
    if (!lastEffect) return null;

    const startEffect = lastEffect.next || lastEffect;
    let effect = startEffect;
    do {
      const deps = Array.isArray(effect?.deps) ? effect.deps : [];
      const manifest = findManifestInDeps(deps);
      if (manifest) return manifest;
      effect = effect?.next || null;
    } while (effect && effect !== startEffect);

    return null;
  }

  function getCurrentManifest() {
    const workspaceApi = getCurrentWorkspaceApi();
    if (isManifestLike(workspaceApi?.manifest)) return workspaceApi.manifest;
    if (isManifestLike(workspaceApi?.project?.manifest)) return workspaceApi.project.manifest;

    const rootFiber = getReactRootFiber();
    if (!rootFiber) return null;

    const queue = [rootFiber];
    const seen = new WeakSet();

    while (queue.length) {
      const fiber = queue.shift();
      if (!fiber || seen.has(fiber)) continue;
      seen.add(fiber);

      const manifest = getManifestFromEffects(fiber.updateQueue?.lastEffect);
      if (manifest) return manifest;

      if (fiber.child) queue.push(fiber.child);
      if (fiber.sibling) queue.push(fiber.sibling);
    }

    return null;
  }

  function getWorkspace() {
    const blockly = getBlockly();
    if (blockly) {
      const workspace = blockly.common?.getMainWorkspace?.() || blockly.getMainWorkspace?.() || null;
      if (isWorkspaceLike(workspace)) return workspace;
    }

    return getCurrentWorkspaceApi()?.workspace || null;
  }

  function resetWorkspaceTracking() {
    cachedWorkspaceApi = null;
    attachedWorkspace = null;
    lastPayload = '';
    if (debounceId) {
      clearTimeout(debounceId);
      debounceId = null;
    }
  }

  function getWorkspaceState(workspaceApi, workspace) {
    const blockly = getBlockly();
    if (workspace && blockly?.serialization?.workspaces?.save) {
      try {
        return blockly.serialization.workspaces.save(workspace);
      } catch (error) {
        console.warn('[4LL] Could not serialize workspace', error);
      }
    }

    try {
      const projectCanvas = workspaceApi?.getProjectCanvas?.();
      return projectCanvas?.blocks ? projectCanvas : null;
    } catch (error) {
      console.warn('[4LL] Could not read project canvas', error);
      return null;
    }
  }

  function normalizeVariableType(type) {
    return String(type || '').toLowerCase() === 'list' ? 'List' : 'Var';
  }

  function getVariables(workspace) {
    try {
      const variableMap = workspace?.getVariableMap?.();
      const variables = variableMap?.getAllVariables?.() || [];
      return variables.map((variable) => ({
        id: variable.getId?.() || variable.id_ || variable.id,
        name: variable.name || variable.name_,
        type: normalizeVariableType(variable.type || variable.type_),
      }));
    } catch {
      return [];
    }
  }

  function visitBlocks(block, visitor) {
    if (!block) return;
    visitor(block);
    const inputs = block.inputs || {};
    Object.values(inputs).forEach((input) => {
      visitBlocks(input.block, visitor);
      visitBlocks(input.shadow, visitor);
    });
    visitBlocks(block.next?.block, visitor);
  }

  function collectCanvasMetadata(topBlocks) {
    const sounds = new Set();
    const messages = new Set();

    (topBlocks || []).forEach((topBlock) => {
      visitBlocks(topBlock, (block) => {
        if (block.type === 'SoundPlaySound') {
          const value = block.inputs?.SOUND?.shadow?.fields?.VALUE || block.inputs?.SOUND?.block?.fields?.VALUE;
          if (value) sounds.add(String(value));
        }
        if (block.type === 'EventsSendMessage') {
          const value = block.inputs?.MESSAGE?.shadow?.fields?.VALUE || block.inputs?.MESSAGE?.block?.fields?.VALUE;
          if (value) messages.add(String(value));
        }
        if (block.type === 'EventsWhenMessageReceived') {
          const value = block.fields?.MESSAGE;
          if (value) messages.add(String(value));
        }
      });
    });

    return {
      sounds: Array.from(sounds),
      messages: Array.from(messages),
    };
  }

  function getProjectName() {
    const manifest = getCurrentManifest();
    if (manifest?.name?.trim()) return manifest.name.trim();

    const selectors = [
      '[data-testid="project-dropdown"]',
      '[data-testid="project-name"]',
      '[contenteditable="true"]',
      'h1',
    ];
    const ignoredText = /^(coding canvas|word|icon|see more|show more|loading)$/i;
    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      for (const element of elements) {
        const text = element.textContent?.trim();
        if (text && !ignoredText.test(text)) return text;
      }
    }
    const slug = location.pathname.split('/').filter(Boolean).pop();
    return slug && !/^(word|icon)$/i.test(slug) ? decodeURIComponent(slug) : 'Coding Canvas project';
  }

  function buildProjectPayload() {
    const workspaceApi = getCurrentWorkspaceApi();
    const workspace = getWorkspace();
    if (!workspace) return null;

    const savedState = getWorkspaceState(workspaceApi, workspace);
    if (!savedState) return null;

    const blocksState = savedState.blocks?.blocks ? savedState.blocks : savedState;
    const topBlocks = blocksState.blocks || [];
    const metadata = collectCanvasMetadata(topBlocks);
    const variables = savedState.variables || getVariables(workspace);
    const manifestType = location.pathname.includes('/icon/') ? 'icon' : 'word';

    return {
      manifest: {
        id: 'tadroid-live-project',
        name: getProjectName(),
        type: manifestType,
        hardware: [],
      },
      canvas: {
        blocks: {
          languageVersion: blocksState.languageVersion || 1,
          blocks: topBlocks,
        },
        palette: savedState.palette || 'core',
        sounds: metadata.sounds,
        messages: metadata.messages,
        variables,
      },
      bodyPose: {
        usePretrained: true,
      },
      customSounds: {},
    };
  }

  function emitStatus(message, tone = 'info') {
    window.dispatchEvent(new CustomEvent(STATUS_EVENT, { detail: { message, tone } }));
  }

  async function applyProject(project) {
    const workspaceApi = getCurrentWorkspaceApi();
    if (!workspaceApi?.loadProjectCanvas || !project?.canvas) {
      emitStatus('Could not update the workspace.');
      return;
    }

    try {
      await workspaceApi.loadProjectCanvas(project.canvas);
      lastPayload = '';
      emitProject(true);
      emitStatus('Updated the workspace.');
    } catch (error) {
      console.warn('[4LL] Could not apply project', error);
      emitStatus(`Could not update the workspace: ${error.message}`);
    }
  }

  function emitProject(force = false) {
    const project = buildProjectPayload();
    if (!project) {
      emitStatus('Waiting for Coding Canvas workspace…');
      return;
    }

    const payload = JSON.stringify(project);
    if (!force && payload === lastPayload) return;
    lastPayload = payload;
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: project }));
    emitStatus('Synced with the workspace.');
  }

  function scheduleEmit() {
    if (debounceId) clearTimeout(debounceId);
    debounceId = setTimeout(emitProject, 120);
  }

  function attachWorkspaceListener(forceRefresh = false) {
    const workspaceApi = getCurrentWorkspaceApi(forceRefresh);
    const workspace = getBlockly()?.common?.getMainWorkspace?.() || getBlockly()?.getMainWorkspace?.() || workspaceApi?.workspace || null;
    if (!workspace) return false;
    if (workspace === attachedWorkspace) return true;
    attachedWorkspace = workspace;
    workspace.addChangeListener?.(() => scheduleEmit());
    return true;
  }

  function boot(options = {}) {
    const workspaceReady = attachWorkspaceListener(Boolean(options.forceRefresh));
    if (workspaceReady) emitProject(Boolean(options.forceEmit));
    else emitStatus('Waiting for Coding Canvas workspace…');
  }

  let attempts = 0;
  const maxAttempts = 120;
  const pollId = setInterval(() => {
    attempts += 1;
    boot();
    if (attachedWorkspace || attempts >= maxAttempts) {
      clearInterval(pollId);
    }
  }, 500);

  window.addEventListener(REQUEST_EVENT, (event) => {
    const forceRefresh = Boolean(event.detail?.force);
    if (forceRefresh) {
      resetWorkspaceTracking();
    }
    boot({ forceRefresh, forceEmit: true });
  });
  window.addEventListener(APPLY_EVENT, (event) => {
    void applyProject(event.detail);
  });
  boot();
})();

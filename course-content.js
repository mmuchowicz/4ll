(() => {

  function slugify(value) {
    return String(value || '')
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function trimBlock(lines) {
    const normalized = [...lines];
    while (normalized.length && !normalized[0].trim()) normalized.shift();
    while (normalized.length && !normalized[normalized.length - 1].trim()) normalized.pop();
    return normalized.join('\n').trim();
  }

  function formatErrors(errors) {
    return errors.map((error) => `- ${error}`).join('\n');
  }

  function buildPartsIndex() {
    const index = new Map();
    (window.PartsCatalog || []).forEach((part) => {
      if (!index.has(part.partNum)) index.set(part.partNum, []);
      index.get(part.partNum).push(part);
    });
    return index;
  }

  function parseCourse(source) {
    const errors = [];
    const lines = String(source || '').replace(/\r\n?/g, '\n').split('\n');
    const course = {
      title: 'Untitled course',
      id: '',
      version: '1',
      modules: [],
      flatSteps: [],
      stepCount: 0,
      isValid: false,
      errors,
      errorText: '',
      source,
    };

    let currentModule = null;
    let currentLesson = null;
    let currentStep = null;
    let activeBlock = 'body';
    let hasCourseTitle = false;
    let hasCourseId = false;
    let hasCourseVersion = false;
    const partsIndex = buildPartsIndex();

    function addError(lineNumber, message) {
      errors.push(`Line ${lineNumber}: ${message}`);
    }

    function parsePartsEntry(rawEntry, lineNumber) {
      const entry = rawEntry.trim();
      if (!entry) return;

      const match = entry.match(/^([0-9][0-9a-zA-Z]*)(?:\s*:\s*([^xX]+))?(?:\s*[xX]\s*(\d+))?$/);
      if (!match) {
        addError(lineNumber, `Could not parse part entry "${entry}" in @parts. Expected "<partNum>[:<color>][x<quantity>]".`);
        return;
      }

      const [, partNum, colorRaw, quantityRaw] = match;
      const color = colorRaw ? colorRaw.trim() : '';
      const quantity = quantityRaw ? parseInt(quantityRaw, 10) : 1;
      const candidates = partsIndex.get(partNum) || [];

      if (!candidates.length) {
        addError(lineNumber, `Unknown part number "${partNum}" in @parts (not found in the parts catalog).`);
        return;
      }

      let resolved = null;
      if (candidates.length === 1) {
        resolved = candidates[0];
      } else if (!color) {
        const colors = candidates.map((candidate) => candidate.color).join(', ');
        addError(lineNumber, `Part "${partNum}" is ambiguous — specify a color (one of: ${colors}), e.g. "${partNum}:${candidates[0].color}".`);
        return;
      } else {
        resolved = candidates.find((candidate) => candidate.color.toLowerCase() === color.toLowerCase() || slugify(candidate.color) === slugify(color)) || null;
        if (!resolved) {
          const colors = candidates.map((candidate) => candidate.color).join(', ');
          addError(lineNumber, `Unknown color "${color}" for part "${partNum}" — valid colors: ${colors}.`);
          return;
        }
      }

      currentStep.parts.push({
        id: resolved.id,
        partNum: resolved.partNum,
        color: resolved.color,
        description: resolved.description,
        image: resolved.image,
        quantity,
      });
    }

    function addPartsLine(value, lineNumber) {
      if (!currentStep) {
        addError(lineNumber, 'A @parts marker must appear inside a @step.');
        return;
      }
      const entries = value.split(',').map((entry) => entry.trim()).filter(Boolean);
      if (!entries.length) {
        addError(lineNumber, 'A @parts marker needs at least one part number.');
        return;
      }
      entries.forEach((entry) => parsePartsEntry(entry, lineNumber));
    }

    function closeSampleIfNeeded(lineNumber, nextMarker) {
      if (activeBlock === 'sample') {
        addError(lineNumber, `Sample blocks must end with @end before ${nextMarker}.`);
        activeBlock = 'body';
      }
    }

    function flushStep() {
      if (!currentStep) return;
      currentStep.bodyText = trimBlock(currentStep.bodyLines);
      currentStep.sampleText = trimBlock(currentStep.sampleLines);
      delete currentStep.bodyLines;
      delete currentStep.sampleLines;

      if (!currentStep.bodyText) {
        addError(currentStep.lineNumber, 'Each @step needs at least one line of lesson text.');
      }
      currentLesson.steps.push(currentStep);
      currentStep = null;
    }

    function startModule(title, lineNumber) {
      closeSampleIfNeeded(lineNumber, '@module');
      flushStep();
      currentModule = {
        title: title || `Module ${course.modules.length + 1}`,
        lessons: [],
        lineNumber,
      };
      course.modules.push(currentModule);
      currentLesson = null;
    }

    function startLesson(title, lineNumber) {
      if (!currentModule) {
        startModule('', lineNumber);
      }
      closeSampleIfNeeded(lineNumber, '@lesson');
      flushStep();
      currentLesson = {
        title: title || `Lesson ${currentModule.lessons.length + 1}`,
        steps: [],
        lineNumber,
      };
      currentModule.lessons.push(currentLesson);
    }

    function startStep(title, lineNumber) {
      if (!currentLesson) {
        addError(lineNumber, 'A @step must appear after a @lesson.');
        return;
      }
      closeSampleIfNeeded(lineNumber, '@step');
      flushStep();
      currentStep = {
        title: title || '',
        bodyLines: [],
        sampleLines: [],
        parts: [],
        lineNumber,
      };
      activeBlock = 'body';
    }

    lines.forEach((rawLine, index) => {
      const lineNumber = index + 1;
      const line = rawLine.trimEnd();
      const marker = line.match(/^@([a-z]+)(?::\s*(.*))?$/i);

      if (!marker) {
        if (!currentStep) {
          if (line.trim()) {
            addError(lineNumber, 'Lesson text must live inside a @step block.');
          }
          return;
        }
        if (activeBlock === 'sample') currentStep.sampleLines.push(line);
        else currentStep.bodyLines.push(line);
        return;
      }

      const name = marker[1].toLowerCase();
      const value = marker[2] || '';

      switch (name) {
        case 'course':
          if (hasCourseTitle) {
            addError(lineNumber, 'Only one @course title is allowed.');
            return;
          }
          hasCourseTitle = true;
          course.title = value.trim() || course.title;
          return;
        case 'id':
          if (hasCourseId) {
            addError(lineNumber, 'Only one @id is allowed.');
            return;
          }
          hasCourseId = true;
          course.id = slugify(value) || 'tadroid-course';
          return;
        case 'version':
          if (hasCourseVersion) {
            addError(lineNumber, 'Only one @version is allowed.');
            return;
          }
          hasCourseVersion = true;
          course.version = value.trim() || course.version;
          return;
        case 'module':
          startModule(value.trim(), lineNumber);
          return;
        case 'lesson':
          startLesson(value.trim(), lineNumber);
          return;
        case 'step':
          startStep(value.trim(), lineNumber);
          return;
        case 'parts':
          closeSampleIfNeeded(lineNumber, '@parts');
          addPartsLine(value, lineNumber);
          return;
        case 'sample':
          if (!currentStep) {
            addError(lineNumber, 'A @sample block must appear inside a @step.');
            return;
          }
          if (activeBlock === 'sample') {
            addError(lineNumber, 'Nested @sample blocks are not allowed.');
            return;
          }
          activeBlock = 'sample';
          return;
        case 'end':
          if (activeBlock !== 'sample') {
            addError(lineNumber, '@end can only close a @sample block.');
            return;
          }
          activeBlock = 'body';
          return;
        default:
          addError(lineNumber, `Unknown lesson marker "@${name}".`);
      }
    });

    if (activeBlock === 'sample') {
      addError(lines.length, 'The final @sample block is missing a closing @end.');
      activeBlock = 'body';
    }

    flushStep();

    if (!course.modules.length) {
      addError(1, 'The course needs at least one @lesson.');
    }

    if (!course.id) course.id = slugify(course.title) || 'tadroid-course';

    course.modules.forEach((module, moduleIndex) => {
      if (!module.lessons.length) {
        addError(module.lineNumber, `"${module.title}" does not contain any @lesson blocks.`);
      }
      module.lessons.forEach((lesson, lessonIndex) => {
        if (!lesson.steps.length) {
          addError(lesson.lineNumber, `"${lesson.title}" does not contain any @step blocks.`);
        }
        lesson.steps.forEach((step, stepIndex) => {
          const flatStep = {
            id: `${course.id || 'tadroid-course'}-m${moduleIndex + 1}-l${lessonIndex + 1}-s${stepIndex + 1}`,
            globalIndex: course.flatSteps.length,
            globalStepNumber: course.flatSteps.length + 1,
            moduleIndex,
            lessonIndex,
            stepIndex,
            moduleTitle: module.title,
            lessonTitle: lesson.title,
            title: step.title || `Step ${stepIndex + 1}`,
            bodyText: step.bodyText,
            sampleText: step.sampleText,
            parts: step.parts,
            hasParts: step.parts.length > 0,
          };
          step.id = flatStep.id;
          step.globalIndex = flatStep.globalIndex;
          step.globalStepNumber = flatStep.globalStepNumber;
          step.moduleIndex = moduleIndex;
          step.lessonIndex = lessonIndex;
          step.stepIndex = stepIndex;
          step.title = flatStep.title;
          step.bodyText = flatStep.bodyText;
          step.sampleText = flatStep.sampleText;
          step.hasParts = flatStep.hasParts;
          course.flatSteps.push(flatStep);
        });
      });
    });

    if (!course.flatSteps.length) {
      addError(1, 'The course needs at least one valid @step.');
    }

    course.stepCount = course.flatSteps.length;
    course.isValid = errors.length === 0;
    course.errorText = errors.length
      ? `Course authoring errors:\n${formatErrors(errors)}`
      : '';

    return course;
  }

  window.TadroidParseCourse = parseCourse;
})();

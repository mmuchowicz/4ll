(function () {
  const BODY_INPUT_NAMES = new Set([
    "BODY",
    "DO",
    "ELSE",
    "ELSEBODY",
    "IFBODY",
    "SUBSTACK",
    "SUBSTACK2",
    "THEN",
  ]);

  function cloneJson(value) {
    return value == null ? value : JSON.parse(JSON.stringify(value));
  }

  function createId() {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_[]{}()!,.:;?@#$%^&*|/+=`~";
    let id = "";
    for (let index = 0; index < 20; index += 1) {
      id += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
    }
    return id;
  }

  const AVAILABLE_SOUND_NAMES = [
    "Alarm",
    "Applause",
    "Bee",
    "Bird",
    "Bite",
    "Bonk",
    "Cat",
    "Cheer",
    "Coin",
    "Connecting",
    "Cow",
    "Dog",
    "Dragon",
    "Dum_Tss",
    "Dun_Dun_Dunnn",
    "Frog",
    "Horse",
    "Laughing",
    "Lose",
    "Magic",
    "Positive",
    "Relief",
    "Sad",
    "Scanning",
    "Seagulls",
    "Snoring",
    "Splash",
    "Tada",
    "Whistle",
    "Win",
  ];

  const SOUND_NAME_LOOKUP = new Map(
    AVAILABLE_SOUND_NAMES.map((sound) => [normalizeSoundKey(sound), sound])
  );

  const COLOR_NAME_BY_VALUE = new Map([
    ["1", "red"],
    ["2", "yellow"],
    ["3", "blue"],
    ["4", "teal"],
    ["5", "green"],
    ["6", "purple"],
    ["7", "white"],
    ["0", "no colour"],
    ["-1", "any colour"]
  ]);

  const AI_POSE_CLASS_NAME_BY_VALUE = new Map([
    ["0", "arms down"],
    ["1", "right arm up"],
    ["2", "left arm up"],
    ["3", "arms up"],
  ]);

  const DRUM_NAME_BY_VALUE = new Map([
    ["1", "snare drum"],
    ["2", "bass drum"],
    ["3", "side stick"],
    ["4", "crash cymbal"],
    ["5", "open hi hat"],
    ["6", "closed hi hat"],
    ["7", "tambourine"],
    ["8", "hand clap"],
    ["9", "claves"],
    ["10", "wood block"],
    ["11", "cowbell"],
    ["12", "triangle"],
    ["13", "bongo"],
    ["14", "conga"],
    ["15", "cabasa"],
    ["16", "guiro"],
    ["17", "vibraslap"],
    ["18", "cuica"],
  ]);

  const INSTRUMENT_NAME_BY_VALUE = new Map([
    ["1", "piano"],
    ["2", "electric piano"],
    ["3", "organ"],
    ["4", "guitar"],
    ["5", "electric guitar"],
    ["6", "bass"],
    ["7", "pizzicato"],
    ["8", "cello"],
    ["9", "trombone"],
    ["10", "clarinet"],
    ["11", "saxophone"],
    ["12", "flute"],
    ["13", "wooden flute"],
    ["14", "bassoon"],
    ["15", "choir"],
    ["16", "vibraphone"],
    ["17", "music box"],
    ["18", "steel drum"],
    ["19", "marimba"],
    ["20", "synth lead"],
    ["21", "synth pad"],
  ]);

  let currentVariableEntries = [];

  function getField(block, name, fallback = "") {
    return block?.fields?.[name] ?? fallback;
  }

  function getVariableEntryById(id) {
    return currentVariableEntries.find((entry) => String(entry?.id) === String(id)) || null;
  }

  function getVariableEntryByName(name, type = "") {
    return currentVariableEntries.find((entry) => {
      const sameName = String(entry?.name || "").toLowerCase() === String(name || "").toLowerCase();
      if (!sameName) return false;
      return !type || String(entry?.type || "") === String(type);
    }) || null;
  }

  function resolveVariableName(value, fallback = "variable") {
    if (value && typeof value === "object") {
      if (value.name) return String(value.name);
      if (value.id) {
        const entry = getVariableEntryById(value.id);
        if (entry?.name) return String(entry.name);
      }
    }
    if (typeof value === "string" && value) {
      const entry = getVariableEntryById(value);
      if (entry?.name) return String(entry.name);
      return value;
    }
    return fallback;
  }

  function getVariableFieldName(block, fieldName, fallback = "variable") {
    const value = getField(block, fieldName, "");
    return resolveVariableName(value, fallback);
  }

  function normalizeListPhrase(text) {
    const value = String(text || "list");
    return value.toLowerCase().startsWith("list ") ? value : `list ${value}`;
  }

  function humanizeCustomArgName(text) {
    return String(text || "")
      .replace(/_/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function getCustomBlockDescriptorSource(block) {
    if (block?.type === "MyBlockDefinition") {
      return getInputShadow(block, "PROTOTYPE") || getInputBlock(block, "PROTOTYPE") || block;
    }
    return block;
  }

  function getCustomBlockArgs(block) {
    const source = getCustomBlockDescriptorSource(block);
    return cloneJson(source?.extraState?.args || []);
  }

  function getCustomBlockLabelParts(block) {
    const args = getCustomBlockArgs(block);
    return args.filter((arg) => arg?.type === "label" && arg?.text).map((arg) => humanizeCustomArgName(arg.text));
  }

  function getCustomBlockName(block) {
    const labelParts = getCustomBlockLabelParts(block);
    return labelParts.length ? labelParts.join(" ") : "custom block";
  }

  function getCustomBlockInputArgs(block) {
    return getCustomBlockArgs(block).filter((arg) => arg?.type && arg.type !== "label");
  }

  function describeCustomBlockInputs(block) {
    const inputArgs = getCustomBlockInputArgs(block);
    if (!inputArgs.length) return "";
    const parts = inputArgs.map((arg, index) => {
      const inputName = arg.text;
      const value = describeNamedInput(block, `${inputName}_${index + 1}`, describeNamedInput(block, inputName, "empty"));
      return `${humanizeCustomArgName(inputName)}: ${value}`;
    });
    return parts.join(", ");
  }

  function drumValueToText(value) {
    const key = String(value ?? "").trim();
    return DRUM_NAME_BY_VALUE.get(key) || `drum ${key || "unknown"}`;
  }

  function instrumentValueToText(value) {
    const key = String(value ?? "").trim();
    return INSTRUMENT_NAME_BY_VALUE.get(key) || `instrument ${key || "unknown"}`;
  }

  function midiNoteValueToText(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric)) {
      return `note ${value || "unknown"}`;
    }

    const noteNames = ["C", "C sharp", "D", "D sharp", "E", "F", "F sharp", "G", "G sharp", "A", "A sharp", "B"];
    const normalized = Math.round(numeric);
    const name = noteNames[((normalized % 12) + 12) % 12];
    const octave = Math.floor(normalized / 12) - 1;

    return `${name}${octave}`;
  }

  function maybeAppendUnit(valueText, unit) {
    const unitText = String(unit || "").toLowerCase();
    const lowerValue = String(valueText || "").toLowerCase();
    if (unitText && lowerValue.includes(unitText)) {
      return String(valueText);
    }
    return `${valueText} ${unitText}`.trim();
  }

  function describeListIndexReference(block) {
    const indexBlock = getInputBlock(block, "INDEX");
    if (indexBlock?.type === "DataVariableGet") {
      const variableName = getField(indexBlock, "LABEL", getVariableFieldName(indexBlock, "VARIABLE"));
      return `the position stored in variable ${variableName}`;
    }
    return `position ${describeNamedInput(block, "INDEX")}`;
  }

  function getInput(inputMap, name) {
    return inputMap?.[name] || null;
  }

  function getInputBlock(block, name) {
    return getInput(block?.inputs, name)?.block || null;
  }

  function getInputShadow(block, name) {
    return getInput(block?.inputs, name)?.shadow || null;
  }

  function getShadowFieldValue(shadow, fieldName, fallback = 0) {
    const value = shadow?.fields?.[fieldName];
    const numeric = Number(value);
    return Number.isFinite(numeric) ? numeric : fallback;
  }

  function genericBlockLabel(block) {
    if (!block?.type) return "Unknown block";
    const words = String(block.type)
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/[_-]+/g, " ")
      .trim();
    return words.charAt(0).toUpperCase() + words.slice(1);
  }

  function normalizeSoundName(name) {
    const lookupKey = normalizeSoundKey(name);
    return SOUND_NAME_LOOKUP.get(lookupKey) || String(name || "")
      .trim()
      .replace(/\s+/g, "");
  }

  function normalizeSoundKey(name) {
    return String(name || "")
      .trim()
      .toLowerCase()
      .replace(/[\s_-]+/g, "");
  }

  function humanizeToken(token) {
    return String(token || "")
      .replace(/([a-z])([A-Z])/g, "$1 $2")
      .replace(/_/g, " ")
      .trim()
      .toLowerCase();
  }

  function isBodyInputName(name) {
    return BODY_INPUT_NAMES.has(String(name || "").toUpperCase());
  }

  function readLiteralValue(block) {
    if (!block?.fields) return null;
    const fields = block.fields;
    const keys = Object.keys(fields);

    if (keys.length === 1) {
      return fields[keys[0]];
    }

    for (const key of ["TEXT", "NUMBER", "VALUE", "MESSAGE"]) {
      if (key in fields) {
        return fields[key];
      }
    }

    return null;
  }

  function formatLiteralValue(value) {
    if (value === null || value === undefined || value === "") return "empty";
    if (typeof value === "string") {
      if (/^-?\d+(?:\.\d+)?$/.test(value.trim())) {
        return value.trim();
      }
      return `"${value}"`;
    }
    return String(value);
  }

  function formatBareValue(value) {
    if (value === null || value === undefined || value === "") return "empty";
    return String(value);
  }

  function quoteIfNeeded(value) {
    if (value === null || value === undefined || value === "") return "empty";
    return typeof value === "string" ? `"${value}"` : String(value);
  }

  function colorValueToText(value) {
    const key = String(value ?? "").trim();
    return COLOR_NAME_BY_VALUE.get(key) || `color ${key || "unknown"}`;
  }

  function aiPoseClassValueToText(value) {
    const key = String(value ?? "").trim();
    return AI_POSE_CLASS_NAME_BY_VALUE.get(key) || `class ${key || "unknown"}`;
  }

  function describeNamedInput(block, name, fallback = "empty") {
    const input = getInput(block?.inputs, name);
    if (!input) return fallback;
    return describeInputValue(input) || fallback;
  }

  function describeFieldValue(block, name, fallback = "empty") {
    const value = getField(block, name, fallback);
    return formatBareValue(value);
  }

  function motorDirectionText(value) {
    const lower = String(value || "Cw").toLowerCase();
    return lower === "ccw" || lower.includes("counter") ? "counterclockwise" : "clockwise";
  }

  function moveDirectionText(value) {
    return String(value || "Forward").toLowerCase();
  }

  function stopModeText(value) {
    const normalized = String(value || "").toUpperCase();
    if (normalized === "ALL") return "Stop all scripts";
    if (normalized === "STACK") return "Stop this script";
    return `Stop ${normalized.toLowerCase()}`;
  }

  function messageOptionText(value) {
    return String(value || "CONTINUE").toUpperCase() === "WAIT" ? "and wait" : "and continue";
  }

  function soundEffectText(value) {
    const normalized = String(value || "").toUpperCase();
    if (normalized === "VOLUME") return "volume";
    if (normalized === "PITCH") return "pitch";
    return humanizeToken(normalized);
  }

  function endStateText(value) {
    const normalized = String(value || "").toUpperCase();
    if (normalized === "SMART_BRAKE" || normalized === "SMARTBRAKE") return "smart brake";
    if (normalized === "SMART_COAST" || normalized === "SMARTCOAST") return "smart coast";
    if (normalized === "BRAKE") return "brake";
    if (normalized === "COAST") return "coast";
    if (normalized === "HOLD") return "hold";
    if (normalized === "CONTINUE") return "continue";
    return humanizeToken(normalized);
  }

  function accelerationText(value) {
    const normalized = String(value || "").toUpperCase();
    if (normalized === "FAST") return "fast";
    if (normalized === "NORMAL") return "normal";
    if (normalized === "SLOW") return "slow";
    return humanizeToken(normalized);
  }

  function motionAxisText(value) {
    const normalized = String(value || "").trim().toLowerCase();
    if (normalized === "x" || normalized === "y" || normalized === "z") return normalized.toUpperCase();
    return humanizeToken(normalized);
  }

  function tiltDirectionText(value) {
    const normalized = String(value ?? "").trim();
    const lookup = new Map([
      ["-1", "any"],
      ["0", "flat"],
      ["1", "down"],
      ["2", "left"],
      ["3", "upside down"],
      ["4", "up"],
      ["5", "right"],
    ]);
    return lookup.get(normalized) || humanizeToken(normalized);
  }

  function mathFunctionText(value) {
    const normalized = String(value || "").toUpperCase();
    if (normalized === "ROUND") return "round";
    if (normalized === "ABS" || normalized === "ABSOLUTE") return "absolute value";
    if (normalized === "FLOOR") return "round down";
    if (normalized === "CEILING" || normalized === "CEIL") return "round up";
    if (normalized === "SQRT") return "square root";
    if (normalized === "SIN") return "sine";
    if (normalized === "COS") return "cosine";
    if (normalized === "TAN") return "tangent";
    return humanizeToken(normalized);
  }

  function compareOperatorText(value) {
    const normalized = String(value || "").toUpperCase();
    if (normalized === ">") return "is greater than";
    if (normalized === "<") return "is less than";
    if (normalized === "=") return "is equal to";
    if (normalized === "GT") return "is greater than";
    if (normalized === "LT") return "is less than";
    if (normalized === "EQ") return "is equal to";
    if (normalized === "NEQ") return "is not equal to";
    return humanizeToken(normalized);
  }

  function leverDirectionText(value) {
    const normalized = String(value || "").toUpperCase();
    if (normalized === "UP") return "up";
    if (normalized === "DOWN") return "down";
    if (normalized === "LEFT") return "left";
    if (normalized === "RIGHT") return "right";
    return humanizeToken(normalized);
  }

  function colorHsbOptionText(value) {
    const normalized = String(value || "").toUpperCase();
    if (normalized === "HUE") return "hue";
    if (normalized === "SATURATION") return "saturation";
    if (normalized === "VALUE" || normalized === "BRIGHTNESS") return "brightness";
    return humanizeToken(normalized || "hue");
  }

  function controllerLeverText(block) {
    const lever = describeFieldValue(block, "LEVER", getField(block, "LEVER", "controller"));
    return lever.toLowerCase();
  }

  function aiPersonOptionText(value) {
    const normalized = String(value || "").toUpperCase();
    if (normalized === "APPEARS") return "appears";
    if (normalized === "DISAPPEARS") return "disappears";
    return humanizeToken(normalized);
  }

  function describeKnownBlock(block) {
    if (!block?.type) return null;

    switch (block.type) {
      case "MotorRunToPosition":
        return `Run the motor to ${describeNamedInput(block, "POSITION")} degrees`;
      case "MotorStartDirection":
        return `Start the motor ${motorDirectionText(getField(block, "DIRECTION", "Cw"))}`;
      case "MotorStop":
        return "Stop the motor";
      case "MotorSetSpeed":
        return `Set the motor speed to ${describeNamedInput(block, "SPEED")}`;
      case "MotorStartAtPower":
        return `Start the motor at power ${describeNamedInput(block, "VALUE")}`;
      case "MotorSetAcceleration":
        return `Set the motor acceleration to ${describeNamedInput(block, "VALUE", accelerationText(getField(getInputShadow(block, "VALUE"), "VALUE", "")))}`;
      case "MotorSetEndstate":
        return `Set the motor end state to ${endStateText(getField(block, "ENDSTATE", ""))}`;
      case "MotorSetRotationsCounted":
        return "Reset the motor rotations counted";
      case "MotorAccelerationShadow":
        return accelerationText(getField(block, "VALUE", ""));
      case "PowerShadow":
        return formatBareValue(getField(block, "VALUE", ""));
      case "DoubleMotorForSteps":
        return `Move ${moveDirectionText(getField(block, "DIRECTION", "Forward"))} for ${describeNamedInput(block, "STEPS")} steps`;
      case "DoubleMotorTurn":
        return `Turn ${String(getField(block, "DIRECTION", "Left")).toLowerCase()} for ${describeNamedInput(block, "DEGREES")} degrees`;
      case "DoubleMotorStartMove":
        return `Start moving ${moveDirectionText(getField(block, "DIRECTION", "Forward"))}`;
      case "DoubleMotorStopMove":
        return "Stop moving";
      case "DoubleMotorSetMoveSpeed":
        return `Set movement speed to ${describeNamedInput(block, "SPEED")}%`;
      case "DoubleMotorSetAcceleration":
        return `Set the ${describeFieldValue(block, "MOTOR", "selected").toLowerCase()} motor acceleration to ${describeNamedInput(block, "VALUE", accelerationText(getField(getInputShadow(block, "VALUE"), "VALUE", "")))}`;
      case "DoubleMotorSetEndstate":
        return `Set the ${describeFieldValue(block, "MOTOR", "selected").toLowerCase()} motor end state to ${endStateText(getField(block, "ENDSTATE", ""))}`;
      case "DoubleMotorSetRotationsCounted":
        return `Reset the ${describeFieldValue(block, "MOTOR", "selected").toLowerCase()} motor rotations counted`;
      case "DoubleMotorSetTurnSteering":
        return `Set the turn steering to ${describeNamedInput(block, "VALUE")}`;
      case "DoubleMotorStartAtPower":
        return `Start the ${describeFieldValue(block, "MOTOR", "selected").toLowerCase()} motor at power ${describeNamedInput(block, "VALUE")}`;
      case "DoubleMotorStartDualSpeed":
        return `Start moving with left speed ${describeNamedInput(block, "LEFT")} and right speed ${describeNamedInput(block, "RIGHT")}`;
      case "DoubleMotorAccelerationShadow":
        return accelerationText(getField(block, "VALUE", ""));
      case "DoubleMotorAdvancedMotion":
        return `the double motor ${humanizeToken(getField(block, "OPTION", "motion"))} on the ${motionAxisText(getField(block, "AXIS", "x"))} axis`;
      case "DoubleMotorYawPitchRoll":
        return `the double motor ${humanizeToken(getField(block, "OPTION", "yaw"))} angle in degrees`;
      case "DoubleMotorIsTilted":
        return `the double motor is tilted ${tiltDirectionText(getField(block, "OPTION", ""))}`;
      case "DoubleMotorResetYaw":
        return "Reset the double motor yaw";
      case "DoubleMotorRunForRotations":
        return `Run the ${describeFieldValue(block, "MOTOR", "selected").toLowerCase()} motor ${motorDirectionText(getField(block, "DIRECTION", "Cw"))} for ${maybeAppendUnit(describeNamedInput(block, "VALUE"), String(getField(block, "UNIT", "ROTATIONS")).toLowerCase())}`;
      case "DoubleMotorRunToPosition":
        return `Run the ${describeFieldValue(block, "MOTOR", "selected").toLowerCase()} motor to ${describeNamedInput(block, "POSITION")} degrees`;
      case "DoubleMotorStop":
        return `Stop the ${describeFieldValue(block, "MOTOR", "selected").toLowerCase()} motor`;
      case "DoubleMotorSetSpeed":
        return `Set the ${describeFieldValue(block, "MOTOR", "selected").toLowerCase()} motor speed to ${describeNamedInput(block, "SPEED")}`;
      case "DoubleMotorStartDirection":
        return `Start the ${describeFieldValue(block, "MOTOR", "selected").toLowerCase()} motor ${motorDirectionText(getField(block, "DIRECTION", "Cw"))}`;
      case "ControlWait":
        return `Wait for ${describeNamedInput(block, "SECONDS")} seconds`;
      case "ControlIfElse":
        return `If ${describeNamedInput(block, "CONDITION", "an unknown condition")} then`;
      case "ControlRepeatUntil":
        return `Repeat until ${describeNamedInput(block, "CONDITION", "an unknown condition")}`;
      case "ControlForever":
        return "Repeat forever";
      case "ControlStop":
        return stopModeText(getField(block, "STOP", getField(block, "stop", "STACK")));
      case "SoundSetEffect":
        return `Set sound ${soundEffectText(getField(block, "OPTION", ""))} to ${describeNamedInput(block, "VALUE")}`;
      case "SoundStop":
        return "Stop all sounds";
      case "DoubleMotorWhenTapped":
        return "When the double motor is tapped";
      case "ControllerWhenLever":
        return `When the ${describeFieldValue(block, "LEVER", "controller").toLowerCase()} lever is pushed ${leverDirectionText(getField(block, "OPTION", ""))}`;
      case "ControllerIsLever":
        return `the ${describeFieldValue(block, "LEVER", "controller").toLowerCase()} lever is pushed ${leverDirectionText(getField(block, "OPTION", ""))}`;
      case "ControllerAngle":
        return `the ${controllerLeverText(block)} lever angle`;
      case "ControllerPosition":
        return `the ${controllerLeverText(block)} lever position`;
      case "ColorSensorWhenColor":
      case "ColorSensorsWhenColor":
        return `When the color sensor detects ${colorValueToText(getField(block, "COLOR", ""))}`;
      case "ColorSensorColor":
        return "the detected color";
      case "ColorSensorIsColor":
      case "ColorSensorsIsColor":
        return `the color sensor detects ${colorValueToText(
          getInputBlock(block, "COLOR")
            ? readLiteralValue(getInputBlock(block, "COLOR"))
            : getInputShadow(block, "COLOR")
              ? readLiteralValue(getInputShadow(block, "COLOR"))
              : getField(block, "COLOR", "")
        )}`;
      case "ColorSensorReflection":
        return "the color sensor reflection";
      case "ColorSensorIsReflection":
        return `the color sensor reflection ${compareOperatorText(getField(block, "COMPARATOR", getField(block, "OP", "")))} ${describeNamedInput(block, "VALUE", describeFieldValue(block, "VALUE", "50"))}`;
      case "ColorSensorHsb":
        return `the color sensor ${colorHsbOptionText(getField(block, "OPTION", "HUE"))}`;
      case "EventsSendMessage":
        return `Send message ${describeNamedInput(block, "MESSAGE")} ${messageOptionText(getField(block, "OPTION", "CONTINUE"))}`;
      case "EventsWhen":
        return `When ${describeNamedInput(block, "CONDITION", "the condition is met")}`;
      case "EventsWhenMessageReceived":
        return `When message ${quoteIfNeeded(getField(block, "MESSAGE", ""))} is received`;
      case "MyBlockDefinition":
        return `Define custom block ${getCustomBlockName(block)}`;
      case "MyBlockPrototype": {
        const name = getCustomBlockName(block);
        const inputs = describeCustomBlockInputs(block);
        return inputs ? `Custom block ${name} with inputs ${inputs}` : `Custom block ${name}`;
      }
      case "MyBlockCall": {
        const name = getCustomBlockName(block);
        const inputs = describeCustomBlockInputs(block);
        return inputs ? `Run custom block ${name} with ${inputs}` : `Run custom block ${name}`;
      }
      case "MyBlockStringArg":
        return `the custom input ${humanizeCustomArgName(getField(block, "LABEL", "value"))}`;
      case "MyBlockStringArgShadow":
        return `the custom input ${humanizeCustomArgName(getField(block, "LABEL", "value"))}`;
      case "MusicSetTempoTo":
        return `Set music tempo to ${describeNamedInput(block, "TEMPO")}`;
      case "MusicTempo":
        return "the current music tempo";
      case "MusicPlayNoteForBeats":
        return `Play ${midiNoteValueToText(
          getInputBlock(block, "NOTE")
            ? describeInlineBlock(getInputBlock(block, "NOTE"))
            : getInputShadow(block, "NOTE")
              ? readLiteralValue(getInputShadow(block, "NOTE"))
              : ""
        )} with ${instrumentValueToText(
          getInputBlock(block, "INSTRUMENT")
            ? describeInlineBlock(getInputBlock(block, "INSTRUMENT"))
            : getInputShadow(block, "INSTRUMENT")
              ? readLiteralValue(getInputShadow(block, "INSTRUMENT"))
              : ""
        )} for ${describeNamedInput(block, "BEATS")} beats`;
      case "MusicPlayDrumForBeat": {
        const drumBlock = getInputBlock(block, "DRUM");
        const drumShadow = getInputShadow(block, "DRUM");
        const drumValue = drumBlock ? describeInlineBlock(drumBlock) : drumShadow ? readLiteralValue(drumShadow) : "";
        const drumText = drumBlock ? drumValue : drumValueToText(drumValue);
        return `Play ${drumText} for ${describeNamedInput(block, "BEATS")} beats`;
      }
      case "SoundPlaySound": {
        const soundBlock = getInputBlock(block, "SOUND");
        const soundText = soundBlock
          ? describeInlineBlock(soundBlock)
          : (getField(getInputShadow(block, "SOUND"), "VALUE", "") || "Dog");
        return `Play sound of ${soundText}`;
      }
      case "AIPoseBodyWhenPerson":
      case "AIPoseWhenPerson":
        return `When a person ${aiPersonOptionText(getField(block, "OPTION", ""))}`;
      case "AIPoseBodyPointPosition":
        return `the ${describeFieldValue(block, "AXIS")} position of the ${describeFieldValue(block, "LANDMARK").replace(/_/g, " ")}`;
      case "AIPoseBodyWhenPointsTouching":
      case "AIPoseWhenTouching":
        return `When ${describeFieldValue(block, "ONE").replace(/_/g, " ")} touches ${describeFieldValue(block, "TWO").replace(/_/g, " ")}`;
      case "OperatorsOr":
        return `${describeNamedInput(block, "A")} or ${describeNamedInput(block, "B")}`;
      case "OperatorsAnd":
        return `${describeNamedInput(block, "A")} and ${describeNamedInput(block, "B")}`;
      case "OperatorsNot":
        return `not ${describeNamedInput(block, "VALUE")}`;
      case "OperatorsCompare":
        return `${describeNamedInput(block, "A")} ${compareOperatorText(getField(block, "OP", ""))} ${describeNamedInput(block, "B")}`;
      case "OperatorsRandom":
        return `a random number from ${describeNamedInput(block, "A")} to ${describeNamedInput(block, "B")}`;
      case "OperatorsMathFunction":
        return `${mathFunctionText(getField(block, "FUN", ""))} of ${describeNamedInput(block, "A")}`;
      case "DataContains":
        return `${describeNamedInput(block, "WORD")} contains ${describeNamedInput(block, "SUBSTRING")}`;
      case "DataVariableSet":
        return `Set variable ${getVariableFieldName(block, "VARIABLE")} to ${describeNamedInput(block, "VALUE")}`;
      case "DataVariableChangeBy":
        return `Change variable ${getVariableFieldName(block, "VARIABLE")} by ${describeNamedInput(block, "VALUE")}`;
      case "DataVariableGet":
        return `variable ${getField(block, "LABEL", getVariableFieldName(block, "VARIABLE"))}`;
      case "DataListAddItems":
        return `Add ${describeNamedInput(block, "VALUES")} to ${normalizeListPhrase(getVariableFieldName(block, "LIST", "list"))}`;
      case "DataListClear":
        return `Delete all items from ${normalizeListPhrase(getVariableFieldName(block, "LIST", "list"))}`;
      case "DataListItemAtIndex":
        return `the item in ${normalizeListPhrase(describeNamedInput(block, "LIST", getVariableFieldName(block, "LIST", "list")))} at ${describeListIndexReference(block)}`;
      case "DataListAggregate": {
        const listName = normalizeListPhrase(describeNamedInput(block, "LIST", getVariableFieldName(block, "LIST", "list")));
        const aggregate = String(getField(block, "AGG", "")).toUpperCase();
        if (aggregate === "LENGTH") return `the length of ${listName}`;
        return `${humanizeToken(aggregate)} of ${listName}`;
      }
      case "DataListShadow":
        return normalizeListPhrase(resolveVariableName(getField(block, "VALUE", ""), "list"));
      case "DataJoin":
        return `${describeNamedInput(block, "A")} joined with ${describeNamedInput(block, "B")}`;
      case "DataAnswer":
        return "the current answer";
      case "DataAsk":
        return `Ask ${describeNamedInput(block, "MESSAGE")}`;
      case "DataWrite":
        return `Write ${describeNamedInput(block, "MESSAGE")}`;
      case "DataLength":
        return `the length of ${describeNamedInput(block, "A")}`;
      case "DataResetTimer":
        return "Reset the timer";
      case "DataTimer":
        return "the timer";
      case "DataLetterOf":
        return `letter ${describeNamedInput(block, "INDEX")} of ${describeNamedInput(block, "WORD")}`;
      case "AIPoseBodyHasPerson":
      case "AIPoseIsPerson":
        return "a person is visible";
      case "AIPoseBodyDistancePoints":
        return `the distance between ${describeFieldValue(block, "ONE").replace(/_/g, " ")} and ${describeFieldValue(block, "TWO").replace(/_/g, " ")}`;
      case "AIPoseBodyAnglePoints":
        return `the angle between ${describeFieldValue(block, "ONE").replace(/_/g, " ")} and ${describeFieldValue(block, "TWO").replace(/_/g, " ")}`;
      case "AIPoseClassifierWhenClassDetected":
      case "AIPoseWhenClassDetected":
        return `When ${aiPoseClassValueToText(getField(block, "CLASSINDEX", ""))} is detected`;
      case "AIPoseClassifierConfidenceForClass":
      case "AIPoseConfidenceForClass":
        return `the confidence for ${aiPoseClassValueToText(getField(block, "CLASSINDEX", ""))}`;
      case "AIPoseClassifierIsClass":
      case "AIPoseIsActiveClass":
        return `${aiPoseClassValueToText(getField(block, "CLASSINDEX", ""))} is detected`;
      case "MotorIsGesture":
        return `the motor detects a ${motorDirectionText(getField(block, "GESTURE", "Cw"))} gesture`;
      case "DoubleMotorIsGesture":
        return `the ${describeFieldValue(block, "MOTOR", "selected").toLowerCase()} motor detects a ${motorDirectionText(getField(block, "GESTURE", "Cw"))} gesture`;
      case "MotorReporter": {
        const option = describeFieldValue(block, "OPTION", "value").toLowerCase();
        return `the motor ${option}`;
      }
      case "DoubleMotorReporter": {
        const motor = describeFieldValue(block, "MOTOR", "selected").toLowerCase();
        const option = describeFieldValue(block, "OPTION", "value").toLowerCase();
        return `the ${motor} motor ${option}`;
      }
      default:
        return null;
    }
  }

  function describeInputValue(input) {
    if (!input) return "";
    if (input.block) return describeInlineBlock(input.block);
    if (input.shadow) return describeInlineBlock(input.shadow);
    return "";
  }

  function describeInlineBlock(block) {
    if (!block) return "empty";

    const known = describeKnownBlock(block);
    if (known) {
      return known;
    }

    const literalValue = readLiteralValue(block);
    if (literalValue !== null && !block.inputs) {
      return formatLiteralValue(literalValue);
    }

    if (block.type === "EventsIsKeyPressed") {
      return `${getField(block, "KEY", "a key")} key is pressed`;
    }

    return describeBlock(block, { omitBodyInputs: true });
  }

  function describeBlock(block, options = {}) {
    if (!block) return "Unknown block";

    const known = describeKnownBlock(block);
    if (known) return known;

    const omitBodyInputs = Boolean(options.omitBodyInputs);
    const details = [];
    const fields = block.fields || {};

    Object.entries(fields).forEach(([name, value]) => {
      if (value === "" || value === null || value === undefined) return;
      details.push(`${humanizeToken(name)}: ${formatLiteralValue(value)}`);
    });

    Object.entries(block.inputs || {}).forEach(([name, input]) => {
      if (omitBodyInputs && isBodyInputName(name)) return;
      const description = describeInputValue(input);
      if (!description) return;
      details.push(`${humanizeToken(name)}: ${description}`);
    });

    const label = genericBlockLabel(block);
    return details.length ? `${label} (${details.join(", ")})` : label;
  }

  function parseLiteralExpression(block) {
    if (describeKnownBlock(block)) {
      return null;
    }
    if (block?.inputs && Object.keys(block.inputs).length) {
      return null;
    }
    const literalValue = readLiteralValue(block);
    if (literalValue === null) return null;
    return {
      kind: "literalExpression",
      id: block.id || createId(),
      value: literalValue,
      rawBlock: cloneJson(block),
    };
  }

  function parseExpression(block) {
    if (!block) {
      return { kind: "unknownExpression", id: createId(), label: "an empty condition" };
    }

    if (block.type === "EventsIsKeyPressed") {
      return {
        kind: "keyPressedExpression",
        id: block.id || createId(),
        key: getField(block, "KEY", "Unknown"),
        rawBlock: cloneJson(block),
      };
    }

    const literal = parseLiteralExpression(block);
    if (literal) {
      return literal;
    }

    return {
      kind: "genericExpression",
      id: block.id || createId(),
      label: describeBlock(block, { omitBodyInputs: true }),
      rawBlock: cloneJson(block),
    };
  }

  function parseGenericBranches(block) {
    return Object.entries(block?.inputs || {})
      .filter(([name]) => isBodyInputName(name))
      .map(([name, input]) => ({
        name,
        body: parseStatementChain(input?.block || null),
      }))
      .filter((branch) => branch.body.length);
  }

  function parseStatement(block) {
    if (!block) return null;

    switch (block.type) {
      case "DoubleMotorForSteps":
        return {
          kind: "move",
          id: block.id || createId(),
          direction: getField(block, "DIRECTION", "Forward"),
          value: getShadowFieldValue(getInputShadow(block, "VALUE"), "NUMBER", 1),
          rawBlock: cloneJson(block),
        };
      case "DoubleMotorTurn":
        return {
          kind: "turn",
          id: block.id || createId(),
          direction: getField(block, "DIRECTION", "Left"),
          degrees: getShadowFieldValue(getInputShadow(block, "DEGREES"), "VALUE", 90),
          rawBlock: cloneJson(block),
        };
      case "ControlRepeat":
        return {
          kind: "repeat",
          id: block.id || createId(),
          times: getShadowFieldValue(getInputShadow(block, "TIMES"), "NUMBER", 1),
          body: parseStatementChain(getInputBlock(block, "BODY")),
          rawBlock: cloneJson(block),
        };
      case "MotorRunForRotations":
        return {
          kind: "motorRunForRotations",
          id: block.id || createId(),
          direction: getField(block, "DIRECTION", "Cw"),
          unit: getField(block, "UNIT", "ROTATIONS"),
          value: getShadowFieldValue(getInputShadow(block, "VALUE"), "VALUE", 1),
          rawBlock: cloneJson(block),
        };
      case "DataVariableSet": {
        const valueShadow = getInputShadow(block, "VALUE");
        const textValue = valueShadow?.type === "ShadowText" ? getField(valueShadow, "TEXT", "") : null;
        const numberValue = valueShadow?.type === "ShadowNumber" ? getField(valueShadow, "NUMBER", "") : null;
        return {
          kind: "dataVariableSet",
          id: block.id || createId(),
          name: getVariableFieldName(block, "VARIABLE"),
          value: textValue != null ? textValue : numberValue != null ? Number(numberValue) : describeNamedInput(block, "VALUE"),
          valueType: textValue != null ? "text" : numberValue != null ? "number" : "generic",
          rawBlock: cloneJson(block),
        };
      }
      case "DataVariableChangeBy":
        return {
          kind: "dataVariableChangeBy",
          id: block.id || createId(),
          name: getVariableFieldName(block, "VARIABLE"),
          value: getShadowFieldValue(getInputShadow(block, "VALUE"), "NUMBER", 1),
          rawBlock: cloneJson(block),
        };
      case "ControlIf":
        return {
          kind: "if",
          id: block.id || createId(),
          condition: parseExpression(getInputBlock(block, "CONDITION")),
          body: parseStatementChain(getInputBlock(block, "BODY")),
          rawBlock: cloneJson(block),
        };
      case "ControlWaitUntil":
        return {
          kind: "waitUntil",
          id: block.id || createId(),
          condition: parseExpression(getInputBlock(block, "CONDITION")),
          rawBlock: cloneJson(block),
        };
      case "DoubleMotorStartMove":
        return {
          kind: "startMove",
          id: block.id || createId(),
          direction: getField(block, "DIRECTION", "Forward"),
          rawBlock: cloneJson(block),
        };
      case "DoubleMotorStopMove":
        return {
          kind: "stopMove",
          id: block.id || createId(),
          rawBlock: cloneJson(block),
        };
      case "SoundPlaySound":
        return {
          kind: "playSound",
          id: block.id || createId(),
          sound: normalizeSoundName(getField(getInputShadow(block, "SOUND"), "VALUE", "Sound")),
          soundLabel: getInputBlock(block, "SOUND") ? describeInlineBlock(getInputBlock(block, "SOUND")) : "",
          option: getField(block, "OPTION", "CONTINUE"),
          rawBlock: cloneJson(block),
        };
      default:
        return {
          kind: "genericStatement",
          id: block.id || createId(),
          label: describeBlock(block, { omitBodyInputs: true }),
          branches: parseGenericBranches(block),
          rawBlock: cloneJson(block),
        };
    }
  }

  function parseStatementChain(block) {
    const statements = [];
    const visited = new Set();
    let current = block;

    while (current) {
      const blockId = current.id || JSON.stringify(current).slice(0, 120);
      if (visited.has(blockId)) {
        statements.push({
          kind: "genericStatement",
          id: createId(),
          label: "Loop detected while parsing blocks",
          branches: [],
          rawBlock: cloneJson(current),
        });
        break;
      }
      visited.add(blockId);
      const parsed = parseStatement(current);
      if (parsed) {
        statements.push(parsed);
      }
      current = current.next?.block || null;
    }

    return statements;
  }

  const TRIGGER_DEFINITIONS = [
    {
      kind: "programStart",
      matchTypes: ["EventsWhenProgramStarts"],
      canonicalType: "EventsWhenProgramStarts",
      parseFields: () => ({}),
      serializeFields: () => ({}),
    },
    {
      kind: "messageReceivedTrigger",
      matchTypes: ["EventsWhenMessageReceived"],
      canonicalType: "EventsWhenMessageReceived",
      parseFields: (block) => ({ message: getField(block, "MESSAGE", "") }),
      serializeFields: (trigger) => ({ MESSAGE: trigger.message || "" }),
    },
    {
      kind: "doubleMotorTappedTrigger",
      matchTypes: ["DoubleMotorWhenTapped"],
      canonicalType: "DoubleMotorWhenTapped",
      parseFields: () => ({}),
      serializeFields: () => ({}),
    },
    {
      kind: "keyPressedTrigger",
      matchTypes: ["EventsIsKeyPressed", "EventsWhenKeyPressed"],
      canonicalType: "EventsWhenKeyPressed",
      parseFields: (block) => ({ key: getField(block, "KEY", "Unknown") }),
      serializeFields: (trigger) => ({ KEY: trigger.key || "ArrowUp" }),
    },
    {
      kind: "colorSensorWhenColorTrigger",
      matchTypes: ["ColorSensorWhenColor", "ColorSensorsWhenColor"],
      canonicalType: "ColorSensorWhenColor",
      parseFields: (block) => ({ color: getField(block, "COLOR", "-1") }),
      serializeFields: (trigger) => ({ COLOR: trigger.color ?? -1 }),
    },
  ];

  const TRIGGER_DEFINITION_BY_TYPE = new Map(
    TRIGGER_DEFINITIONS.flatMap((definition) => definition.matchTypes.map((type) => [type, definition]))
  );
  const TRIGGER_DEFINITION_BY_KIND = new Map(
    TRIGGER_DEFINITIONS.map((definition) => [definition.kind, definition])
  );

  function parseTrigger(block) {
    if (!block) {
      return { kind: "unknownTrigger", id: createId(), label: "Unknown start" };
    }

    const definition = TRIGGER_DEFINITION_BY_TYPE.get(block.type);
    if (definition) {
      return {
        kind: definition.kind,
        id: block.id || createId(),
        ...definition.parseFields(block),
        rawBlock: cloneJson(block),
      };
    }

    return {
      kind: "genericTrigger",
      id: block.id || createId(),
      label: describeBlock(block, { omitBodyInputs: true }),
      rawBlock: cloneJson(block),
    };
  }

  function isTriggerBlock(block) {
    const type = String(block?.type || "");
    return (
      type === "EventsWhenProgramStarts" ||
      type === "EventsWhenKeyPressed" ||
      type === "EventsWhenMessageReceived" ||
      /^EventsWhen/.test(type) ||
      /^AIPose.*When/.test(type) ||
      /^ColorSensorWhen/.test(type) ||
      /^ControllerWhen/.test(type) ||
      /^DoubleMotorWhen/.test(type)
    );
  }

  function projectToAst(project) {
    currentVariableEntries = cloneJson(project?.canvas?.variables || []);
    const topBlocks = project?.canvas?.blocks?.blocks || [];
    const scripts = topBlocks.map((block) => {
      const topLevelTrigger = isTriggerBlock(block)
        ? parseTrigger(block)
        : {
            kind: "genericTrigger",
            id: block.id || createId(),
            label: block.type === "MyBlockDefinition"
              ? describeBlock(block, { omitBodyInputs: true })
              : `Standalone block: ${describeBlock(block, { omitBodyInputs: true })}`,
            rawBlock: cloneJson(block),
          };

      const body = parseStatementChain(block.next?.block || null);

      return {
        id: block.id || createId(),
        trigger: topLevelTrigger,
        body,
        position: {
          x: Number(block.x) || 125,
          y: Number(block.y) || 100,
        },
      };
    });

    return {
      kind: "program",
      name: project?.manifest?.name || "Untitled Project",
      scripts,
      metadata: {
        manifestType: project?.manifest?.type || "word",
        hardware: cloneJson(project?.manifest?.hardware || []),
        palette: project?.canvas?.palette || "core",
        sounds: cloneJson(project?.canvas?.sounds || []),
        messages: cloneJson(project?.canvas?.messages || []),
        variables: cloneJson(project?.canvas?.variables || []),
      },
    };
  }

  function deepCloneBlock(rawBlock) {
    return rawBlock ? cloneJson(rawBlock) : null;
  }

  function makeInputState(block, shadow) {
    const input = {};
    if (block) input.block = block;
    if (shadow) input.shadow = shadow;
    return input;
  }

  function makeShadowBlock(type, fields, id) {
    return { type, id: id || createId(), fields: { ...fields } };
  }

  function serializeExpression(node) {
    if (!node) return null;

    if (node.rawBlock && (
      node.kind === "unknownExpression" ||
      node.kind === "genericExpression" ||
      node.kind === "literalExpression"
    )) {
      return deepCloneBlock(node.rawBlock);
    }

    switch (node.kind) {
      case "keyPressedExpression": {
        const block = deepCloneBlock(node.rawBlock) || { type: "EventsIsKeyPressed", id: node.id || createId() };
        block.type = "EventsIsKeyPressed";
        block.id = node.id || block.id || createId();
        block.fields = { ...(block.fields || {}), KEY: node.key || "ArrowUp" };
        delete block.next;
        return block;
      }
      case "unknownExpression":
      case "genericExpression":
      case "literalExpression":
      default:
        return deepCloneBlock(node.rawBlock);
    }
  }

  function serializeStatementChain(statements) {
    if (!statements?.length) return null;

    let firstBlock = null;
    let previousBlock = null;

    statements.forEach((statement) => {
      const currentBlock = serializeStatement(statement);
      if (!currentBlock) return;
      if (!firstBlock) {
        firstBlock = currentBlock;
      }
      if (previousBlock) {
        previousBlock.next = { block: currentBlock };
      }
      previousBlock = currentBlock;
    });

    return firstBlock;
  }

  function serializeGenericBranches(block, branches) {
    if (!branches?.length) return;
    block.inputs = { ...(block.inputs || {}) };
    branches.forEach((branch) => {
      if (!branch?.name) return;
      block.inputs[branch.name] = makeInputState(serializeStatementChain(branch.body || []), null);
    });
  }

  function serializeStatement(node) {
    if (!node) return null;
    if (node.kind === "unknownStatement" || node.kind === "genericStatement") {
      const raw = deepCloneBlock(node.rawBlock);
      if (raw) {
        delete raw.next;
        serializeGenericBranches(raw, node.branches);
      }
      return raw;
    }

    let block = deepCloneBlock(node.rawBlock) || { id: node.id || createId() };
    block.id = node.id || block.id || createId();
    delete block.next;

    switch (node.kind) {
      case "move":
        block.type = "DoubleMotorForSteps";
        block.fields = { ...(block.fields || {}), DIRECTION: node.direction || "Forward" };
        block.inputs = {
          ...(block.inputs || {}),
          VALUE: makeInputState(null, makeShadowBlock("ShadowNumber", { NUMBER: Number(node.value) || 1 })),
        };
        return block;
      case "turn":
        block.type = "DoubleMotorTurn";
        block.fields = { ...(block.fields || {}), DIRECTION: node.direction || "Left" };
        block.inputs = {
          ...(block.inputs || {}),
          DEGREES: makeInputState(null, makeShadowBlock("TurnForDegreesShadow", { VALUE: Number(node.degrees) || 90 })),
        };
        return block;
      case "repeat":
        block.type = "ControlRepeat";
        block.inputs = {
          ...(block.inputs || {}),
          TIMES: makeInputState(null, makeShadowBlock("ShadowNumber", { NUMBER: Number(node.times) || 1 })),
          BODY: makeInputState(serializeStatementChain(node.body || []), null),
        };
        return block;
      case "motorRunForRotations":
        block.type = "MotorRunForRotations";
        block.fields = {
          ...(block.fields || {}),
          DIRECTION: node.direction || "Cw",
          UNIT: node.unit || "ROTATIONS",
        };
        block.inputs = {
          ...(block.inputs || {}),
          VALUE: makeInputState(null, makeShadowBlock("RotationsShadow", { VALUE: Number(node.value) || 1 })),
        };
        return block;
      case "dataVariableSet":
        block.type = "DataVariableSet";
        block.fields = {
          ...(block.fields || {}),
          VARIABLE: getVariableEntryByName(node.name, "Var") || { id: createId(), name: String(node.name || "variable"), type: "Var" },
        };
        block.inputs = {
          ...(block.inputs || {}),
          VALUE: makeInputState(
            null,
            node.valueType === "number"
              ? makeShadowBlock("ShadowNumber", { NUMBER: Number(node.value) || 0 })
              : makeShadowBlock("ShadowText", { TEXT: String(node.value ?? "") })
          ),
        };
        return block;
      case "dataVariableChangeBy":
        block.type = "DataVariableChangeBy";
        block.fields = {
          ...(block.fields || {}),
          VARIABLE: getVariableEntryByName(node.name, "Var") || { id: createId(), name: String(node.name || "variable"), type: "Var" },
        };
        block.inputs = {
          ...(block.inputs || {}),
          VALUE: makeInputState(null, makeShadowBlock("ShadowNumber", { NUMBER: Number(node.value) || 0 })),
        };
        return block;
      case "if":
        block.type = "ControlIf";
        block.inputs = {
          ...(block.inputs || {}),
          CONDITION: makeInputState(serializeExpression(node.condition), null),
          BODY: makeInputState(serializeStatementChain(node.body || []), null),
        };
        return block;
      case "waitUntil":
        block.type = "ControlWaitUntil";
        block.inputs = {
          ...(block.inputs || {}),
          CONDITION: makeInputState(serializeExpression(node.condition), null),
        };
        return block;
      case "startMove":
        block.type = "DoubleMotorStartMove";
        block.fields = { ...(block.fields || {}), DIRECTION: node.direction || "Forward" };
        block.inputs = block.inputs || {};
        return block;
      case "stopMove":
        block.type = "DoubleMotorStopMove";
        block.fields = block.fields || {};
        block.inputs = block.inputs || {};
        return block;
      case "playSound":
        block.type = "SoundPlaySound";
        block.fields = { ...(block.fields || {}), OPTION: node.option || "CONTINUE" };
        block.inputs = {
          ...(block.inputs || {}),
          SOUND: makeInputState(null, makeShadowBlock("soundShadow", { VALUE: normalizeSoundName(node.sound || "Dog") })),
        };
        return block;
      default:
        return null;
    }
  }

  function serializeTrigger(trigger, position, body) {
    let block = deepCloneBlock(trigger?.rawBlock) || { id: trigger?.id || createId() };
    block.id = trigger?.id || block.id || createId();
    block.x = Number(position?.x) || 125;
    block.y = Number(position?.y) || 100;

    const definition = TRIGGER_DEFINITION_BY_KIND.get(trigger?.kind);
    if (definition) {
      block.type = definition.canonicalType;
      block.fields = { ...(block.fields || {}), ...definition.serializeFields(trigger) };
    } else if (trigger?.kind === "genericTrigger" || trigger?.kind === "unknownTrigger") {
      block = deepCloneBlock(trigger.rawBlock) || block;
      block.x = Number(position?.x) || 125;
      block.y = Number(position?.y) || 100;
    } else {
      block.type = "EventsWhenProgramStarts";
    }

    if (body) {
      block.next = { block: body };
    } else {
      delete block.next;
    }

    return block;
  }

  function collectReferencedSounds(program) {
    const sounds = new Set(program?.metadata?.sounds || []);

    function fromRawSoundBlock(block) {
      if (block?.type !== "SoundPlaySound") return null;
      return normalizeSoundName(getField(getInputShadow(block, "SOUND"), "VALUE", ""));
    }

    function walkStatements(statements) {
      (statements || []).forEach((statement) => {
        if (statement.kind === "playSound" && statement.sound) {
          sounds.add(normalizeSoundName(statement.sound));
        }

        const rawSound = fromRawSoundBlock(statement.rawBlock);
        if (rawSound) {
          sounds.add(rawSound);
        }

        if (statement.kind === "repeat" || statement.kind === "if") {
          walkStatements(statement.body);
        }

        (statement.branches || []).forEach((branch) => {
          walkStatements(branch.body);
        });
      });
    }

    (program?.scripts || []).forEach((script) => walkStatements(script.body));
    return Array.from(sounds).filter(Boolean);
  }

  function collectReferencedMessages(program, baseProject) {
    const messages = new Set(baseProject?.canvas?.messages || program?.metadata?.messages || []);

    function fromMessageTrigger(trigger) {
      const rawBlock = trigger?.rawBlock;
      if (rawBlock?.type === "EventsWhenMessageReceived") {
        const message = rawBlock.fields?.MESSAGE;
        if (message) {
          messages.add(String(message));
        }
      }
    }

    function fromMessageStatement(statement) {
      const rawBlock = statement?.rawBlock;
      if (rawBlock?.type === "EventsSendMessage") {
        const message = rawBlock.inputs?.MESSAGE?.block?.fields?.VALUE
          ?? rawBlock.inputs?.MESSAGE?.shadow?.fields?.VALUE
          ?? rawBlock.inputs?.MESSAGE?.block?.fields?.TEXT
          ?? rawBlock.inputs?.MESSAGE?.shadow?.fields?.TEXT;
        if (message) {
          messages.add(String(message));
        }
      }
    }

    function walkStatements(statements) {
      (statements || []).forEach((statement) => {
        fromMessageStatement(statement);
        if (statement.kind === "repeat" || statement.kind === "if") {
          walkStatements(statement.body);
        }
        (statement.branches || []).forEach((branch) => walkStatements(branch.body));
      });
    }

    (program?.scripts || []).forEach((script) => {
      fromMessageTrigger(script.trigger);
      walkStatements(script.body);
    });

    return Array.from(messages).filter(Boolean);
  }

  function applyAstToProject(program, baseProject) {
    const project = cloneJson(baseProject || {});
    project.manifest = { ...(project.manifest || {}) };
    project.canvas = { ...(project.canvas || {}) };
    project.canvas.blocks = { ...(project.canvas.blocks || {}) };

    project.manifest.name = program.name || project.manifest.name || "Untitled Project";
    project.manifest.type = program.metadata?.manifestType || project.manifest.type || "word";
    project.manifest.hardware = cloneJson(program.metadata?.hardware || project.manifest.hardware || []);

    project.canvas.palette = program.metadata?.palette || project.canvas.palette || "core";
    project.canvas.sounds = collectReferencedSounds(program);
    project.canvas.messages = collectReferencedMessages(program, project);
    project.canvas.variables = cloneJson(program.metadata?.variables || project.canvas.variables || []);
    project.canvas.blocks.languageVersion = project.canvas.blocks.languageVersion || 1;
    project.canvas.blocks.blocks = (program.scripts || []).map((script, index) => {
      const body = serializeStatementChain(script.body || []);
      const position = script.position || { x: 125, y: 100 + index * 120 };
      return serializeTrigger(script.trigger, position, body);
    });

    return project;
  }

  function parseJsonInput(value) {
    const result = { scripts: [], statements: [] };

    if (value?.kind === "program") {
      result.scripts.push(...cloneJson(value.scripts || []));
      return result;
    }

    if (value?.kind === "script") {
      result.scripts.push(cloneJson(value));
      return result;
    }

    if (value?.kind) {
      result.statements.push(cloneJson(value));
      return result;
    }

    const blocks = Array.isArray(value)
      ? value
      : Array.isArray(value?.blocks)
        ? value.blocks
        : value?.type
          ? [value]
          : [];

    blocks.forEach((block) => {
      if (!block?.type) return;

      if (isTriggerBlock(block)) {
        result.scripts.push({
          id: block.id || createId(),
          trigger: parseTrigger(block),
          body: parseStatementChain(block.next?.block || null),
          position: {
            x: Number(block.x) || 125,
            y: Number(block.y) || 100,
          },
        });
        return;
      }

      result.statements.push(...parseStatementChain(block));
    });

    return result;
  }

  window.LecpAdapter = {
    AVAILABLE_SOUND_NAMES,
    applyAstToProject,
    cloneJson,
    collectReferencedSounds,
    colorValueToText,
    createId,
    describeBlock,
    makeInputState,
    motorDirectionText,
    parseJsonInput,
    projectToAst,
  };
})();

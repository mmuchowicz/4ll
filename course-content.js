(() => {
  const COURSE_SOURCE = String.raw`@course: TADroid Robotics Basics
@id: robotics-basics
@version: 1

@module: Module 1 · What is a robot?

@lesson: Lesson 1 · Automatic systems or robots?
@step: Machines that follow rules vs machines that adapt
Think about the machines you encounter every day. An elevator arrives at your floor when you press a button, opens its doors on a timer, and carries you up a steel shaft. A vending machine drops a can into the tray after it validates your payment.
Are these machines robots?
To an engineer, the answer is no. They are sophisticated automatic systems. An elevator follows fixed mechanical tracks and deterministic relay switches. It does not calculate where you want to go before you tell it, it cannot steer around an obstacle in the hallway, and it cannot reconfigure its own mechanics if something unexpected happens.
A true robot is different because it possesses physical agency: the ability to actively measure an unpredictable physical environment, process those observations into decisions, and execute purposeful physical actions to change the world around it.

@step: The autonomy spectrum in the real world
The distinction between an automatic system and a robot comes down to how a machine handles uncertainty in physical space.
An electric toaster is an open-loop mechanism. It locks a spring, energizes a heating filament on a timer, and releases. It has no way of knowing whether the slot contains frozen bread, a bagel, or nothing at all; it runs the exact same cycle regardless of reality.
A modern climate control system is a closed-loop automated controller. It uses a temperature sensor to turn a furnace on and off. While it adapts to real-world feedback, it only regulates a single scalar value. It has no kinematic degrees of freedom and cannot move through or physically manipulate its environment.
On the other hand, a planetary exploration rover or an autonomous warehouse picker are true robots. A warehouse rover encounters dropped parcels, shifting obstacles, and uneven floors. It continuously calculates its position in three dimensions, plots dynamic paths around moving forklifts, and adjusts the grip force of its arm so it neither drops an item nor crushes it.

@lesson: Lesson 2 · The Sense-Think-Act loop
@step: The 3 essential jobs
Every robot operates through an unbroken cycle known as the Sense-Think-Act loop. If any of these three stages is absent, robotic agency collapses.
1. Sense: The robot samples the physical world through sensors, converting raw analog physics (like light reflectance, ultrasonic echoes, motor shaft angles, or mechanical pressure) into digital numbers.
2. Think: An onboard processor evaluates those numbers against an internal program. It calculates the error between where the robot is and where it wants to be, then determines what physical adjustments are required.
3. Act: The robot delivers physical work to the world through actuators either by spinning electric motors, opening gripper valves, or emitting acoustic signals.
Remove sensing, and a robot becomes a blind, dangerous mechanism plowing into obstacles. Remove thinking, and it becomes a remote-controlled puppet requiring an external brain. Remove acting, and it becomes a passive computer monitor observing a world it cannot touch.

@step: Wireless hardware and distributed intelligence
In traditional robotics kits, every motor and sensor connects with thick cables to a central controller brick. The LEGO CS&AI system eliminates this clutter through a distributed wireless architecture.
There is no central hub brick. Instead, the Double Motor, Single Motor, Controller and Color Sensor are independent smart modules. Each housing encloses its own rechargeable battery, Bluetooth transceiver, motor driver circuits, and dedicated microcontroller.
When you write code on your computer in Coding Canvas, your computer acts as the compiler and workbench. When you run your program, Coding Canvas compiles your commands and transmits them over Bluetooth directly to the smart components on your build plate. The microcontrollers inside the motors and sensors receive those instruction packets and execute them in real time.

@step: Meet the sense, think, and act pieces in your kit
@parts: 118091:whitex1
@parts: 118084:whitex1
@parts: 118092:whitex1
Before building, take a moment to explore the key pieces in the CS&AI set.
The Double Motor: A smooth rectangular housing enclosing two independent electric motors side by side. On its top face, locate the power button and status indicator. On its outer sides, find the circular output hubs. Each hub has a cross-axle socket that rotates under motor power and contains an internal optical encoder to measure rotation angles.
The Single Motor: A compact, single-axis actuator designed for lightweight mechanisms, steering assemblies, or lift arms.
The Color Sensor: A standalone wireless module featuring two circular optical lenses on its front face that project light and measure reflection levels.

@lesson: Lesson 3 · How does a robot follow a program?
@step: Every program needs a beginning
When you turn on a computer, it doesn't execute code at random; it needs an exact starting location in memory. In robotics, this entry point is called a reset vector.
In Coding Canvas, that starting point is represented by the 'When the program starts' block. The moment you press Run, the microcontroller initializes its instruction pointer right there, retrieves the first command, executes it, and advances down the line.
If you open a new project, this block is already there.

@step: Step-by-step execution
@parts: 118091:whitex1
A microcontroller may execute millions of instructions every second, but by default it still follows one simple rule: it finishes the current instruction before starting the next one.
When an instruction commands a motor to move for a specific duration or distance (such as spinning for 3 full rotations) it is typically a blocking action.
During a blocking command, the Program Counter pauses on that line. The processor continuously polls the motor's internal rotation encoder until the 3 rotations are complete. Only after the motor physically comes to rest does the Program Counter advance to the next command.
To feel this directly:
1. Turn on your Double Motor and ensure it is paired via Bluetooth to Coding Canvas.
2. Rest the motor module flat on the desk in front of you.
3. Place your left index finger gently on the left motor hub, and your right index finger on the right motor hub.
4. Run the sequential script below.

@sample
When the program starts
Run the left motor clockwise for 3 rotations
Run the right motor clockwise for 3 rotations
@end

Beneath your fingers, the motors move in strict succession. The left motor hums and spins three complete turns while the right motor sits entirely lifeless. Only when the left motor clicks to a halt does the right motor spin. This is sequential execution: step one must reach complete physical termination before step two begins.

@step: Two starting points
@parts: 118091:whitex1
As you noticed, everything under a single 'When the program starts block' runs strictly in order, but what would happen if we added a second starting block? Try it out!

@sample
When the program starts
Run the left motor clockwise for 3 rotations
@end

@sample
When the program starts
Run the right motor clockwise for 3 rotations
@end

Press Run once. Both trigger blocks fire at the same instant, so both motors start moving together instead of one after another.

@step: Why mobile robots require concurrency?
Sequential execution works for a robotic arm performing single-joint movements, but it fails on a two-wheeled driving robot.
If a rover ran sequential code to drive forward, it would spin the left wheel for three turns, stop, and then spin the right wheel for three turns. Instead of driving in a straight line, the chassis would swing back and forth in disjointed pivots. To move straight, both wheels must run simultaneously.
Handling multiple actions at the same time is called concurrency.

@step: Time-slicing
Think about how your phone behaves every day. It streams music, checks background notifications, and registers your every tap without hesitation.
It manages this through a scheduler. Instead of letting one heavy task monopolize the processor, the operating system parcels out computing time in razor-thin slices called time quanta. It dedicates a fraction of a millisecond to audio, pauses, catches your screen tap, pauses, and handles network traffic. Because it switches thousands of times each second, you get unbroken actions.
Coding Canvas applies this exact scheduling logic to physical hardware.
When you start a program, the engine catalogs every independent code stack into an active list of tasks called threads.
During each engine cycle, the processor advances Thread A until it reaches a natural yield point (like a motor command, a wait block, or a loop boundary). It bookmarks Thread A's position, switches to Thread B, and executes instructions there until Thread B yields.
Once every thread has taken its turn, the engine bundles the resulting commands into data packets and transmits them over Bluetooth to the smart modules.

@module: Module 2 · Memory, Functions & Queues
@lesson: Lesson 1 · Variables
@step: The goldfish problem
A basic machine only understands the exact present millisecond. When a distance sensor detects an obstacle, it reacts; the moment the obstacle moves away, that information vanishes completely.
Without internal memory, a machine cannot count how many items have passed on a conveyor, remember which room it just left, or calculate its average speed. It has no past and no future.
To give a machine history, programmers use variables.
A variable is a labeled container inside the microcontroller's Random-Access Memory. You give the container a name, store a value inside it, and change or inspect that value whenever your code runs. While physical sensors continuously fluctuate, a variable holds onto its value until your code explicitly tells it to change.

@sample
Set variable sound to "Dog"
@end


@module: Module 3 · Mechanical Foundations

@lesson: Lesson 1 · Degrees of Freedom: How Machines Move in Space
@step: How many ways can an object move?
Place a single LEGO beam flat on your desk. Without picking it up, slide it forward and backward. Now slide it left and right. Finally, spin it in place like the hand of a clock.
In physics and mechanical engineering, every independent direction or way a body can move is called a Degree of Freedom (often abbreviated as DoF).
If you pick that beam up off the desk into the open air, the possibilities double. In free 3D space, any rigid object has exactly 6 Degrees of Freedom:
3 translational (moving along straight axes: forward/back, left/right, up/down) and 3 rotational (turning around those axes: pitch, yaw, and roll).
A submarine moving through deep water uses all 6. But in robotics, we rarely want every part moving in every possible direction at once. We design mechanisms specifically to constrain motion to exact paths.

@step: Your arm as a kinematic chain
To understand how robotic arms are designed, you don't need a robot yet—your own body is an advanced mechanical manipulator.
Rest your right upper arm vertically against your ribcage and keep your shoulder completely still. Now bend and straighten your elbow.
Your forearm moves through an arc, but it can only rotate around a single axis passing through your elbow joint. Your elbow is a 1-DoF hinge joint. It cannot twist side-to-side or slide forward along your upper arm.
Now, unlock your shoulder while keeping your elbow rigid. Your shoulder is a ball-and-socket joint with 3 Degrees of Freedom: you can swing your arm forward and backward (pitch), out to the side and in (yaw), and rotate your entire arm inward or outward along its length (roll).
Roboticists call a sequence of rigid segments connected by joints a kinematic chain. By chaining multiple 1-DoF joints together at different angles, engineers build robotic arms that can reach any point in space.

@step: A motor is a 1-DoF rotational actuator
Take one LEGO motor from your kit. Feel the circular face where the axle hole is located.
When the motor receives power, the shaft does not slide in and out; it does not tilt off-axis. It rotates purely around a single central axis.
Therefore, a single motor provides exactly 1 rotational Degree of Freedom.
If you mount a long beam to that motor shaft, the tip of the beam can only travel along a fixed circle. Its motion is completely deterministic—meaning if you know the angle of the motor, you know the exact position of the beam.

@step: Building a 2-DoF planar manipulator
Let's assemble a basic 2-DoF kinematic chain using two motors to feel how independent axes combine.

1. Take Motor 1 and place it flat on the desk. This will act as the "base joint" (like your shoulder).
2. Take a long Technic beam (the "upper arm") and secure one end to the axle of Motor 1.
3. Attach the body of Motor 2 (the "elbow joint") to the free end of that beam.
4. Attach a second beam (the "forearm") to the rotating shaft of Motor 2.

Without turning the power on, gently move the second beam with your fingers.
Notice what happens:
Rotating Motor 1 swings the entire structure, changing the position of Motor 2 in space.
Rotating Motor 2 changes the angle between the two beams without moving Motor 1 at all.
Together, these two 1-DoF joints give the tip of the arm 2 Degrees of Freedom across a flat 2D plane.

@step: Controlled motion vs. flopping (The constraint problem)
What happens if a mechanism has more degrees of freedom than motors to control them?
Think of a standard door hinge: it has 1 DoF (it swings). If the wind blows, it slams shut because there is no actuator holding its position. This is an unconstrained or under-actuated degree of freedom.
In robotics, every degree of freedom must either be:

1. Actuated (driven and held by a motor), or
2. Constrained (locked physically by pins, frames, or guides).
If you build a robot with 4 moving joints but only 2 motors, the other 2 joints will flop unpredictably under gravity and inertia. Precision robotics requires matching your actuators and kinematic constraints to the exact degrees of freedom your task demands.

---

@lesson: Lesson 2 · Mechanical Advantage: Trading Distance for Force
@step: Why can't you open a heavy door near the hinge?
Walk up to a heavy door in your home or school.
First, place your palm at the outer edge of the door—near the handle, far away from the hinge—and push it open. It feels light and requires very little effort.
Now, place your palm just two inches away from the hinge side and try to push the door open again.
You will immediately feel that you need to push significantly harder to produce the exact same motion.
The door hasn't become heavier, and the hinges haven't changed. You are experiencing the fundamental trade-off of mechanical engineering: Mechanical Advantage.

@step: The golden rule of mechanics
Energy cannot be created out of nothing. In physics, mechanical work performed by a force acting over a linear distance is defined as:
Work = Force × Distance

If a machine requires a certain amount of work to move a load, you have two choices:

1. Apply a small force over a long distance, or
2. Apply a massive force over a very short distance.
The amount of mechanical work remains identical in both cases.
When a machine allows you to apply a smaller force to overcome a larger resistance by increasing the distance you move, we say the machine provides Mechanical Advantage.
Mechanical Advantage is calculated as the ratio of the output force to the input force:
MA = Output Force / Input Force

@step: Rotational systems and torque
Because robot motors rotate rather than slide, we measure rotational force as Torque.
Torque is the rotational equivalent of linear force. It is the product of the force applied and the perpendicular distance from the pivot point (called the lever arm or radius):
Torque = Force × Distance to pivot

When you pushed the door near the handle, your hand was far from the hinge (large radius). A small force multiplied by a large distance created enough torque to swing the heavy door.
When you pushed near the hinge (small radius), you had to exert a huge force to achieve that same required torque.

@step: Feeling motor torque and leverage
@parts: 118084:whitex1
@parts: 3703:blackx1
Let's feel this principle directly using a LEGO motor.

1. Connect a 16-hole long Technic beam to the single motor shaft so it acts like a long lever arm.
2. Turn on your Single Motor and ensure it is paired via Bluetooth to Coding Canvas.
3. Run the following code to command the motor to hold its position with moderate strength:

@sample
When the program starts
Start the motor at power 30
@end

Now, perform two tactile tests:

* Test 1 (Short lever arm): Try to stop the beam from rotating by pinching it with two fingers just 1 cm away from the center axle. Feel how difficult it is to resist the motor. The motor easily forces its way through your grip.
* Test 2 (Long lever arm): Place one finger at the very outer tip of the 15-hole beam (far from the center axle) and gently push against the rotation.
You will find that you can easily stall the motor with a light touch of a single finger.

@step: The engineering trade-off
Why did the motor stall so easily when you pushed the outer tip?
Because at the outer tip, your finger had a huge lever arm. Your tiny force was amplified into a large resisting torque at the axle, overcoming the motor's internal power.
However, look at the trade-off in movement:
For the motor to move the tip of that long beam by 10 centimeters, the axle only needs to rotate a few degrees.
Small rotation at the center produces large, fast travel at the tip.

* A long lever gives you high speed and large distance, but low force (low mechanical advantage).
* A short lever gives you high force and high torque, but low speed and small distance (high mechanical advantage).

@step: The foundation for simple machines
Every mechanical system you will build in this course—from gearboxes and pulley systems to rack-and-pinion steering—relies on this exact trade-off.
Whenever you design a robot and realize:

* "My motor is too weak to lift this arm" -> You need to increase mechanical advantage (trade distance/speed to gain torque).
* "My robot lifts easily, but moves far too slowly" -> You have excess torque and need to trade mechanical advantage for speed.
In the upcoming lessons, we will build mechanisms like gears and levers to control this balance with mathematical precision.
`;

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
        resolved = candidates.find((candidate) => candidate.color.toLowerCase() === color.toLowerCase()) || null;
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
        addError(lineNumber, 'A @lesson must appear after a @module.');
        return;
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
      addError(1, 'The course needs at least one @module.');
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

  const parsedCourse = parseCourse(COURSE_SOURCE);
  if (!parsedCourse.isValid) {
    console.error('[TADroid Lessons] Course validation failed.\n' + parsedCourse.errorText);
  }
  window.TadroidCourse = parsedCourse;
})();

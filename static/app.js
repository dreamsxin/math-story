const sceneDefinitions = {
  hill: {
    title: "小蜗牛爬山",
    chip: "先看感觉",
    kidLine: "这里越陡，小蜗牛就像在爬更难的坡。",
    description:
      "橙色弯弯线像一座山。绿色小点是小蜗牛站的地方，黄线表示它脚下这一小段坡到底有多陡。拖动位置，看看哪里最难爬，哪里最平。",
    grownupNote:
      "这是导数的直觉入口。我们先不说“导数”，只让孩子理解：同一条曲线，不同位置会有不同的陡峭程度。",
    prompts: [
      "小蜗牛走到哪里时，最像在爬陡坡？",
      "哪里看起来快要变平了？",
      "如果往右再走一点，会变得更难爬还是更好爬？",
    ],
    controls: [
      { key: "walk", label: "小蜗牛站在哪里", min: -4.5, max: 4.5, step: 0.1, value: 0.4 },
    ],
    viewport: [-6, 6, -1, 7],
    commands(values) {
      return [
        "hill(x) = 0.08x^3 - 0.7x + 3",
        `walk = ${values.walk}`,
        "Snail = (walk, hill(walk))",
        "Ground = (walk, 0)",
        "SlopeLine = Tangent(Snail, hill)",
        "Steepness = Slope(SlopeLine)",
        "Lift = Segment(Ground, Snail)",
      ];
    },
    style(api) {
      api.setColor("hill", 240, 139, 55);
      api.setLineThickness("hill", 8);
      api.setColor("Snail", 40, 160, 111);
      api.setPointSize("Snail", 9);
      api.setColor("SlopeLine", 255, 209, 102);
      api.setLineThickness("SlopeLine", 6);
      api.setColor("Lift", 45, 125, 210);
      api.setLineThickness("Lift", 4);
      api.setLabelVisible("Snail", true);
    },
    metrics(api) {
      const steep = safeNumber(api, "Steepness");
      return [
        { label: "这里的坡感觉", value: describeSlope(steep) },
        { label: "每走 1 小步，大约升高", value: `${formatNumber(Math.abs(steep))} 格` },
        { label: "现在是在上坡还是下坡", value: steep >= 0 ? "在上坡" : "在下坡" },
      ];
    },
  },
  tiles: {
    title: "小块块拼草地",
    chip: "小块块加起来",
    kidLine: "小块块切得越细，拼出来就越像真正的草地边边。",
    description:
      "橙色曲线下面像一块弯弯的草地。黄色小方块是在用很多小积木去拼这块草地。小积木越多，拼得就越像真的。",
    grownupNote:
      "这是积分的直觉入口。孩子先明白“很多很小的部分加起来能变成整体”，再去接受面积、求和与积分的关系。",
    prompts: [
      "小方块比较少的时候，哪里拼得不像？",
      "把小方块变多以后，边边是不是更贴近弯线了？",
      "你会想把大块切成更小块吗？为什么？",
    ],
    controls: [
      { key: "edge", label: "草地铺到哪里", min: 1.2, max: 5, step: 0.1, value: 3.8 },
      { key: "pieces", label: "用了多少小块块", min: 2, max: 36, step: 1, value: 6 },
    ],
    viewport: [-1, 6, -0.5, 8],
    commands(values) {
      return [
        "field(x) = 0.18x^2 + 0.6x + 1.2",
        `edge = ${values.edge}`,
        `pieces = ${values.pieces}`,
        "BlockArea = LeftSum(field, 0, edge, pieces)",
        "TrueArea = Integral(field, 0, edge)",
      ];
    },
    style(api) {
      api.setColor("field", 40, 160, 111);
      api.setLineThickness("field", 8);
      api.setColor("BlockArea", 255, 209, 102);
      api.setFilling("BlockArea", 0.35);
    },
    metrics(api) {
      const guess = safeNumber(api, "BlockArea");
      const real = safeNumber(api, "TrueArea");
      const gap = Math.abs(guess - real);
      return [
        { label: "小块块拼出来的面积", value: `${formatNumber(guess)} 格` },
        { label: "和真正草地差多少", value: `${formatNumber(gap)} 格` },
        { label: "现在拼得像不像", value: gap < 0.4 ? "已经很像了" : gap < 1 ? "有点像了" : "还可以更细" },
      ];
    },
  },
  rain: {
    title: "下雨装水桶",
    chip: "现在快不快",
    kidLine: "雨下得越大，水桶里的水就涨得越快。",
    description:
      "橙色线表示“现在雨下得有多大”，绿色线表示“水桶里已经装了多少水”。拖动时间点，你会发现：雨越大，水桶这时就涨得越快。",
    grownupNote:
      "这是微积分基本定理的儿童化版本。当前变化率决定总量的增长速度。我们不先讲定理名词，而是让孩子看到“此刻快慢”和“累计总量”之间的同步关系。",
    prompts: [
      "什么时候雨最大？那时水桶是不是也涨得最快？",
      "如果现在雨变小了，水桶还会继续涨吗？",
      "为什么总水量越来越多，但涨快涨慢会变化？",
    ],
    controls: [
      { key: "time", label: "看到第几个时刻", min: 0.4, max: 5.8, step: 0.1, value: 2.5 },
    ],
    viewport: [-0.5, 6.5, -0.5, 12],
    commands(values) {
      return [
        "rain(x) = 1.2sin(x) + 2.2",
        "Bucket(x) = -1.2cos(x) + 2.2x + 1.2",
        `time = ${values.time}`,
        "RainPoint = (time, rain(time))",
        "BucketPoint = (time, Bucket(time))",
        "RainNow = rain(time)",
        "WaterNow = Bucket(time)",
        "BucketTangent = Tangent(BucketPoint, Bucket)",
        "BucketSpeed = Slope(BucketTangent)",
        "RainBase = (time, 0)",
        "RainLift = Segment(RainBase, RainPoint)",
        "WaterLift = Segment(RainBase, BucketPoint)",
      ];
    },
    style(api) {
      api.setColor("rain", 240, 139, 55);
      api.setLineThickness("rain", 8);
      api.setColor("Bucket", 45, 125, 210);
      api.setLineThickness("Bucket", 7);
      api.setColor("RainPoint", 240, 139, 55);
      api.setColor("BucketPoint", 40, 160, 111);
      api.setPointSize("RainPoint", 8);
      api.setPointSize("BucketPoint", 8);
      api.setColor("BucketTangent", 255, 209, 102);
      api.setLineThickness("BucketTangent", 5);
      api.setColor("RainLift", 240, 139, 55);
      api.setColor("WaterLift", 40, 160, 111);
      api.setLineThickness("RainLift", 4);
      api.setLineThickness("WaterLift", 4);
      api.setLabelVisible("RainPoint", true);
      api.setLabelVisible("BucketPoint", true);
    },
    metrics(api) {
      const rainNow = safeNumber(api, "RainNow");
      const waterNow = safeNumber(api, "WaterNow");
      const bucketSpeed = safeNumber(api, "BucketSpeed");
      return [
        { label: "现在雨有多大", value: `${formatNumber(rainNow)} 格` },
        { label: "水桶里已经有多少", value: `${formatNumber(waterNow)} 格` },
        { label: "水桶现在涨得多快", value: `${formatNumber(bucketSpeed)} 格` },
      ];
    },
  },
  bike: {
    title: "骑车去公园",
    chip: "速度加起来",
    kidLine: "一路上每一小会儿走的路，加起来就是总路程。",
    description:
      "橙色线表示每一刻骑车有多快。黄色小条像很多很短的小路段，把这些小路段加起来，就能知道已经骑了多远。这就是积分能解决的真实问题。",
    grownupNote:
      "这是积分在真实问题里的样子：已知速度随时间变化，求一段时间内走过的距离。图像上就是把速度曲线下面的面积累加起来。",
    prompts: [
      "哪一段骑得最快？那一段是不是给总路程加得最多？",
      "如果早一点停下来，总路程会少多少？",
      "为什么只看最后一刻的速度，不能知道一共骑了多远？",
    ],
    controls: [
      { key: "stopTime", label: "骑到第几分钟", min: 1, max: 10, step: 0.5, value: 6 },
      { key: "slices", label: "分成多少小路段", min: 2, max: 40, step: 1, value: 8 },
    ],
    viewport: [-0.5, 10.5, -0.5, 8.5],
    commands(values) {
      return [
        "speed(x) = 3 + 1.2sin(0.8x) + 0.25x",
        `stopTime = ${values.stopTime}`,
        `slices = ${values.slices}`,
        "TripBlocks = LeftSum(speed, 0, stopTime, slices)",
        "TripDistance = Integral(speed, 0, stopTime)",
        "SpeedNow = speed(stopTime)",
        "StopPoint = (stopTime, SpeedNow)",
        "StopBase = (stopTime, 0)",
        "StopLift = Segment(StopBase, StopPoint)",
      ];
    },
    style(api) {
      api.setColor("speed", 240, 139, 55);
      api.setLineThickness("speed", 8);
      api.setColor("TripBlocks", 255, 209, 102);
      api.setFilling("TripBlocks", 0.35);
      api.setColor("StopPoint", 45, 125, 210);
      api.setPointSize("StopPoint", 8);
      api.setColor("StopLift", 45, 125, 210);
      api.setLineThickness("StopLift", 4);
      api.setLabelVisible("StopPoint", true);
    },
    metrics(api) {
      const speedNow = safeNumber(api, "SpeedNow");
      const distance = safeNumber(api, "TripDistance");
      const blocks = safeNumber(api, "TripBlocks");
      const gap = Math.abs(distance - blocks);
      return [
        { label: "现在骑得有多快", value: `${formatNumber(speedNow)} 米/秒` },
        { label: "小路段算出骑了多远", value: `${formatNumber(blocks)} 米` },
        { label: "更准确的答案大约是", value: `${formatNumber(distance)} 米` },
        { label: "两种答案差多少", value: `${formatNumber(gap)} 米` },
      ];
    },
  },
  area: {
    title: "曲线下面积",
    chip: "实战 1",
    kidLine: "有限个矩形只是估算；积分算的是矩形无限变细时的最终答案。",
    description:
      "这里的函数是 f(x)=0.25x^2+1。有限个小矩形一定会有误差，所以它们只是帮助我们看懂面积。微积分真正做的是：想象矩形越来越窄、越来越多，当宽度趋近 0 时，误差也趋近 0。这个极限值可以用原函数 F(b)-F(a) 精确算出来。",
    grownupNote:
      "有限黎曼和是近似，定积分是黎曼和在分割无限细时的极限。对 f(x)=0.25x^2+1，它的一个原函数是 F(x)=x^3/12+x，所以面积精确值是 F(b)-F(a)。",
    prompts: [
      "为什么这个阴影不像长方形、三角形那样容易套公式？",
      "只切成有限个矩形时，误差为什么还在？",
      "如果每个矩形的宽度越来越接近 0，误差会往哪里走？",
    ],
    controls: [
      { key: "leftA", label: "左端点 a", min: -3, max: 1, step: 0.1, value: -1 },
      { key: "rightB", label: "右端点 b", min: 1.5, max: 4, step: 0.1, value: 3 },
      { key: "rectN", label: "切成多少个矩形", min: 2, max: 60, step: 1, value: 8 },
    ],
    viewport: [-3.5, 4.5, -0.5, 7],
    commands(values) {
      const left = Math.min(values.leftA, values.rightB - 0.2);
      const right = Math.max(values.rightB, left + 0.2);

      return [
        "f(x) = 0.25x^2 + 1",
        `leftA = ${left}`,
        `rightB = ${right}`,
        `rectN = ${values.rectN}`,
        "Antiderivative(x) = x^3 / 12 + x",
        "AreaBlocks = LeftSum(f, leftA, rightB, rectN)",
        "ExactArea = Integral(f, leftA, rightB)",
        "FormulaArea = Antiderivative(rightB) - Antiderivative(leftA)",
        "RectWidth = (rightB - leftA) / rectN",
        "LeftPoint = (leftA, f(leftA))",
        "RightPoint = (rightB, f(rightB))",
        "LeftBase = (leftA, 0)",
        "RightBase = (rightB, 0)",
        "LeftWall = Segment(LeftBase, LeftPoint)",
        "RightWall = Segment(RightBase, RightPoint)",
        "BaseLine = Segment(LeftBase, RightBase)",
      ];
    },
    style(api) {
      api.setColor("f", 240, 139, 55);
      api.setLineThickness("f", 8);
      api.setColor("AreaBlocks", 255, 209, 102);
      api.setFilling("AreaBlocks", 0.36);
      api.setColor("LeftWall", 45, 125, 210);
      api.setColor("RightWall", 45, 125, 210);
      api.setColor("BaseLine", 45, 125, 210);
      api.setLineThickness("LeftWall", 4);
      api.setLineThickness("RightWall", 4);
      api.setLineThickness("BaseLine", 4);
      api.setColor("LeftPoint", 40, 160, 111);
      api.setColor("RightPoint", 40, 160, 111);
      api.setPointSize("LeftPoint", 7);
      api.setPointSize("RightPoint", 7);
      api.setLabelVisible("LeftPoint", true);
      api.setLabelVisible("RightPoint", true);
    },
    metrics(api) {
      const left = safeNumber(api, "leftA");
      const right = safeNumber(api, "rightB");
      const blocks = safeNumber(api, "AreaBlocks");
      const exact = safeNumber(api, "ExactArea");
      const formula = safeNumber(api, "FormulaArea");
      const width = safeNumber(api, "RectWidth");
      const gap = Math.abs(exact - blocks);

      return [
        { label: "函数", value: "f(x)=0.25x²+1" },
        { label: "要求的区间", value: `[${formatNumber(left)}, ${formatNumber(right)}]` },
        { label: "每个矩形宽度", value: `${formatNumber(width)} 格` },
        { label: "矩形估算面积", value: `${formatNumber(blocks)} 平方格` },
        { label: "积分精确面积", value: `${formatNumber(exact)} 平方格` },
        { label: "用 F(b)-F(a) 验算", value: `${formatNumber(formula)} 平方格` },
        { label: "估算误差", value: `${formatNumber(gap)} 平方格` },
      ];
    },
  },
};

const state = {
  applet: null,
  api: null,
  scene: "hill",
  values: {},
};

function setupApplet() {
  const params = {
    appName: "classic",
    width: 920,
    height: 690,
    showToolBar: false,
    showAlgebraInput: false,
    showMenuBar: false,
    showZoomButtons: true,
    enableShiftDragZoom: true,
    showResetIcon: false,
    language: "zh",
    appletOnLoad(api) {
      state.api = api;
      initializeValues();
      renderScene();
    },
  };

  state.applet = new GGBApplet(params, true);
  window.addEventListener("load", () => {
    state.applet.inject("ggb-element");
  });
}

function initializeValues() {
  for (const [key, scene] of Object.entries(sceneDefinitions)) {
    state.values[key] = {};
    for (const control of scene.controls) {
      state.values[key][control.key] = control.value;
    }
  }
}

function renderScene() {
  if (!state.api) {
    return;
  }

  const api = state.api;
  const scene = sceneDefinitions[state.scene];
  const values = state.values[state.scene];

  api.setRepaintingActive(false);
  api.newConstruction();
  api.setPerspective("G");
  api.setAxesVisible(true, true);
  api.setGridVisible(true);
  api.setCoordSystem(...scene.viewport);

  for (const command of scene.commands(values)) {
    api.evalCommand(command);
  }

  scene.style(api);
  api.setRepaintingActive(true);
  api.refreshViews();

  document.getElementById("scene-title").textContent = scene.title;
  document.getElementById("scene-chip").textContent = scene.chip;
  document.getElementById("kid-line").textContent = scene.kidLine;
  document.getElementById("scene-description").textContent = scene.description;
  document.getElementById("grownup-note").textContent = scene.grownupNote;

  renderPrompts(scene.prompts);
  renderControls();
  renderMetrics();
}

function renderControls() {
  const holder = document.getElementById("control-fields");
  const scene = sceneDefinitions[state.scene];
  const sceneValues = state.values[state.scene];
  holder.innerHTML = "";

  for (const control of scene.controls) {
    const box = document.createElement("div");
    box.className = "control";

    const header = document.createElement("div");
    header.className = "control-header";

    const label = document.createElement("label");
    label.setAttribute("for", `control-${control.key}`);
    label.textContent = control.label;

    const value = document.createElement("span");
    value.id = `value-${control.key}`;
    value.textContent = formatNumber(sceneValues[control.key]);

    header.append(label, value);

    const input = document.createElement("input");
    input.type = "range";
    input.id = `control-${control.key}`;
    input.min = control.min;
    input.max = control.max;
    input.step = control.step;
    input.value = sceneValues[control.key];
    input.addEventListener("input", (event) => {
      const next = Number(event.target.value);
      state.values[state.scene][control.key] = next;
      value.textContent = formatNumber(next);
      renderScene();
    });

    box.append(header, input);
    holder.append(box);
  }
}

function renderPrompts(prompts) {
  const list = document.getElementById("scene-prompts");
  list.innerHTML = "";
  for (const prompt of prompts) {
    const item = document.createElement("li");
    item.textContent = prompt;
    list.append(item);
  }
}

function renderMetrics() {
  const holder = document.getElementById("metrics");
  holder.innerHTML = "";

  for (const metric of sceneDefinitions[state.scene].metrics(state.api)) {
    const card = document.createElement("div");
    card.className = "metric";

    const label = document.createElement("span");
    label.className = "metric-label";
    label.textContent = metric.label;

    const value = document.createElement("span");
    value.className = "metric-value";
    value.textContent = metric.value;

    card.append(label, value);
    holder.append(card);
  }
}

function bindUI() {
  document.getElementById("scene-buttons").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-scene]");
    if (!button) {
      return;
    }

    state.scene = button.dataset.scene;
    document.querySelectorAll("#scene-buttons button").forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    renderScene();
  });

  document.getElementById("reset-view").addEventListener("click", () => {
    const scene = sceneDefinitions[state.scene];
    for (const control of scene.controls) {
      state.values[state.scene][control.key] = control.value;
    }
    renderScene();
  });
}

function safeNumber(api, name) {
  try {
    const value = Number(api.getValue(name));
    return Number.isFinite(value) ? value : 0;
  } catch {
    return 0;
  }
}

function describeSlope(value) {
  const abs = Math.abs(value);
  if (abs < 0.15) {
    return "几乎平平的";
  }
  if (abs < 0.55) {
    return value >= 0 ? "有一点点陡" : "有一点点斜下去";
  }
  if (abs < 1.1) {
    return value >= 0 ? "挺陡的" : "下坡有点快";
  }
  return value >= 0 ? "非常陡" : "冲下坡了";
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  return Number(value).toFixed(2).replace(/\.?0+$/, "");
}

bindUI();
setupApplet();

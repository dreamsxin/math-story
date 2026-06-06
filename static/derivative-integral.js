const stepDefinitions = {
  meaning: {
    title: "求导在问什么",
    chip: "变化率",
    description:
      "求导是在问：函数走到某个 x 时，正在变快还是变慢？图上黄色切线越陡，变化率越大。",
    formula: "从 y=g(x) 得到 g'(x)，就是从位置函数得到变化率函数。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -3, max: 3, step: 0.1, value: 1 },
    ],
    mode: "derivative",
  },
  average: {
    title: "先算平均变化率",
    chip: "割线斜率",
    description:
      "如果只看从 x 到 x+h 这一小段，可以先用两点连成的割线来估算变化率。这个平均变化率是：函数值增加了多少，除以横向走了多少。",
    formula: "平均变化率 = [g(x+h)-g(x)] / h。",
    controls: [
      { key: "x0", label: "起点 x", min: -2.5, max: 2.5, step: 0.1, value: 1 },
      { key: "h", label: "横向小步 h", min: 0.2, max: 2.5, step: 0.1, value: 1.5 },
    ],
    mode: "average",
  },
  limitSlope: {
    title: "让 h 趋近 0",
    chip: "瞬时变化率",
    description:
      "把 h 拖小，第二个点会向第一个点靠近，割线也越来越像切线。导函数的值，就是 h 趋近 0 时割线斜率靠近的那个数。",
    formula: "g'(x) = lim[h→0] [g(x+h)-g(x)] / h。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -2.5, max: 2.5, step: 0.1, value: 1 },
      { key: "h", label: "横向小步 h", min: 0.05, max: 2, step: 0.05, value: 1 },
    ],
    mode: "limitSlope",
  },
  squareLimit: {
    title: "手算 x² 的导数",
    chip: "展开再约掉 h",
    description:
      "以 g(x)=x² 为例，把定义式真的算一遍。先展开 (x+h)²，再减去 x²，最后除以 h。注意：不能一开始令 h=0，要先把能约掉的 h 约掉。",
    formula: "[(x+h)²-x²]/h = (2xh+h²)/h = 2x+h，h→0 后得到 2x。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -3, max: 3, step: 0.1, value: 1 },
      { key: "h", label: "横向小步 h", min: 0.05, max: 2, step: 0.05, value: 1 },
    ],
    mode: "squareLimit",
  },
  exampleLimit: {
    title: "手算 0.25x²+1",
    chip: "常数会抵消",
    description:
      "再算首页常用的函数 g(x)=0.25x²+1。代入定义式后，两个 +1 会相互抵消，所以常数项的导数是 0。",
    formula: "[g(x+h)-g(x)]/h = 0.5x+0.25h，h→0 后得到 g'(x)=0.5x。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -3, max: 3, step: 0.1, value: 1 },
      { key: "h", label: "横向小步 h", min: 0.05, max: 2, step: 0.05, value: 1 },
    ],
    mode: "exampleLimit",
  },
  power: {
    title: "幂函数规则",
    chip: "xⁿ 怎么求导",
    description:
      "幂函数规则不是凭空来的，它来自刚才的极限公式。对 xⁿ 使用 [g(x+h)-g(x)]/h，再让 h 趋近 0，就会得到 n·xⁿ⁻¹。",
    formula: "如果 g(x)=a·xⁿ，那么 g'(x)=a·n·xⁿ⁻¹。",
    controls: [
      { key: "a", label: "系数 a", min: -3, max: 3, step: 0.5, value: 2 },
      { key: "n", label: "指数 n", min: 1, max: 5, step: 1, value: 3 },
      { key: "x0", label: "观察位置 x", min: -2, max: 2, step: 0.1, value: 1 },
    ],
    mode: "power",
  },
  sum: {
    title: "多项式逐项算",
    chip: "一项一项",
    description:
      "多项式是一项一项加起来的。求导也可以一项一项算，再把结果加起来。",
    formula: "(3x²+2x+5)' = 6x+2。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -3, max: 3, step: 0.1, value: 1 },
    ],
    mode: "sum",
  },
  reverse: {
    title: "反过来找 F",
    chip: "不定积分",
    description:
      "不定积分是在反过来想：哪个函数求导以后，会变成现在这个 f(x)？",
    formula: "如果 f(x)=a·xⁿ，那么 F(x)=a·xⁿ⁺¹/(n+1)+C。",
    controls: [
      { key: "a", label: "系数 a", min: -3, max: 3, step: 0.5, value: 2 },
      { key: "n", label: "指数 n", min: 0, max: 5, step: 1, value: 2 },
      { key: "x0", label: "观察位置 x", min: -2, max: 2, step: 0.1, value: 1 },
    ],
    mode: "reverse",
  },
  constant: {
    title: "为什么有 +C",
    chip: "常数消失",
    description:
      "求导时，常数会变成 0。所以很多个只差一个常数的函数，求导后都会得到同一个 f(x)。",
    formula: "(F(x)+C)' = F'(x)。所以不定积分要写 +C。",
    controls: [
      { key: "c", label: "常数 C", min: -4, max: 4, step: 0.5, value: 2 },
      { key: "x0", label: "观察位置 x", min: -2, max: 2, step: 0.1, value: 1 },
    ],
    mode: "constant",
  },
  check: {
    title: "再求导检查",
    chip: "验算",
    description:
      "找到原函数以后，再对它求导。如果结果回到原来的 f(x)，说明这个不定积分找对了。",
    formula: "F(x)=x³+x²+5x+C，所以 F'(x)=3x²+2x+5。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -3, max: 3, step: 0.1, value: 1 },
    ],
    mode: "check",
  },
};

const state = {
  api: null,
  applet: null,
  step: "meaning",
  values: {},
};

function setupApplet() {
  const params = {
    appName: "classic",
    width: 900,
    height: 670,
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
      renderStep();
    },
  };

  state.app = new GGBApplet(params, true);
  window.addEventListener("load", () => {
    state.app.inject("ggb-derivative-integral");
  });
}

function initializeValues() {
  for (const [key, step] of Object.entries(stepDefinitions)) {
    state.values[key] = {};
    for (const control of step.controls) {
      state.values[key][control.key] = control.value;
    }
  }
}

function renderStep() {
  if (!state.api) {
    return;
  }

  const api = state.api;
  const step = stepDefinitions[state.step];
  const values = state.values[state.step];

  api.setRepaintingActive(false);
  api.newConstruction();
  api.setPerspective("G");
  api.setAxesVisible(true, true);
  api.setGridVisible(true);
  api.setCoordSystem(-4, 4, -8, 10);

  for (const command of buildCommands(step.mode, values)) {
    api.evalCommand(command);
  }

  styleScene(api);
  api.setRepaintingActive(true);
  api.refreshViews();

  document.getElementById("step-title").textContent = step.title;
  document.getElementById("step-chip").textContent = step.chip;
  document.getElementById("step-description").textContent = step.description;
  document.getElementById("formula-line").textContent = step.formula;

  renderControls();
  renderMetrics(step.mode);
}

function buildCommands(mode, values) {
  if (mode === "squareLimit") {
    return [
      `x0 = ${values.x0}`,
      `h = ${values.h}`,
      "g(x) = x^2",
      "dg(x) = 2x",
      "P = (x0, g(x0))",
      "B = (x0 + h, g(x0 + h))",
      "SecantLine = Line(P, B)",
      "TangentLine = Tangent(P, g)",
      "AverageSlope = Slope(SecantLine)",
      "ExpandedSlope = 2x0 + h",
      "LimitSlope = 2x0",
      "SlopeGap = abs(AverageSlope - LimitSlope)",
    ];
  }

  if (mode === "exampleLimit") {
    return [
      `x0 = ${values.x0}`,
      `h = ${values.h}`,
      "g(x) = 0.25x^2 + 1",
      "dg(x) = 0.5x",
      "P = (x0, g(x0))",
      "B = (x0 + h, g(x0 + h))",
      "SecantLine = Line(P, B)",
      "TangentLine = Tangent(P, g)",
      "AverageSlope = Slope(SecantLine)",
      "ExpandedSlope = 0.5x0 + 0.25h",
      "LimitSlope = 0.5x0",
      "SlopeGap = abs(AverageSlope - LimitSlope)",
    ];
  }

  if (mode === "average" || mode === "limitSlope") {
    return [
      `x0 = ${values.x0}`,
      `h = ${values.h}`,
      "g(x) = 0.25x^2 + 1",
      "dg(x) = Derivative(g)",
      "P = (x0, g(x0))",
      "B = (x0 + h, g(x0 + h))",
      "SecantLine = Line(P, B)",
      "TangentLine = Tangent(P, g)",
      "AverageSlope = Slope(SecantLine)",
      "InstantSlope = dg(x0)",
      "SlopeGap = abs(AverageSlope - InstantSlope)",
    ];
  }

  if (mode === "power") {
    return [
      `a = ${values.a}`,
      `n = ${values.n}`,
      `x0 = ${values.x0}`,
      "g(x) = a * x^n",
      "dg(x) = Derivative(g)",
      "P = (x0, g(x0))",
      "Q = (x0, dg(x0))",
      "TangentLine = Tangent(P, g)",
      "SlopeNow = dg(x0)",
    ];
  }

  if (mode === "reverse") {
    return [
      `a = ${values.a}`,
      `n = ${values.n}`,
      `x0 = ${values.x0}`,
      "f(x) = a * x^n",
      "F(x) = a * x^(n + 1) / (n + 1)",
      "CheckDerivative(x) = Derivative(F)",
      "P = (x0, f(x0))",
      "R = (x0, F(x0))",
      "SlopeNow = CheckDerivative(x0)",
      "OriginalNow = f(x0)",
    ];
  }

  if (mode === "constant") {
    return [
      `c = ${values.c}`,
      `x0 = ${values.x0}`,
      "f(x) = 0.25x^2 + 1",
      "F0(x) = x^3 / 12 + x",
      "F1(x) = x^3 / 12 + x + c",
      "dF0(x) = Derivative(F0)",
      "dF1(x) = Derivative(F1)",
      "P = (x0, F0(x0))",
      "R = (x0, F1(x0))",
      "SlopeNow = dF1(x0)",
      "OriginalNow = f(x0)",
    ];
  }

  if (mode === "check") {
    return [
      `x0 = ${values.x0}`,
      "f(x) = 3x^2 + 2x + 5",
      "F(x) = x^3 + x^2 + 5x",
      "CheckDerivative(x) = Derivative(F)",
      "P = (x0, f(x0))",
      "R = (x0, F(x0))",
      "SlopeNow = CheckDerivative(x0)",
      "OriginalNow = f(x0)",
    ];
  }

  if (mode === "sum") {
    return [
      `x0 = ${values.x0}`,
      "g(x) = 3x^2 + 2x + 5",
      "dg(x) = Derivative(g)",
      "P = (x0, g(x0))",
      "Q = (x0, dg(x0))",
      "TangentLine = Tangent(P, g)",
      "SlopeNow = dg(x0)",
    ];
  }

  return [
    `x0 = ${values.x0}`,
    "g(x) = 0.25x^2 + 1",
    "dg(x) = Derivative(g)",
    "P = (x0, g(x0))",
    "Q = (x0, dg(x0))",
    "TangentLine = Tangent(P, g)",
    "SlopeNow = dg(x0)",
  ];
}

function styleScene(api) {
  for (const name of ["g", "f"]) {
    try {
      api.setColor(name, 217, 111, 50);
      api.setLineThickness(name, 7);
    } catch {}
  }

  for (const name of ["dg", "CheckDerivative", "dF0", "dF1"]) {
    try {
      api.setColor(name, 36, 121, 90);
      api.setLineThickness(name, 6);
    } catch {}
  }

  for (const name of ["F", "F0", "F1"]) {
    try {
      api.setColor(name, 39, 106, 184);
      api.setLineThickness(name, 5);
    } catch {}
  }

  for (const name of ["P", "Q", "R"]) {
    try {
      api.setPointSize(name, 8);
      api.setLabelVisible(name, true);
    } catch {}
  }

  try {
    api.setColor("TangentLine", 239, 193, 75);
    api.setLineThickness("TangentLine", 5);
  } catch {}

  try {
    api.setColor("SecantLine", 39, 106, 184);
    api.setLineThickness("SecantLine", 5);
  } catch {}
}

function renderControls() {
  const holder = document.getElementById("control-fields");
  const step = stepDefinitions[state.step];
  const values = state.values[state.step];
  holder.innerHTML = "";

  for (const control of step.controls) {
    const wrapper = document.createElement("div");
    wrapper.className = "control";

    const header = document.createElement("div");
    header.className = "control-header";

    const label = document.createElement("label");
    label.setAttribute("for", `control-${control.key}`);
    label.textContent = control.label;

    const value = document.createElement("span");
    value.textContent = formatNumber(values[control.key]);

    const input = document.createElement("input");
    input.type = "range";
    input.id = `control-${control.key}`;
    input.min = control.min;
    input.max = control.max;
    input.step = control.step;
    input.value = values[control.key];
    input.addEventListener("input", (event) => {
      const next = Number(event.target.value);
      state.values[state.step][control.key] = next;
      value.textContent = formatNumber(next);
      renderStep();
    });

    header.append(label, value);
    wrapper.append(header, input);
    holder.append(wrapper);
  }
}

function renderMetrics(mode) {
  const api = state.api;
  const holder = document.getElementById("metrics");
  const metrics = [];

  if (mode === "power") {
    metrics.push(
      { label: "当前函数值 g(x)", value: safeValue(api, "g(x0)") },
      { label: "当前导数值 g'(x)", value: safeValue(api, "SlopeNow") },
      { label: "规则算出的系数", value: safeValue(api, "a * n") },
    );
  } else if (mode === "average" || mode === "limitSlope") {
    metrics.push(
      { label: "平均变化率", value: safeValue(api, "AverageSlope") },
      { label: "导函数值", value: safeValue(api, "InstantSlope") },
      { label: "两者差多少", value: safeValue(api, "SlopeGap") },
    );
  } else if (mode === "squareLimit" || mode === "exampleLimit") {
    metrics.push(
      { label: "割线斜率", value: safeValue(api, "AverageSlope") },
      { label: "展开后公式值", value: safeValue(api, "ExpandedSlope") },
      { label: "h→0 后的导数值", value: safeValue(api, "LimitSlope") },
      { label: "还差多少", value: safeValue(api, "SlopeGap") },
    );
  } else if (mode === "reverse" || mode === "constant" || mode === "check") {
    metrics.push(
      { label: "原来的 f(x)", value: safeValue(api, "OriginalNow") },
      { label: "F 求导后的值", value: safeValue(api, "SlopeNow") },
      { label: "是否回到 f(x)", value: isClose(api, "OriginalNow", "SlopeNow") ? "是" : "还没对上" },
    );
  } else {
    metrics.push(
      { label: "当前函数值", value: safeValue(api, "g(x0)") },
      { label: "切线斜率", value: safeValue(api, "SlopeNow") },
      { label: "导函数上的点", value: safeValue(api, "dg(x0)") },
    );
  }

  holder.innerHTML = "";
  for (const metric of metrics) {
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
  document.getElementById("step-buttons").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-step]");
    if (!button) {
      return;
    }

    state.step = button.dataset.step;
    document.querySelectorAll("#step-buttons button").forEach((item) => {
      item.classList.toggle("active", item === button);
    });
    renderStep();
  });
}

function safeValue(api, expression) {
  try {
    const value = Number(api.getValue(expression));
    return formatNumber(value);
  } catch {
    return "--";
  }
}

function isClose(api, a, b) {
  try {
    return Math.abs(Number(api.getValue(a)) - Number(api.getValue(b))) < 0.0001;
  } catch {
    return false;
  }
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  return Number(value).toFixed(4).replace(/\.?0+$/, "");
}

bindUI();
setupApplet();

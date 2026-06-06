const stepDefinitions = {
  input: {
    title: "输入变一点点",
    chip: "dx",
    description:
      "先只看横向移动：从 x 出发，往右走一小步 dx。图上的点从 P 移到 B，这一步还不急着算输出变化。",
    formula: "dx 表示输入 x 的一点点变化。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -3, max: 3, step: 0.1, value: 1 },
      { key: "dx", label: "小变化 dx", min: 0.05, max: 2, step: 0.05, value: 0.8 },
    ],
    mode: "curve",
  },
  realChange: {
    title: "输出跟着变多少",
    chip: "真实 Δy",
    description:
      "当 x 真的从 x 变到 x+dx，函数值也会跟着变。真实变化量叫 Δy，它等于 f(x+dx)-f(x)。",
    formula: "真实变化 Δy = f(x+dx)-f(x)。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -3, max: 3, step: 0.1, value: 1 },
      { key: "dx", label: "小变化 dx", min: 0.05, max: 2, step: 0.05, value: 0.8 },
    ],
    mode: "curve",
  },
  tangentGuess: {
    title: "用切线来猜",
    chip: "dy",
    description:
      "如果只走很小一步，可以不重新算整条曲线，而是用当前位置的切线来猜输出变化。这个猜出来的小变化叫 dy。",
    formula: "微分预测 dy ≈ f'(x)·dx。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -3, max: 3, step: 0.1, value: 1 },
      { key: "dx", label: "小变化 dx", min: 0.05, max: 2, step: 0.05, value: 0.8 },
    ],
    mode: "curve",
  },
  smallerDx: {
    title: "dx 越小，猜得越准",
    chip: "误差变小",
    description:
      "把 dx 拖小，真实变化 Δy 和微分预测 dy 会越来越接近。微分最擅长的，就是预测很小很小的变化。",
    formula: "dx 越小，|Δy-dy| 通常越小。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -3, max: 3, step: 0.1, value: 1 },
      { key: "dx", label: "小变化 dx", min: 0.01, max: 1.5, step: 0.01, value: 0.3 },
    ],
    mode: "curve",
  },
  squareArea: {
    title: "边长多一点，面积多多少",
    chip: "面积应用",
    description:
      "正方形边长是 s，面积是 A=s²。边长只增加一点点 ds 时，面积大约增加 2s·ds。这个想法很像给正方形四周加一圈很薄的边。",
    formula: "A=s²，所以 dA≈2s·ds。",
    controls: [
      { key: "s", label: "边长 s", min: 1, max: 6, step: 0.1, value: 3 },
      { key: "ds", label: "边长小变化 ds", min: 0.02, max: 1.2, step: 0.02, value: 0.4 },
    ],
    mode: "square",
  },
  warning: {
    title: "什么时候不能太相信",
    chip: "小步才准",
    description:
      "如果 dx 太大，切线只看到了出发点附近的方向，可能猜不准后面弯过去的曲线。所以微分是小变化预测，不是万能精确计算器。",
    formula: "dx 很大时，dy 只是粗略估计；真实变化仍然要看 Δy。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -3, max: 2, step: 0.1, value: 1 },
      { key: "dx", label: "较大的 dx", min: 0.5, max: 3, step: 0.1, value: 2.2 },
    ],
    mode: "curve",
  },
};

const state = {
  api: null,
  app: null,
  step: "input",
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
    state.app.inject("ggb-differential");
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
  if (step.mode === "square") {
    api.setCoordSystem(-1, 7, -2, 22);
  } else {
    api.setCoordSystem(-4, 6, -2, 9);
  }

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
  if (mode === "square") {
    return [
      `s = ${values.s}`,
      `ds = ${values.ds}`,
      "q(x) = x^2",
      "dq(x) = Derivative(q)",
      "P = (s, q(s))",
      "B = (s + ds, q(s + ds))",
      "TangentLine = Tangent(P, q)",
      "ActualChange = q(s + ds) - q(s)",
      "DifferentialChange = dq(s) * ds",
      "ErrorGap = abs(ActualChange - DifferentialChange)",
      "SlopeNow = dq(s)",
      "RealTop = (s + ds, q(s + ds))",
      "RealBottom = (s + ds, q(s))",
      "GuessBottom = (s + ds + 0.25, q(s))",
      "GuessTop = (s + ds + 0.25, q(s) + DifferentialChange)",
      "RealSegment = Segment(RealBottom, RealTop)",
      "GuessSegment = Segment(GuessBottom, GuessTop)",
    ];
  }

  return [
    `x0 = ${values.x0}`,
    `dx = ${values.dx}`,
    "f(x) = 0.25x^2 + 1",
    "df(x) = Derivative(f)",
    "P = (x0, f(x0))",
    "B = (x0 + dx, f(x0 + dx))",
    "TangentLine = Tangent(P, f)",
    "ActualChange = f(x0 + dx) - f(x0)",
    "DifferentialChange = df(x0) * dx",
    "ErrorGap = abs(ActualChange - DifferentialChange)",
    "SlopeNow = df(x0)",
    "RealTop = (x0 + dx, f(x0 + dx))",
    "RealBottom = (x0 + dx, f(x0))",
    "GuessBottom = (x0 + dx + 0.25, f(x0))",
    "GuessTop = (x0 + dx + 0.25, f(x0) + DifferentialChange)",
    "DxSegment = Segment(P, (x0 + dx, f(x0)))",
    "RealSegment = Segment(RealBottom, RealTop)",
    "GuessSegment = Segment(GuessBottom, GuessTop)",
  ];
}

function styleScene(api) {
  for (const name of ["f", "q"]) {
    try {
      api.setColor(name, 217, 111, 50);
      api.setLineThickness(name, 7);
    } catch {}
  }

  try {
    api.setColor("TangentLine", 239, 193, 75);
    api.setLineThickness("TangentLine", 5);
  } catch {}

  try {
    api.setColor("DxSegment", 39, 106, 184);
    api.setLineThickness("DxSegment", 7);
  } catch {}

  try {
    api.setColor("RealSegment", 217, 111, 50);
    api.setLineThickness("RealSegment", 8);
  } catch {}

  try {
    api.setColor("GuessSegment", 36, 121, 90);
    api.setLineThickness("GuessSegment", 8);
  } catch {}

  for (const name of ["P", "B", "RealTop", "RealBottom", "GuessTop", "GuessBottom"]) {
    try {
      api.setPointSize(name, name === "P" || name === "B" ? 8 : 4);
      api.setLabelVisible(name, name === "P" || name === "B");
    } catch {}
  }
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
  const inputName = mode === "square" ? "ds" : "dx";
  const slopeLabel = mode === "square" ? "当前面积变化率 A'(s)" : "当前位置斜率 f'(x)";
  const predictionLabel = mode === "square" ? "微分预测 dA" : "微分预测 dy";
  const realLabel = mode === "square" ? "真实面积变化 ΔA" : "真实变化 Δy";

  const metrics = [
    { label: inputName, value: safeValue(api, inputName) },
    { label: realLabel, value: safeValue(api, "ActualChange") },
    { label: predictionLabel, value: safeValue(api, "DifferentialChange") },
    { label: "误差", value: safeValue(api, "ErrorGap") },
    { label: slopeLabel, value: safeValue(api, "SlopeNow") },
  ];

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
    return formatNumber(Number(api.getValue(expression)));
  } catch {
    return "--";
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

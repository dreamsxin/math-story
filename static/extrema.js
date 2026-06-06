const stepDefinitions = {
  middleSchool: {
    title: "初中最值",
    chip: "顶点公式",
    description:
      "你说得对：二次函数的最大值、最小值，初中就会用配方法或顶点公式解决。微积分不是替代它，而是解释“为什么最高或最低的地方会变平”，并把这个想法推广到更多函数。",
    rule: "初中：配成 a(x-h)²+k，看顶点；微积分：找 f'(x)=0，再看左右是否变号。",
    controls: [
      { key: "a", label: "开口大小 a", min: 0.2, max: 1.5, step: 0.1, value: 0.5 },
      { key: "h", label: "顶点横坐标 h", min: -2, max: 2, step: 0.1, value: 1 },
      { key: "k", label: "顶点纵坐标 k", min: -1, max: 4, step: 0.1, value: 1 },
    ],
    mode: "middleSchool",
  },
  sign: {
    title: "导数看方向",
    chip: "上升或下降",
    description:
      "导函数的正负告诉我们函数正在往哪个方向走。f'(x)>0 表示函数上升，f'(x)<0 表示函数下降。",
    rule: "f'(x)>0：上升；f'(x)<0：下降；f'(x)=0：可能到达转折位置。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -3, max: 3, step: 0.1, value: -1 },
    ],
    mode: "sign",
  },
  minimum: {
    title: "最低点",
    chip: "先降后升",
    description:
      "如果函数先下降，到了某点斜率变成 0，然后开始上升，这个点就是局部最小值。",
    rule: "f'(x) 从负变正，得到局部最小值。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -2, max: 4, step: 0.1, value: 1 },
    ],
    mode: "minimum",
  },
  maximum: {
    title: "最高点",
    chip: "先升后降",
    description:
      "如果函数先上升，到了某点斜率变成 0，然后开始下降，这个点就是局部最大值。",
    rule: "f'(x) 从正变负，得到局部最大值。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -2, max: 4, step: 0.1, value: 1 },
    ],
    mode: "maximum",
  },
  both: {
    title: "先升后降再升",
    chip: "两个极值",
    description:
      "一个函数可能既有局部最大值，也有局部最小值。先找 f'(x)=0 的候选点，再看导数符号如何变化。",
    rule: "候选点：f'(x)=0。判断极大或极小：看导数在左右两边的符号变化。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -3, max: 3, step: 0.1, value: -1.4 },
    ],
    mode: "both",
  },
  warning: {
    title: "f'(x)=0 不一定是极值",
    chip: "重要反例",
    description:
      "f'(x)=0 只能说明切线是平的。它可能是极大值或极小值，也可能只是平着穿过去，比如 f(x)=x³ 在 x=0。",
    rule: "只看 f'(x)=0 不够，还要看导数是否变号。",
    controls: [
      { key: "x0", label: "观察位置 x", min: -2, max: 2, step: 0.1, value: 0 },
    ],
    mode: "warning",
  },
};

const state = {
  api: null,
  app: null,
  step: "middleSchool",
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
    state.app.inject("ggb-extrema");
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
  api.setCoordSystem(-4, 4, -5, 7);

  for (const command of buildCommands(step.mode, values)) {
    api.evalCommand(command);
  }

  styleScene(api);
  api.setRepaintingActive(true);
  api.refreshViews();

  document.getElementById("step-title").textContent = step.title;
  document.getElementById("step-chip").textContent = step.chip;
  document.getElementById("step-description").textContent = step.description;
  document.getElementById("rule-line").textContent = step.rule;

  renderControls();
  renderMetrics(step.mode);
}

function buildCommands(mode, values) {
  if (mode === "middleSchool") {
    return [
      `a = ${values.a}`,
      `h = ${values.h}`,
      `k = ${values.k}`,
      "f(x) = a(x - h)^2 + k",
      "df(x) = Derivative(f)",
      "x0 = h",
      "P = (x0, f(x0))",
      "C = (h, k)",
      "TangentLine = Tangent(P, f)",
      "SlopeNow = df(x0)",
      "MiddleSchoolMinX = h",
      "MiddleSchoolMinY = k",
      "DerivativeMinX = h",
      "DerivativeMinY = f(h)",
      "LeftTest = df(h - 1)",
      "RightTest = df(h + 1)",
    ];
  }

  const x0 = values.x0;

  if (mode === "minimum") {
    return commonCommands("f(x) = 0.5(x - 1)^2 + 1", x0).concat([
      "C = (1, f(1))",
      "LeftTest = df(0)",
      "RightTest = df(2)",
    ]);
  }

  if (mode === "maximum") {
    return commonCommands("f(x) = -0.5(x - 1)^2 + 4", x0).concat([
      "C = (1, f(1))",
      "LeftTest = df(0)",
      "RightTest = df(2)",
    ]);
  }

  if (mode === "both") {
    return commonCommands("f(x) = 0.25x^3 - 1.5x + 2", x0).concat([
      "C1 = (-sqrt(2), f(-sqrt(2)))",
      "C2 = (sqrt(2), f(sqrt(2)))",
      "LeftTest = df(-2)",
      "MiddleTest = df(0)",
      "RightTest = df(2)",
    ]);
  }

  if (mode === "warning") {
    return commonCommands("f(x) = x^3", x0).concat([
      "C = (0, 0)",
      "LeftTest = df(-1)",
      "RightTest = df(1)",
    ]);
  }

  return commonCommands("f(x) = 0.25x^3 - x + 2", x0).concat([
    "LeftTest = df(x0 - 0.5)",
    "RightTest = df(x0 + 0.5)",
  ]);
}

function commonCommands(functionCommand, x0) {
  return [
    functionCommand,
    "df(x) = Derivative(f)",
    `x0 = ${x0}`,
    "P = (x0, f(x0))",
    "Q = (x0, df(x0))",
    "TangentLine = Tangent(P, f)",
    "SlopeNow = df(x0)",
  ];
}

function styleScene(api) {
  api.setColor("f", 217, 111, 50);
  api.setLineThickness("f", 8);
  api.setColor("df", 35, 122, 90);
  api.setLineThickness("df", 6);
  api.setColor("TangentLine", 239, 193, 75);
  api.setLineThickness("TangentLine", 5);

  for (const name of ["P", "Q", "C", "C1", "C2"]) {
    try {
      api.setPointSize(name, 8);
      api.setLabelVisible(name, true);
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
  const metrics = [
    { label: "当前 f(x)", value: safeValue(api, "f(x0)") },
    { label: "当前 f'(x)", value: safeValue(api, "SlopeNow") },
    { label: "当前位置趋势", value: describeSlope(Number(api.getValue("SlopeNow"))) },
  ];

  if (mode === "minimum" || mode === "maximum" || mode === "warning") {
    metrics.push(
      { label: "左侧导数", value: safeValue(api, "LeftTest") },
      { label: "右侧导数", value: safeValue(api, "RightTest") },
      { label: "判断", value: judgeSingle(mode, api) },
    );
  }

  if (mode === "middleSchool") {
    metrics.push(
      { label: "顶点横坐标", value: safeValue(api, "MiddleSchoolMinX") },
      { label: "顶点纵坐标", value: safeValue(api, "MiddleSchoolMinY") },
      { label: "顶点处 f'(x)", value: safeValue(api, "SlopeNow") },
      { label: "两种方法结论", value: "同一个最小值" },
    );
  }

  if (mode === "both") {
    metrics.push(
      { label: "左段导数", value: safeValue(api, "LeftTest") },
      { label: "中段导数", value: safeValue(api, "MiddleTest") },
      { label: "右段导数", value: safeValue(api, "RightTest") },
      { label: "判断", value: "左边极大，右边极小" },
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

function judgeSingle(mode, api) {
  const left = Number(api.getValue("LeftTest"));
  const right = Number(api.getValue("RightTest"));
  if (mode === "minimum" && left < 0 && right > 0) {
    return "负变正：局部最小值";
  }
  if (mode === "maximum" && left > 0 && right < 0) {
    return "正变负：局部最大值";
  }
  if (mode === "warning" && left > 0 && right > 0) {
    return "不变号：不是极值";
  }
  return "继续观察导数变号";
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

function describeSlope(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  if (Math.abs(value) < 0.05) {
    return "几乎水平";
  }
  return value > 0 ? "正在上升" : "正在下降";
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "--";
  }
  return Number(value).toFixed(4).replace(/\.?0+$/, "");
}

bindUI();
setupApplet();

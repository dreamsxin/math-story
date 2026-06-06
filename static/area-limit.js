const BASE = {
  expr: "0.25x^2 + 1",
  anti: "x^3 / 12 + x",
  viewport: [-2.5, 4.5, -0.5, 7],
};

const stepDefinitions = {
  rectangles: {
    title: "先用矩形拼",
    chip: "有限估算",
    description:
      "曲线下面的阴影不好直接套几何公式。先把区间切成几个小矩形，用矩形面积相加，得到一个可以看见的近似答案。",
    keyLine: "有限个矩形相加，叫估算，不叫精确答案。",
    controls: [
      { key: "a", label: "左端点 a", min: -2, max: 1, step: 0.1, value: -1 },
      { key: "b", label: "右端点 b", min: 1.5, max: 4, step: 0.1, value: 3 },
      { key: "n", label: "矩形个数 n", min: 2, max: 20, step: 1, value: 5 },
    ],
  },
  error: {
    title: "误差从哪里来",
    chip: "多出来或少掉",
    description:
      "矩形的上边是平的，函数图像是弯的。平边不可能完全贴住弯边，所以有限矩形一定会留下误差。",
    keyLine: "误差来自：矩形的平边不能完全贴合曲线的弯边。",
    controls: [
      { key: "a", label: "左端点 a", min: -2, max: 1, step: 0.1, value: -1 },
      { key: "b", label: "右端点 b", min: 1.5, max: 4, step: 0.1, value: 3 },
      { key: "n", label: "矩形个数 n", min: 2, max: 60, step: 1, value: 8 },
    ],
  },
  limit: {
    title: "趋近 0 是什么",
    chip: "越来越细",
    description:
      "每个矩形的宽度是 (b-a)/n。n 越大，每个矩形越窄。微积分问的是：当 n 无限增大、宽度趋近 0 时，矩形和会靠近哪个固定数字？",
    keyLine: "积分值 = n 无限大、矩形宽度趋近 0 时，矩形和靠近的极限。",
    controls: [
      { key: "a", label: "左端点 a", min: -2, max: 1, step: 0.1, value: -1 },
      { key: "b", label: "右端点 b", min: 1.5, max: 4, step: 0.1, value: 3 },
      { key: "n", label: "矩形个数 n", min: 2, max: 120, step: 1, value: 20 },
    ],
  },
  antiderivative: {
    title: "不数矩形了",
    chip: "找原函数",
    description:
      "真正求极限时，不可能真的画无限多个矩形。微积分的妙处是：如果找到一个函数 F，它的变化率正好是 f，就可以绕过无限相加。",
    keyLine: "对 f(x)=0.25x²+1，一个原函数是 F(x)=x³/12+x。",
    controls: [
      { key: "a", label: "左端点 a", min: -2, max: 1, step: 0.1, value: -1 },
      { key: "b", label: "右端点 b", min: 1.5, max: 4, step: 0.1, value: 3 },
    ],
  },
  formula: {
    title: "F(b)-F(a)",
    chip: "精确面积",
    description:
      "把右端点代入原函数，再减去左端点代入原函数，就得到曲线下面积的精确值。它等于无限细矩形和的极限。",
    keyLine: "∫[a,b] f(x) dx = F(b)-F(a)。这就是精确面积的计算方法。",
    controls: [
      { key: "a", label: "左端点 a", min: -2, max: 1, step: 0.1, value: -1 },
      { key: "b", label: "右端点 b", min: 1.5, max: 4, step: 0.1, value: 3 },
      { key: "n", label: "参考矩形个数 n", min: 2, max: 120, step: 1, value: 30 },
    ],
  },
};

const state = {
  api: null,
  applet: null,
  step: "rectangles",
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

  state.applet = new GGBApplet(params, true);
  window.addEventListener("load", () => {
    state.applet.inject("ggb-area-limit");
  });
}

function initializeValues() {
  for (const [stepKey, step] of Object.entries(stepDefinitions)) {
    state.values[stepKey] = {};
    for (const control of step.controls) {
      state.values[stepKey][control.key] = control.value;
    }
  }
}

function getValues() {
  const values = { ...state.values[state.step] };
  values.a = Math.min(values.a, values.b - 0.2);
  values.b = Math.max(values.b, values.a + 0.2);
  values.n = values.n || 30;
  return values;
}

function renderStep() {
  if (!state.api) {
    return;
  }

  const api = state.api;
  const step = stepDefinitions[state.step];
  const values = getValues();

  api.setRepaintingActive(false);
  api.newConstruction();
  api.setPerspective("G");
  api.setAxesVisible(true, true);
  api.setGridVisible(true);
  api.setCoordSystem(...BASE.viewport);

  const commands = [
    `f(x) = ${BASE.expr}`,
    `F(x) = ${BASE.anti}`,
    `a = ${values.a}`,
    `b = ${values.b}`,
    `n = ${values.n}`,
    "dx = (b - a) / n",
    "LeftApprox = LeftSum(f, a, b, n)",
    "ExactIntegral = Integral(f, a, b)",
    "FormulaValue = F(b) - F(a)",
    "ErrorValue = abs(ExactIntegral - LeftApprox)",
    "A = (a, f(a))",
    "B = (b, f(b))",
    "A0 = (a, 0)",
    "B0 = (b, 0)",
    "LeftWall = Segment(A0, A)",
    "RightWall = Segment(B0, B)",
    "Base = Segment(A0, B0)",
  ];

  for (const command of commands) {
    api.evalCommand(command);
  }

  styleScene(api);
  api.setRepaintingActive(true);
  api.refreshViews();

  document.getElementById("step-title").textContent = step.title;
  document.getElementById("step-chip").textContent = step.chip;
  document.getElementById("step-description").textContent = step.description;
  document.getElementById("key-line").textContent = step.keyLine;

  renderControls();
  renderMetrics();
}

function styleScene(api) {
  api.setColor("f", 232, 117, 46);
  api.setLineThickness("f", 8);
  api.setColor("LeftApprox", 242, 189, 63);
  api.setFilling("LeftApprox", 0.34);
  api.setColor("LeftWall", 40, 109, 192);
  api.setColor("RightWall", 40, 109, 192);
  api.setColor("Base", 40, 109, 192);
  api.setLineThickness("LeftWall", 4);
  api.setLineThickness("RightWall", 4);
  api.setLineThickness("Base", 4);
  api.setColor("A", 35, 150, 107);
  api.setColor("B", 35, 150, 107);
  api.setPointSize("A", 7);
  api.setPointSize("B", 7);
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

function renderMetrics() {
  const api = state.api;
  const holder = document.getElementById("metrics");
  const metrics = [
    { label: "矩形宽度 dx", value: `${safeValue(api, "dx")} 格` },
    { label: "有限矩形和", value: `${safeValue(api, "LeftApprox")} 平方格` },
    { label: "积分极限值", value: `${safeValue(api, "ExactIntegral")} 平方格` },
    { label: "F(b)-F(a)", value: `${safeValue(api, "FormulaValue")} 平方格` },
    { label: "有限估算误差", value: `${safeValue(api, "ErrorValue")} 平方格` },
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

function safeValue(api, name) {
  try {
    return formatNumber(Number(api.getValue(name)));
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

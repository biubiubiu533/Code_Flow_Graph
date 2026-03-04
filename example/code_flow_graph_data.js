// ============================================================
// Code Flow Graph — Example Data
// This file demonstrates all node types, connection styles,
// and grouping capabilities of the Code Flow Graph engine.
// ============================================================

var DIAGRAMS = {};
DIAGRAMS._projectTitle = 'Example Project';

// ─────────────────────────────────────────────
// Page 1: Main Flow — Entry, Module, Class, Function
// ─────────────────────────────────────────────
DIAGRAMS.main_flow = {
  title: 'Main Flow — Application Entry',
  sub: 'app/main.py — Application bootstrap and core pipeline',
  navLabel: 'Main Flow',
  navSub: 'app/main.py',

  NODES: [
    {
      id: 'main', label: 'main', type: 'entry', cls: 'c-class-1', x: 60, y: 60, w: 260,
      sections: [
        {
          title: 'Entry Point',
          attrs: [
            {
              id: 'main.run', name: 'run()', visibility: 'public',
              sig: '<span class="sig-name">run</span>(<span class="sig-params">config: <span class="sig-type">Config</span></span>)\n<span class="sig-return">→ None</span>',
              desc: '应用主入口，初始化配置并启动核心流程',
              io: { input: 'config: Config — 应用配置对象', output: 'None' },
            },
            {
              id: 'main.parse_args', name: 'parse_args()', visibility: 'private',
              sig: '<span class="sig-name">parse_args</span>()\n<span class="sig-return">→ Namespace</span>',
              desc: '解析命令行参数',
            },
          ],
        },
      ],
    },
    {
      id: 'config', label: 'config', type: 'module', cls: 'c-class-2', x: 60, y: 300, w: 260,
      sections: [
        {
          title: 'Configuration',
          attrs: [
            {
              id: 'config.load', name: 'load()', visibility: 'public',
              sig: '<span class="sig-name">load</span>(<span class="sig-params">path: <span class="sig-type">str</span></span>)\n<span class="sig-return">→ Config</span>',
              desc: '从文件加载配置',
              io: { input: 'path: str — 配置文件路径', output: 'Config — 解析后的配置对象' },
            },
            {
              id: 'config.validate', name: 'validate()', visibility: 'private',
              sig: '<span class="sig-name">validate</span>(<span class="sig-params">data: <span class="sig-type">dict</span></span>)\n<span class="sig-return">→ bool</span>',
              desc: '校验配置数据的合法性',
            },
          ],
        },
      ],
    },
    {
      id: 'Pipeline', label: 'Pipeline', type: 'class', cls: 'c-class-3', x: 420, y: 60, w: 280,
      sections: [
        {
          title: 'Core Methods',
          attrs: [
            {
              id: 'Pipeline.execute', name: 'execute()', visibility: 'public',
              sig: '<span class="sig-name">execute</span>(<span class="sig-params">data: <span class="sig-type">DataFrame</span></span>)\n<span class="sig-return">→ Result</span>',
              desc: '执行完整的数据处理流水线',
              io: { input: 'data: DataFrame — 输入数据', output: 'Result — 处理结果' },
              children: [
                { id: 'Pipeline._preprocess', name: '_preprocess()', visibility: 'private', desc: '数据预处理与清洗' },
                { id: 'Pipeline._transform', name: '_transform()', visibility: 'private', desc: '数据转换与特征提取' },
              ],
              childrenCollapsed: false,
            },
            {
              id: 'Pipeline.add_step', name: 'add_step()', visibility: 'public',
              sig: '<span class="sig-name">add_step</span>(<span class="sig-params">step: <span class="sig-type">Step</span></span>)\n<span class="sig-return">→ None</span>',
              desc: '向流水线添加处理步骤',
            },
          ],
        },
        {
          title: 'Lifecycle',
          attrs: [
            {
              id: 'Pipeline.init', name: '__init__()', visibility: 'public',
              desc: '初始化流水线，设置默认步骤',
            },
            {
              id: 'Pipeline.teardown', name: 'teardown()', visibility: 'private',
              desc: '清理资源与临时文件',
            },
          ],
        },
      ],
    },
    {
      id: 'utils', label: 'utils', type: 'function', cls: 'c-class-4', x: 420, y: 380, w: 260,
      sections: [
        {
          title: 'Utility Functions',
          attrs: [
            {
              id: 'utils.format_output', name: 'format_output()', visibility: 'public',
              sig: '<span class="sig-name">format_output</span>(<span class="sig-params">result: <span class="sig-type">Result</span>, fmt: <span class="sig-type">str</span> = "json"</span>)\n<span class="sig-return">→ str</span>',
              desc: '将处理结果格式化为指定格式输出',
            },
            {
              id: 'utils.timer', name: 'timer()', visibility: 'public',
              desc: '性能计时装饰器',
            },
          ],
        },
      ],
    },
    {
      id: 'Logger', label: 'Logger', type: 'singleton', cls: 'c-class-5', x: 780, y: 60, w: 240,
      sections: [
        {
          title: 'Logging',
          attrs: [
            {
              id: 'Logger.info', name: 'info()', visibility: 'public',
              desc: '记录 INFO 级别日志',
            },
            {
              id: 'Logger.error', name: 'error()', visibility: 'public',
              desc: '记录 ERROR 级别日志',
            },
            {
              id: 'Logger.setup', name: 'setup()', visibility: 'private',
              desc: '初始化日志处理器和格式',
            },
          ],
        },
      ],
    },
    {
      id: 'requests', label: 'requests', type: 'external', cls: 'c-ext', x: 780, y: 300, w: 220,
      sections: [
        {
          title: 'HTTP Client',
          attrs: [
            {
              id: 'requests.get', name: 'get()', visibility: 'public',
              desc: '发送 HTTP GET 请求（外部库）',
            },
            {
              id: 'requests.post', name: 'post()', visibility: 'public',
              desc: '发送 HTTP POST 请求（外部库）',
            },
          ],
        },
      ],
    },
  ],

  CONNECTIONS: [
    // call (solid green)
    ['main.run', 'config.load', '#a6e3a1', false],
    ['main.run', 'Pipeline.execute', '#a6e3a1', false],
    ['Pipeline.execute', 'utils.format_output', '#a6e3a1', false],
    // data (solid blue)
    ['config.load', 'Pipeline.init', '#89b4fa', false],
    // extern (solid orange)
    ['Pipeline._transform', 'requests.get', '#fab387', false],
    // signal (dashed pink)
    ['Pipeline.execute', 'Logger.info', '#f5c2e7', true],
    ['Pipeline.execute', 'Logger.error', '#f5c2e7', true],
  ],

  GROUPS: [
    { id: 'g-core', label: 'core/', x: 400, y: 30, w: 700, h: 480 },
  ],
};

// ─────────────────────────────────────────────
// Page 2: Data Models — Data, Widget types
// ─────────────────────────────────────────────
DIAGRAMS.data_models = {
  title: 'Data Models — Schema & Types',
  sub: 'app/models/ — Data transfer objects and schemas',
  navLabel: 'Data Models',
  navSub: 'app/models/',

  NODES: [
    {
      id: 'UserModel', label: 'UserModel', type: 'data', cls: 'c-class-8', x: 60, y: 60, w: 280,
      sections: [
        {
          title: 'Fields',
          attrs: [
            { id: 'UserModel.id', name: 'id', val: ': int', visibility: 'public', desc: '用户唯一标识' },
            { id: 'UserModel.name', name: 'name', val: ': str', visibility: 'public', desc: '用户显示名称' },
            { id: 'UserModel.email', name: 'email', val: ': str', visibility: 'public', desc: '用户邮箱地址' },
            { id: 'UserModel.role', name: 'role', val: ': Role', visibility: 'public', desc: '用户角色枚举' },
          ],
        },
        {
          title: 'Methods',
          attrs: [
            {
              id: 'UserModel.validate', name: 'validate()', visibility: 'public',
              desc: '校验用户数据完整性',
            },
          ],
        },
      ],
    },
    {
      id: 'TaskModel', label: 'TaskModel', type: 'data', cls: 'c-class-8', x: 420, y: 60, w: 280,
      sections: [
        {
          title: 'Fields',
          attrs: [
            { id: 'TaskModel.id', name: 'id', val: ': int', visibility: 'public', desc: '任务唯一标识' },
            { id: 'TaskModel.title', name: 'title', val: ': str', visibility: 'public', desc: '任务标题' },
            { id: 'TaskModel.assignee', name: 'assignee', val: ': UserModel', visibility: 'public', desc: '任务负责人' },
            { id: 'TaskModel.status', name: 'status', val: ': Status', visibility: 'public', desc: '任务状态枚举' },
          ],
        },
      ],
    },
    {
      id: 'TaskDialog', label: 'TaskDialog', type: 'widget', cls: 'c-ui', x: 60, y: 340, w: 280,
      sections: [
        {
          title: 'UI Components',
          attrs: [
            { id: 'TaskDialog.render', name: 'render()', visibility: 'public', desc: '渲染任务编辑对话框' },
            { id: 'TaskDialog.on_submit', name: 'on_submit()', visibility: 'public', desc: '提交按钮回调' },
            { id: 'TaskDialog.on_cancel', name: 'on_cancel()', visibility: 'private', desc: '取消按钮回调' },
          ],
        },
      ],
    },
    {
      id: 'Serializer', label: 'Serializer', type: 'class', cls: 'c-class-6', x: 420, y: 340, w: 280,
      sections: [
        {
          title: 'Serialization',
          attrs: [
            {
              id: 'Serializer.to_json', name: 'to_json()', visibility: 'public',
              desc: '将模型序列化为 JSON 字符串',
            },
            {
              id: 'Serializer.from_json', name: 'from_json()', visibility: 'public',
              desc: '从 JSON 字符串反序列化为模型实例',
            },
          ],
        },
      ],
    },
  ],

  CONNECTIONS: [
    // data references
    ['TaskModel.assignee', 'UserModel.id', '#89b4fa', false],
    // call
    ['TaskDialog.on_submit', 'TaskModel.title', '#a6e3a1', false],
    ['TaskDialog.on_submit', 'Serializer.to_json', '#a6e3a1', false],
    // signal
    ['TaskDialog.on_submit', 'UserModel.validate', '#f5c2e7', true],
  ],

  GROUPS: [
    { id: 'g-models', label: 'models/', x: 40, y: 30, w: 680, h: 250 },
  ],
};

// ============================================================
// Code Flow Graph — Example Data
// This file demonstrates all node types, connection styles,
// and grouping capabilities of the Code Flow Graph engine.
// ============================================================

var DIAGRAMS = {};
DIAGRAMS._projectTitle = 'Example Project';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Page 1: Main Flow — Entry, Module, Class, Function, External
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAMS.main_flow = {
  title: 'Main Flow — Application Entry',
  sub: 'app/main.py — Application bootstrap and core pipeline',
  navLabel: 'Main Flow',
  navSub: 'app/main.py',

  NODES: [
    {
      id: 'main', label: 'main', type: 'entry', x: 60, y: 60, w: 260,
      sections: [
        {
          title: 'Entry Point',
          attrs: [
            {
              id: 'main.run', name: 'run()',
              sig: '<span class="sig-name">run</span>(<span class="sig-params">config: <span class="sig-type">Config</span></span>)\n<span class="sig-return">→ None</span>',
              desc: 'Application main entry, init config and start core pipeline',
              io: { input: 'config: Config — application config object', output: 'None' },
            },
            {
              id: 'main.parse_args', name: 'parse_args()',
              sig: '<span class="sig-name">parse_args</span>()\n<span class="sig-return">→ Namespace</span>',
              desc: 'Parse command-line arguments',
            },
            {
              id: 'main.setup_logging', name: 'setup_logging()',
              desc: 'Initialize logging configuration',
            },
          ],
        },
      ],
    },
    {
      id: 'config', label: 'config', type: 'module', x: 60, y: 340, w: 260,
      sections: [
        {
          title: 'Configuration',
          attrs: [
            {
              id: 'config.load', name: 'load()',
              sig: '<span class="sig-name">load</span>(<span class="sig-params">path: <span class="sig-type">str</span></span>)\n<span class="sig-return">→ Config</span>',
              desc: 'Load configuration from file',
              io: { input: 'path: str — config file path', output: 'Config — parsed config object' },
            },
            {
              id: 'config.validate', name: 'validate()',
              sig: '<span class="sig-name">validate</span>(<span class="sig-params">data: <span class="sig-type">dict</span></span>)\n<span class="sig-return">→ bool</span>',
              desc: 'Validate configuration data',
            },
            {
              id: 'config.get_default', name: 'get_default()',
              desc: 'Return default configuration values',
            },
          ],
        },
      ],
    },
    {
      id: 'Pipeline', label: 'Pipeline', type: 'class', x: 420, y: 60, w: 280,
      sections: [
        {
          title: 'Core Methods',
          attrs: [
            {
              id: 'Pipeline.execute', name: 'execute()',
              sig: '<span class="sig-name">execute</span>(<span class="sig-params">data: <span class="sig-type">DataFrame</span></span>)\n<span class="sig-return">→ Result</span>',
              desc: 'Execute the full data processing pipeline',
              io: { input: 'data: DataFrame — input data', output: 'Result — processed result' },
              children: [
                { id: 'Pipeline._preprocess', name: '_preprocess()', desc: 'Data preprocessing and cleaning' },
                { id: 'Pipeline._transform', name: '_transform()', desc: 'Data transformation and feature extraction' },
              ],
              childrenCollapsed: false,
            },
            {
              id: 'Pipeline.add_step', name: 'add_step()',
              sig: '<span class="sig-name">add_step</span>(<span class="sig-params">step: <span class="sig-type">Step</span></span>)\n<span class="sig-return">→ None</span>',
              desc: 'Add a processing step to the pipeline',
            },
          ],
        },
        {
          title: 'Lifecycle',
          attrs: [
            {
              id: 'Pipeline.init', name: '__init__()',
              desc: 'Initialize pipeline with default steps',
            },
            {
              id: 'Pipeline.teardown', name: 'teardown()',
              desc: 'Clean up resources and temp files',
            },
          ],
        },
      ],
    },
    {
      id: 'utils', label: 'utils', type: 'function', x: 420, y: 400, w: 260,
      sections: [
        {
          title: 'Utility Functions',
          attrs: [
            {
              id: 'utils.format_output', name: 'format_output()',
              sig: '<span class="sig-name">format_output</span>(<span class="sig-params">result: <span class="sig-type">Result</span>, fmt: <span class="sig-type">str</span> = "json"</span>)\n<span class="sig-return">→ str</span>',
              desc: 'Format processing result to specified output format',
            },
            {
              id: 'utils.timer', name: 'timer()',
              desc: 'Performance timer decorator',
            },
            {
              id: 'utils.retry', name: 'retry()',
              desc: 'Retry decorator with exponential backoff',
            },
          ],
        },
      ],
    },
    {
      id: 'Logger', label: 'Logger', type: 'module', x: 780, y: 60, w: 240,
      sections: [
        {
          title: 'Logging',
          attrs: [
            {
              id: 'Logger.info', name: 'info()',
              desc: 'Log INFO level message',
            },
            {
              id: 'Logger.error', name: 'error()',
              desc: 'Log ERROR level message',
            },
            {
              id: 'Logger.setup', name: 'setup()',
              desc: 'Initialize log handlers and format',
            },
          ],
        },
      ],
    },
    {
      id: 'requests', label: 'requests', type: 'module', external: true, x: 780, y: 280, w: 240,
      sections: [
        {
          title: 'HTTP Client',
          attrs: [
            {
              id: 'requests.get', name: 'get()',
              desc: 'Send HTTP GET request (external lib)',
            },
            {
              id: 'requests.post', name: 'post()',
              desc: 'Send HTTP POST request (external lib)',
            },
          ],
        },
      ],
    },
    {
      id: 'EventBus', label: 'EventBus', type: 'class', x: 780, y: 440, w: 240,
      sections: [
        {
          title: 'Event System',
          attrs: [
            {
              id: 'EventBus.emit', name: 'emit()',
              desc: 'Emit an event to all registered listeners',
            },
            {
              id: 'EventBus.on', name: 'on()',
              desc: 'Register an event listener',
            },
            {
              id: 'EventBus.off', name: 'off()',
              desc: 'Remove an event listener',
            },
          ],
        },
      ],
    },
  ],

  CONNECTIONS: [
    // call (solid green) — function invocations
    ['main.run', 'config.load', '#a6e3a1', false],
    ['main.run', 'Pipeline.execute', '#a6e3a1', false],
    ['main.run', 'Logger.setup', '#a6e3a1', false],
    ['main.setup_logging', 'Logger.setup', '#a6e3a1', false],
    ['Pipeline.execute', 'utils.format_output', '#a6e3a1', false],
    ['Pipeline.execute', 'Pipeline._preprocess', '#a6e3a1', false],
    ['Pipeline._preprocess', 'Pipeline._transform', '#a6e3a1', false],
    // data (solid blue) — data flow
    ['config.load', 'Pipeline.init', '#89b4fa', false],
    ['config.validate', 'config.load', '#89b4fa', false],
    ['utils.format_output', 'Logger.info', '#89b4fa', false],
    // extern (solid orange) — external lib calls
    ['Pipeline._transform', 'requests.get', '#fab387', false],
    ['Pipeline._transform', 'requests.post', '#fab387', false],
    // signal (dashed pink) — event/signal connections
    ['Pipeline.execute', 'Logger.info', '#f5c2e7', true],
    ['Pipeline.execute', 'Logger.error', '#f5c2e7', true],
    ['Pipeline.execute', 'EventBus.emit', '#f5c2e7', true],
    ['main.run', 'EventBus.on', '#f5c2e7', true],
  ],

  GROUPS: [
    { id: 'g-core', label: 'core/', color: '#585b70', bg: 'rgba(88,91,112,0.06)', x: 400, y: 30, w: 700, h: 620, nodes: ['Pipeline', 'utils', 'Logger', 'requests', 'EventBus'] },
  ],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Page 2: Data Models — Data, Widget, Class types
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DIAGRAMS.data_models = {
  title: 'Data Models — Schema & Types',
  sub: 'app/models/ — Data transfer objects and schemas',
  navLabel: 'Data Models',
  navSub: 'app/models/',

  NODES: [
    {
      id: 'UserModel', label: 'UserModel', type: 'data', x: 60, y: 60, w: 280,
      sections: [
        {
          title: 'Fields',
          attrs: [
            { id: 'UserModel.id', name: 'id', val: ': int', desc: 'User unique identifier' },
            { id: 'UserModel.name', name: 'name', val: ': str', desc: 'User display name' },
            { id: 'UserModel.email', name: 'email', val: ': str', desc: 'User email address' },
            { id: 'UserModel.role', name: 'role', val: ': Role', desc: 'User role enum' },
          ],
        },
        {
          title: 'Methods',
          attrs: [
            {
              id: 'UserModel.validate', name: 'validate()',
              desc: 'Validate user data integrity',
            },
            {
              id: 'UserModel.to_dict', name: 'to_dict()',
              desc: 'Convert user model to dictionary',
            },
          ],
        },
      ],
    },
    {
      id: 'TaskModel', label: 'TaskModel', type: 'data', x: 420, y: 60, w: 280,
      sections: [
        {
          title: 'Fields',
          attrs: [
            { id: 'TaskModel.id', name: 'id', val: ': int', desc: 'Task unique identifier' },
            { id: 'TaskModel.title', name: 'title', val: ': str', desc: 'Task title' },
            { id: 'TaskModel.assignee', name: 'assignee', val: ': UserModel', desc: 'Task assignee' },
            { id: 'TaskModel.status', name: 'status', val: ': Status', desc: 'Task status enum' },
            { id: 'TaskModel.priority', name: 'priority', val: ': int', desc: 'Task priority level' },
          ],
        },
        {
          title: 'Methods',
          attrs: [
            {
              id: 'TaskModel.assign', name: 'assign()',
              desc: 'Assign task to a user',
            },
            {
              id: 'TaskModel.complete', name: 'complete()',
              desc: 'Mark task as completed',
            },
          ],
        },
      ],
    },
    {
      id: 'TaskDialog', label: 'TaskDialog', type: 'widget', x: 60, y: 380, w: 280,
      sections: [
        {
          title: 'UI Components',
          attrs: [
            { id: 'TaskDialog.render', name: 'render()', desc: 'Render task edit dialog' },
            { id: 'TaskDialog.on_submit', name: 'on_submit()', desc: 'Submit button callback' },
            { id: 'TaskDialog.on_cancel', name: 'on_cancel()', desc: 'Cancel button callback' },
            { id: 'TaskDialog.on_delete', name: 'on_delete()', desc: 'Delete button callback' },
          ],
        },
      ],
    },
    {
      id: 'Serializer', label: 'Serializer', type: 'class', x: 420, y: 380, w: 280,
      sections: [
        {
          title: 'Serialization',
          attrs: [
            {
              id: 'Serializer.to_json', name: 'to_json()',
              desc: 'Serialize model to JSON string',
            },
            {
              id: 'Serializer.from_json', name: 'from_json()',
              desc: 'Deserialize JSON string to model instance',
            },
            {
              id: 'Serializer.to_yaml', name: 'to_yaml()',
              desc: 'Serialize model to YAML format',
            },
          ],
        },
      ],
    },
    {
      id: 'db', label: 'db', type: 'module', external: true, x: 780, y: 60, w: 240,
      sections: [
        {
          title: 'Database ORM',
          attrs: [
            { id: 'db.query', name: 'query()', desc: 'Execute database query (external)' },
            { id: 'db.insert', name: 'insert()', desc: 'Insert record (external)' },
            { id: 'db.update', name: 'update()', desc: 'Update record (external)' },
          ],
        },
      ],
    },
    {
      id: 'Notifier', label: 'Notifier', type: 'function', x: 780, y: 340, w: 240,
      sections: [
        {
          title: 'Notification',
          attrs: [
            {
              id: 'Notifier.send_email', name: 'send_email()',
              desc: 'Send email notification',
            },
            {
              id: 'Notifier.send_slack', name: 'send_slack()',
              desc: 'Send Slack notification',
            },
          ],
        },
      ],
    },
  ],

  CONNECTIONS: [
    // data (solid blue) — data references
    ['TaskModel.assignee', 'UserModel.id', '#89b4fa', false],
    ['TaskModel.status', 'UserModel.role', '#89b4fa', false],
    // call (solid green) — function calls
    ['TaskDialog.on_submit', 'TaskModel.assign', '#a6e3a1', false],
    ['TaskDialog.on_submit', 'Serializer.to_json', '#a6e3a1', false],
    ['TaskDialog.on_delete', 'db.update', '#a6e3a1', false],
    ['TaskModel.complete', 'Serializer.to_json', '#a6e3a1', false],
    ['Serializer.from_json', 'UserModel.validate', '#a6e3a1', false],
    // extern (solid orange) — external calls
    ['TaskModel.assign', 'db.insert', '#fab387', false],
    ['TaskModel.complete', 'db.update', '#fab387', false],
    ['UserModel.validate', 'db.query', '#fab387', false],
    // signal (dashed pink) — events/signals
    ['TaskDialog.on_submit', 'Notifier.send_email', '#f5c2e7', true],
    ['TaskModel.complete', 'Notifier.send_slack', '#f5c2e7', true],
    ['TaskDialog.on_submit', 'UserModel.validate', '#f5c2e7', true],
  ],

  GROUPS: [
    { id: 'g-models', label: 'models/', color: '#585b70', bg: 'rgba(88,91,112,0.06)', x: 40, y: 30, w: 680, h: 280, nodes: ['UserModel', 'TaskModel'] },
    { id: 'g-services', label: 'services/', color: '#585b70', bg: 'rgba(88,91,112,0.06)', x: 40, y: 350, w: 680, h: 180, nodes: ['TaskDialog', 'Serializer'] },
  ],
};

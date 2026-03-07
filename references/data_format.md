# Code Flow Graph Data Format Reference

## Overview

The data file `code_flow_graph_data.js` defines a global `var DIAGRAMS = {};` object. Each key in `DIAGRAMS` is a diagram identifier (sidebar entry). A special `_projectTitle` key can set the sidebar header.

## Top-level Structure

```js
var DIAGRAMS = {};
DIAGRAMS._projectTitle = 'My Project'; // optional sidebar header

DIAGRAMS.module_name = {
  title: 'Module Name — Class Diagram',        // header title
  sub: 'path/to/module.py — description',       // subtitle
  navLabel: 'Module Name',                       // sidebar label
  navSub: 'path/to/module.py',                   // sidebar sublabel
  NODES: [ ... ],
  CONNECTIONS: [ ... ],
  GROUPS: [ ... ],
};
```

## NODES Array

Each node represents a **class**, **module**, **function group**, or **UI component**. Each node object:

```js
{
  id: 'className',                    // unique string, used in CONNECTIONS
  label: 'ClassName',                 // display name (header text)
  type: 'class | module | function | entry | data | QDialog | widget | slots',
  // type determines the badge label on the header (all nodes share 6px rounded shape):
  //   class      → CLASS badge
  //   module     → MODULE badge
  //   function/functions → FUNC badge
  //   entry      → ENTRY badge
  //   data       → DATA badge
  //   QDialog/widget/slots → UI CLASS / SLOTS badge
  // External dependencies use the appropriate type (module/class) with `external: true`.
  external: false,                    // optional — true for third-party dependencies (dashed border + EXT tag)
  // Visual differentiation is via color auto-assigned by type.
  x: 30, y: 60,                       // default position (pixels)
  w: 280,                             // node width (pixels)
  sections: [                         // method/attribute groups
    {
      title: 'Public Methods',        // section header (optional)
      code: 'some code snippet',      // code block (optional, mutually exclusive with attrs)
      attrs: [
        {
          id: 'cls.method_name',      // unique, format: nodeId.attrName — used in CONNECTIONS
          name: 'method_name()',       // display text
          val: '→ returns X',          // right-side value text (optional)
          sig: '<span class="sig-name">method_name</span>(<span class="sig-params">param1, param2=default</span>)\n<span class="sig-return">→ ReturnType</span>',  // optional: hover tooltip HTML showing full signature
          // For typed parameters, use: <span class="sig-type">Type</span> in sig
          desc: '函数功能的一行中文描述',  // optional: Chinese description shown in tooltip and call chain
          detail: '更详细的函数说明，包括：核心处理逻辑、关键步骤、调用的重要函数、副作用、异常处理等。支持多行文本。',  // optional: detailed description shown below desc in tooltip
          io: { input: 'param1: Type — 说明', output: 'ReturnType — 说明' },  // optional: input/output shown in tooltip
          children: [                 // optional: sub-functions called by this function (same file)
            {                         // children are COLLAPSIBLE by default, user can expand via ▶ toggle
              id: 'cls.sub_func',     // same format as parent attr
              name: 'sub_func()',
              sig: '...',             // optional tooltip for child too
            },
          ],
          childrenCollapsed: true,    // optional: default collapsed state (true by default)
          callChain: [                // optional: complete call chain data for detail panel
            {
              id: 'cls.method_name',  // MUST exactly match the target attr's id in the graph (format: NodeId.method_name)
                                      // The viewer uses this id to highlight the corresponding node/attr when clicked.
                                      // If this id doesn't match any attr in the current diagram, click-to-highlight won't work.
              name: 'method_name()',  // display name
              module: 'module.py',    // source module (optional)
              desc: 'One-line description of what the function does',  // description text shown below function name
              sig: 'method_name(param1, param2) → ReturnType',  // plain text signature (legacy, prefer desc)
              external: false,        // true if from external module
              calls: [                // recursive sub-calls
                { id: '...', name: '...', module: '...', desc: '...', calls: [...] },
              ],
            },
          ],
        },
      ],
    },
  ],
}
```

### Node CSS Classes (Unified Color Scheme)

### Node Type Visual Styles

All node types share the same **unified shape** (6px rounded corners, 1.5px solid border). Types are distinguished by **color** (auto-assigned by type) and the **badge** on the header bar. Nodes with `external: true` get dashed borders and an `EXT` tag.

| type value | Header Badge |
|-----------|-------------|
| class | CLASS |
| module | MODULE |
| function/functions | FUNC |
| entry | ENTRY |
| data | DATA |
| QDialog/widget | UI CLASS |
| slots | SLOTS |


## CONNECTIONS Array

Each connection is a 4-element or 5-element array:

```js
['sourceAttrId', 'targetAttrId', '#color', dashed]
// or with optional label:
['sourceAttrId', 'targetAttrId', '#color', dashed, 'label text']
```

- `sourceAttrId` / `targetAttrId`: attribute `id` values from NODES (format: `nodeId.attrName`)
- `color`: hex color string for the bezier curve
- `dashed`: `true` for dashed lines (signals/events), `false` for solid (direct calls)
- `label` (optional): text shown at the midpoint of the connection

### Connection Color Conventions

All connections render with a **gradient stroke** that transitions from light (transparent) at the source to full opacity at the target, indicating flow direction (caller → callee, emitter → handler). This provides a clear, static visual indication of data/call direction without arrows or animations.

- `#a6e3a1` (green) — direct function call
- `#f38ba8` (red) — inheritance / override
- `#89b4fa` (blue) — data flow / return value
- `#f5c2e7` (pink) — signal / event / callback
- `#fab387` (peach) — external dependency call
- `#6c7086` (overlay) — weak reference / optional

## GROUPS Array

Each group represents a **folder / module / package**:

```js
{
  id: 'grp-module',                           // unique group id
  label: 'module_name/ (Package)',            // display label
  nodes: ['class1', 'class2'],                // array of node ids in this group
  color: '#89b4fa',                           // border/label color
  bg: 'rgba(137,180,250,0.04)',               // background fill
}
```

## Layout Guidelines

### Positioning — Grid-Aligned Layout

Arrange nodes on an **implicit grid** for a clean, organized appearance:

- **Column-based layout**: Organize nodes into vertical columns following execution flow (left → right: callers → callees). Align all nodes in the same column to the **same x coordinate**.
- **Grid spacing**: Use consistent column width of **320px** (center-to-center) and row spacing of **40px** between node bottom edges and the next node top edge.
- **Starting position**: First column at `x: 30`, first row at `y: 60`.
- **Column assignment**:
  - Column 0 (x: 30): Entry points / root callers
  - Column 1 (x: 350): Direct callees of entry points
  - Column 2 (x: 670): Second-level callees
  - Column 3+ (x: 990, 1310, ...): Deeper calls
- **Vertical alignment within a column**: Stack nodes top-to-bottom with consistent gap. Estimate node height as `80 + (attrCount × 22)` px. Place the next node at `y_previous + estimatedHeight + 40`.
- **External/utility nodes**: Place in the rightmost column or a separate row below (y > 800) to avoid cluttering the main flow.
- **Group-aware placement**: Nodes within the same GROUP should be placed adjacent to each other (same column or adjacent columns) so the group's dashed border stays compact.

### Group Spacing

The auto-layout engine uses the following spacing parameters for groups. When manually placing nodes, follow these values to ensure consistent, compact spacing:

- **INTER_GROUP_GAP**: `20px` — minimum gap between different groups' bounding boxes. Keep this tight to avoid large empty areas between groups.
- **INTRA_GROUP_GAP**: `24px` — vertical gap between nodes within the same group.
- **GROUP_PAD**: `18px` — padding inside the group's dashed border around its member nodes.

Groups should appear tightly packed with uniform spacing. Avoid excessive whitespace between groups — the layout should feel compact and organized rather than scattered.

### Node Sizing

- Standard class: `w: 260-320`
- Small utility: `w: 200-240`
- Large class with many methods: `w: 300-350`

### Node Internal Styling

Section headers inside nodes (e.g., "PUBLIC METHODS", "PRIVATE METHODS") use the `.attr-section` style:

- **Font size**: `9.5px` — large enough to be readable at default zoom
- **Color**: `#7f849c` — a visible mid-gray that stands out from the dark node background while remaining visually subordinate to function names
- **Text transform**: uppercase with `1px` letter-spacing — distinguishes section headers from function attr rows
- Do NOT add glow (`text-shadow`) or other decorative effects to section headers; keep them clean and understated

### For UI-Related Code

When the codebase has a graphical UI (Qt, Web, etc.):

1. Create a dedicated diagram entry for the UI layer
2. Use `widget` type for UI widget/component nodes (renders with `UI CLASS` badge and sapphire blue color — same family as `class` blue but visually distinct)
3. Each UI node's sections should list:
   - Widget structure (buttons, layouts)
   - Event handlers / slots
   - Connected business logic methods (as connections to other class nodes)
4. Connections from UI event handlers to business logic should use dashed pink lines
5. The sidebar entry `navLabel` should indicate it's a UI view (e.g., "UI — MainWindow")

## Complete Minimal Example

```js
var DIAGRAMS = {};
DIAGRAMS._projectTitle = 'MyApp';

DIAGRAMS.core = {
  title: 'Core Module',
  sub: 'src/core/ — business logic',
  navLabel: 'Core',
  navSub: 'src/core/',
  NODES: [
    { id: 'Engine', label: 'Engine', type: 'class', x: 30, y: 60, w: 280, sections: [
      { title: 'Public', attrs: [
        { id: 'Engine.start', name: 'start()' },
        { id: 'Engine.stop', name: 'stop()' },
      ]},
      { title: 'Private', attrs: [
        { id: 'Engine._init', name: '_init_subsystems()' },
      ]},
    ]},
    { id: 'Logger', label: 'Logger', type: 'class', x: 400, y: 60, w: 240, sections: [
      { title: 'Methods', attrs: [
        { id: 'Logger.log', name: 'log(msg)' },
      ]},
    ]},
  ],
  CONNECTIONS: [
    ['Engine._init', 'Logger.log', '#a6e3a1',
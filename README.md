# Code Graph Viewer

An interactive HTML node-graph viewer skill for [CodeBuddy](https://codebuddy.codes/) (Tencent AI Coding Assistant) that visualizes codebase structure, class relationships, and function call chains.

![Catppuccin Mocha Theme](https://img.shields.io/badge/theme-Catppuccin%20Mocha-b4befe?style=flat-square) ![Standalone HTML](https://img.shields.io/badge/output-standalone%20HTML-a6e3a1?style=flat-square) ![No Dependencies](https://img.shields.io/badge/dependencies-none-89b4fa?style=flat-square)

## Features

- **Interactive Node Graph** — Draggable nodes with bezier-curve connections, pan & zoom
- **Call Chain Detail Panel** — Click entry-point functions to explore the complete call tree in a right-side panel
- **Global Search (Ctrl+K)** — Fuzzy search across ALL diagram pages with cross-diagram navigation
- **Multi-Diagram Support** — Organize views by entry-point call chains, UI layers, data types, and overview
- **Smart Highlighting** — Click any function to highlight its node + all connected relationships; dim everything else
- **Collapsible Children** — Sub-functions collapse/expand with connection redirect to parent
- **Signature Tooltips** — Hover functions to see full signatures, descriptions, and I/O
- **Position Persistence** — Node positions saved to localStorage per diagram
- **Catppuccin Mocha Dark Theme** — Beautiful dark color scheme with 12 semantic color classes

## How It Works

This is a **CodeBuddy Skill** — when installed, CodeBuddy's AI can automatically generate interactive code architecture diagrams for any codebase you're working on.

The output consists of two files:

| File | Purpose |
|------|---------|
| `code_graph_viewer.html` | Rendering engine (provided by this skill, do not modify) |
| `code_graph_data.js` | Diagram data (generated per-project by CodeBuddy AI) |

Simply place both files in the same directory and open the HTML in a browser.

## Installation

### As a CodeBuddy Skill

Copy the entire repository into your CodeBuddy skills directory:

```
<project>/.codebuddy/skills/code-graph-viewer/
  SKILL.md
  assets/
    code_graph_viewer.html
  references/
    data_format.md
```

Then ask CodeBuddy: *"Visualize the code architecture of this project"* or *"Generate a code graph for this module"*.

### Standalone Usage

You can also use the viewer independently:

1. Copy `assets/code_graph_viewer.html` to your project
2. Create a `code_graph_data.js` file following the format in `references/data_format.md`
3. Open the HTML file in a browser

## Data Format

See [`references/data_format.md`](references/data_format.md) for the complete data format specification.

### Quick Example

```js
var DIAGRAMS = {};
DIAGRAMS._projectTitle = 'MyApp';

DIAGRAMS.core = {
  title: 'Core Module',
  sub: 'src/core/ — business logic',
  navLabel: 'Core',
  navSub: 'src/core/',
  NODES: [
    {
      id: 'Engine', label: 'Engine', type: 'class',
      cls: 'c-class-1', x: 30, y: 60, w: 280,
      sections: [{
        title: 'Public', attrs: [
          { id: 'Engine.start', name: 'start()', visibility: 'public' },
          { id: 'Engine.stop', name: 'stop()', visibility: 'public' },
        ]
      }]
    },
    {
      id: 'Logger', label: 'Logger', type: 'class',
      cls: 'c-class-6', x: 400, y: 60, w: 240,
      sections: [{
        title: 'Methods', attrs: [
          { id: 'Logger.log', name: 'log(msg)', visibility: 'public' },
        ]
      }]
    },
  ],
  CONNECTIONS: [
    ['Engine.start', 'Logger.log', '#a6e3a1', false],
  ],
  GROUPS: [
    { id: 'grp-core', label: 'core/', nodes: ['Engine', 'Logger'],
      color: '#89b4fa', bg: 'rgba(137,180,250,0.04)' },
  ],
};
```

## Color Scheme

Uses [Catppuccin Mocha](https://github.com/catppuccin/catppuccin) palette with semantic meaning:

| Class | Color | Usage |
|-------|-------|-------|
| `c-class-1` | 🟡 Yellow | Entry point / orchestrator |
| `c-class-2` | 🟢 Green | Core logic |
| `c-class-3` | 🔴 Red | Shape matching / builder |
| `c-class-4` | 🟣 Mauve | Compatibility mode |
| `c-class-5` | 🩵 Teal | Multi-mesh mode |
| `c-class-6` | 🔵 Blue | Shared services |
| `c-class-7` | 💎 Sapphire | External dependencies |
| `c-class-8` | 🟤 Maroon | Data types |
| `c-class-9` | 💜 Lavender | Utilities |
| `c-class-10` | 🩷 Pink | Signals / events |
| `c-class-11` | ☁️ Sky | Extensions |
| `c-class-12` | 🟠 Peach | Helpers |
| `c-ui` | 🌸 Flamingo | UI components |

## Connection Types

| Color | Style | Meaning |
|-------|-------|---------|
| Green (`#a6e3a1`) | Solid | Direct function call |
| Red (`#f38ba8`) | Solid | Inheritance / override |
| Blue (`#89b4fa`) | Solid | Data flow |
| Pink (`#f5c2e7`) | Dashed | Signal / event / callback |
| Peach (`#fab387`) | Solid | External dependency |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Ctrl+K` | Open global search |
| `Escape` | Close search / detail panel |
| Click blank area | Clear all highlights |

## License

MIT

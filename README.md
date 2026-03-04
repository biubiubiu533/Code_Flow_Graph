# Code Flow Graph

An interactive HTML node-graph viewer skill that visualizes codebase structure, entry-point call chains, and data type flows.

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

The viewer renders two files together:

| File | Purpose |
|------|---------|
| `code_flow_graph.html` | Rendering engine (do not modify) |
| `code_flow_graph_data.js` | Diagram data (generated per-project by your AI assistant) |

Simply place both files in the same directory and open the HTML in a browser.

## Installation

### As an Agent Skill

Copy the entire repository into your AI agent's skills directory:

```
<project>/.skills/code_flow_graph/
  SKILL.md
  assets/
    code_flow_graph.html
  references/
    data_format.md
```

Then ask your AI: *"Visualize the code architecture of this project"* or *"Generate a code graph for this module"*.

### Standalone Usage

You can also use the viewer independently:

1. Copy `assets/code_flow_graph.html` to your project
2. Create a `code_flow_graph_data.js` file following the format in `references/data_format.md`
3. Open the HTML file in a browser

## Data Format

See [`references/data_format.md`](references/data_format.md) for the complete data format specification.

## Data Type Flow (Datatype Diagram)

The viewer supports a dedicated **datatype diagram** that traces how data structures flow through the codebase — from definition to transformation to consumption.

Each node in the datatype diagram represents a data class or type definition (`c-class-8` / Maroon). Connections show how data flows between components:

| Connection Color | Meaning |
|-----------------|---------|
| Blue (`#89b4fa`) | Data passed as input / output between functions |
| Green (`#a6e3a1`) | Data constructed or returned by a function |
| Peach (`#fab387`) | Data consumed by an external dependency |

A typical datatype flow looks like:

```
[RawInput] ──construct──▶ [ParsedData] ──transform──▶ [ModelInput] ──consume──▶ [ExternalAPI]
```

To include a datatype diagram in your `code_flow_graph_data.js`:

```js
DIAGRAMS.datatypes = {
  title: 'Data Type Flow',
  sub: 'How data structures move through the system',
  navLabel: 'DataTypes',
  navSub: 'data flow',
  NODES: [
    {
      id: 'UserInput', label: 'UserInput', type: 'class',
      cls: 'c-class-8', x: 30, y: 60, w: 240,
      sections: [{ title: 'Fields', attrs: [
        { id: 'UserInput.query', name: 'query: str' },
        { id: 'UserInput.lang',  name: 'lang: str' },
      ]}]
    },
    {
      id: 'ParsedRequest', label: 'ParsedRequest', type: 'class',
      cls: 'c-class-8', x: 340, y: 60, w: 260,
      sections: [{ title: 'Fields', attrs: [
        { id: 'ParsedRequest.tokens', name: 'tokens: List[str]' },
        { id: 'ParsedRequest.intent', name: 'intent: str' },
      ]}]
    },
  ],
  CONNECTIONS: [
    ['UserInput.query', 'ParsedRequest.tokens', '#89b4fa', false],
  ],
};
```

## Color Scheme

Uses [Catppuccin Mocha](https://github.com/catppuccin/catppuccin) palette with semantic meaning:

| Class | Color | Recommended Usage |
|-------|-------|-------------------|
| `c-class-1` | 🟡 Yellow | Entry points, main orchestrators, pipeline roots |
| `c-class-2` | 🟢 Green | Core business logic, primary processing modules |
| `c-class-3` | 🔴 Red | Pattern matching, builders, constructors |
| `c-class-4` | 🟣 Mauve | Adapters, wrappers, compatibility layers |
| `c-class-5` | 🩵 Teal | Specialized processing modes, parallel paths |
| `c-class-6` | 🔵 Blue | Shared services, caches, registries |
| `c-class-7` | 💎 Sapphire | External / third-party dependencies |
| `c-class-8` | 🟤 Maroon | Data types, dataclasses, schemas |
| `c-class-9` | 💜 Lavender | Utilities, common helpers |
| `c-class-10` | 🩷 Pink | Signals, events, callbacks |
| `c-class-11` | ☁️ Sky | Extensions, plugins, optional modules |
| `c-class-12` | 🟠 Peach | Internal helpers, minor utilities |
| `c-ui` | 🌸 Flamingo | UI components, widgets, views |

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

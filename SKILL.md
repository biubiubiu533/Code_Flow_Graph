---
name: code_flow_graph
description: >
  This skill generates interactive HTML node-graph diagrams to visualize codebase
  structure, class relationships, and function call chains. It should be used when
  the user asks to visualize, diagram, or map out code architecture, module
  dependencies, class hierarchies, or UI event flows. The output is a standalone
  HTML+JS viewer with draggable nodes, bezier-curve connections, group boxes,
  sidebar navigation, global search (Ctrl+K), call-chain detail panel, localStorage
  position persistence, and Catppuccin Mocha dark theme.
---

# Code Flow Graph

Generate interactive node-graph HTML diagrams that visualize code structure and call relationships.

## When to Use

- User requests code structure visualization, architecture diagrams, or call-chain mapping
- User wants to understand how classes/modules/functions relate to each other
- User wants to see UI event flows (button click → handler → business logic) — UI projects only
- User asks to "diagram", "visualize", "map out", or "graph" the code

## Architecture

The output consists of two files placed in a dedicated folder:

1. **`code_flow_graph.html`** — rendering engine (copy from `assets/code_flow_graph.html`)
2. **`code_flow_graph_data.js`** — diagram data (generated per-project)

The HTML loads the JS via `<script src="code_flow_graph_data.js">` and must be in the same directory.

## Workflow

> **Core principle**: NEVER start building graphs blindly. Always go through the interactive scoping process (Step 0 → Step 1) to let the user decide what to analyze.

### Step 0: Build Project Overview & Confirm Analysis Scope

This step is **MANDATORY** for all projects. You must complete both phases before any code analysis begins.

#### Phase A: Present Project Overview & Ask User to Choose Scope

1. Read the project's top-level structure: README, entry scripts (`__main__.py`, `main.py`, `index.ts`, `app.py`), config files (`setup.py`, `pyproject.toml`, `package.json`, `Cargo.toml`), and directory layout
2. Determine whether the project has a **UI layer** (Qt, React, Web, etc.) or is **non-UI** (CLI, library, backend, pipeline, etc.)
3. Build a brief **project overview** listing:
   - Project type (library / CLI / web service / desktop app / etc.)
   - Major modules/packages and their purposes
   - Whether a UI layer exists
4. **Present the overview to the user** and ask TWO questions:
   - Which part(s) to analyze
   - What language to use for diagram labels/descriptions (default: **Chinese**)

   > "Based on the project structure, here is an overview:
   >
   > **Project type**: CLI tool / Library / Web service / ...
   > **Has UI**: Yes (Qt/React/...) / No
   >
   > **Major modules/areas**:
   > 1. `module_a/` — description
   > 2. `module_b/` — description
   > 3. `cli/` — command-line entry points
   > 4. ...
   >
   > Which part(s) would you like to visualize? (You can pick one or more, or say 'all')
   >
   > What language should I use for diagram labels, descriptions, and tooltips? (default: **中文**)"

5. **STOP and wait for the user's response.** Do NOT proceed until the user confirms the scope. Use the user's chosen language for all `desc`, `sig` hint text, `io` labels, section titles, and `navSub` in the generated data. If the user doesn't specify, default to **Chinese (中文)**.

#### Phase B: Identify Main Entry Points & Confirm with User

Once the user selects a scope, analyze **only** that portion of the codebase to find the **main execution entry points**:

- **CLI entry points** — `if __name__ == '__main__'`, Click/Typer/argparse commands, `console_scripts`
- **Public API functions** — exported functions in `__init__.py`, decorated endpoints (`@app.route`, `@api_view`)
- **Pipeline/task entry points** — Celery tasks, Airflow DAGs, scheduled jobs
- **Hook/plugin entry points** — registered callbacks, plugin `activate()` methods
- **Class constructors + primary methods** — the main "do something" methods of core classes
- **UI entry points** (UI projects only) — main window creation, app initialization, route/page registration

Present the discovered entry points to the user and ask for confirmation:

   > "In the selected scope, I found these main entry points / key logic paths:
   >
   > 1. `main()` in `cli.py` — CLI entry, dispatches subcommands
   > 2. `Pipeline.run()` in `core/pipeline.py` — main processing pipeline
   > 3. `Converter.convert()` in `converter.py` — core conversion logic
   > 4. ...
   >
   > I will generate one call-chain diagram per entry point above, plus an Overview diagram.
   > Shall I proceed with all of these, or would you like to pick specific ones?"

**STOP and wait for the user's confirmation.** The user may:
- Confirm all
- Pick a subset
- Add entry points you missed
- Ask to adjust granularity (more/less detail)

### Step 1: Analyze the Codebase

Only after the user confirms the entry points in Step 0, begin detailed code analysis **within the confirmed scope**.

Identify the following elements:

- **Folders/packages** → become GROUPS (dashed border containers with label — always represent directory/package scope, NEVER used for individual modules or arbitrary grouping)
- **Modules** → become NODES (type: `module`) — a single `.py`/`.ts`/`.rs` file
- **Classes** → become NODES (type: `class`)
- **Function groups** → become NODES (type: `function`)
- **Entry points** → become NODES (type: `entry`)
- **External deps** → become NODES (type: `external`)
- **Data types** → become NODES (type: `data`)
- **Methods** → become attributes (attrs) within node sections
- **Function calls between classes** → become CONNECTIONS

For **UI projects**, additionally identify:
- Widget hierarchy, event handler bindings, and which business logic methods each handler calls
- These become dedicated UI nodes with event connections

For **non-UI projects**, skip all UI-related analysis. Focus on:
- The **confirmed entry points** and their call chains
- Each confirmed entry point becomes a dedicated diagram page
- Cross-module dependencies and shared utilities

### Step 2: Create Output Folder

Create a new folder inside the project for the visualization output. Naming convention: `<project>/code_graph/` or a user-specified location.

### Step 3: Copy the HTML Engine

Copy `assets/code_flow_graph.html` to the output folder. Do not modify it.

#### Engine Features (built-in, code_flow_graph.html)

1. **Search** — Ctrl+K opens search box; fuzzy-matches function names across ALL diagrams; click to jump cross-diagram
2. **Collapsed Children Redirect** — When children are collapsed, connections redirect to the parent attr instead of disappearing
3. **Click Blank to Deselect** — Click any blank area in the viewport to clear all highlights and close the detail panel
4. **Enhanced Legend** — Node types (class/module/function/entry/singleton/external) with distinct border shapes AND connection color semantics (call/data/extern/signal) with directional arrows
5. **Signature Tooltips** — Hover any function attr to see full signature; callChain attrs show "Click to view call chain →" hint
6. **Call Chain Detail Panel** — Click attrs with `callChain` to open right-side interactive call tree; each item shows a `desc` (description) explaining what the function does; clicking any item with a matching graph node highlights that node and pans the viewport to it
7. **Position Persistence** — Node positions saved to localStorage per diagram; "Reset Layout" restores defaults
8. **Connection Anchor via offsetTop** — Connection line anchors use `offsetTop`/`offsetParent` chain (NOT `getBoundingClientRect`) to compute attr Y-offset within a node. This is critical because the canvas uses `CSS transform: scale()` for zoom — `getBoundingClientRect` returns screen-space coordinates that include the scale factor, causing connection lines to misalign at non-1x zoom levels

### Step 4: Generate `code_flow_graph_data.js`

Refer to `references/data_format.md` for the complete data format specification including NODES, CONNECTIONS, GROUPS structure, color schemes, node types, and layout guidelines.

Key principles:

- **Unified colors across pages** — The same module/concept MUST use the same `cls` color class in ALL diagrams
- **Simplify** — Focus on core business logic; skip trivial getters/setters/logging; collapse internal helpers into parent's `children`
- **Call chains** — Add `callChain` to key entry-point functions to enable the detail panel; include `desc` for every item explaining what the function does
- **Call chain `id` MUST exactly match graph attr `id`** — Each item in `callChain` has an `id` field. This `id` is used by the viewer to locate and highlight the corresponding attr in the graph when clicked. If the `id` doesn't match any attr's `id` in the current diagram, the highlight will fail silently. Always ensure `callChain[].id` uses the exact same string as the target `attrs[].id` (format: `NodeId.method_name`)
- **Signatures** — Add `sig` field with HTML tooltip for every non-trivial function attr

#### Diagram Organization Strategy

Diagrams are organized **by core entry-point function call chains**, NOT by file or folder structure. This gives a much clearer picture of actual program flow.

##### Required Diagrams (in sidebar order)

1. **Overview** — Module-level dependency graph showing all confirmed entry points and shared services. Keep this high-level (one node per module/class, not per function). Entry points highlighted with `c-class-1`.
2. **One diagram per confirmed entry point** — Each diagram traces the **complete call chain** of that entry function:
   - The entry function as the root node
   - Each called function as a separate node (or attr with `children` for small helpers)
   - Each node describes **what the function does** (via `sig` hint) and **which module it lives in**
   - Cross-module calls are shown with different connection colors
   - Utility/external dependencies collected in a dedicated "External Deps" node
3. **UI** (UI projects ONLY, skip for non-UI projects) — Widget hierarchy and event handler → business logic dispatch
4. **Data Types** (if applicable) — Dataclasses, NamedTuples, TypedDicts with field listings and data flow

##### Non-UI Project Diagram Guidelines

For non-UI projects, **skip all UI-related diagrams and analysis**. The sidebar structure follows the user's confirmed entry points:

1. **Overview** — High-level module dependency graph; each module is a single node, entry points highlighted with `c-class-1`
2. **One diagram per confirmed entry point** — Named after the entry function (e.g., "Pipeline.run()", "CLI — build command"). Each traces the complete call chain from that entry point
3. **Data Types** — If the project defines significant data structures
4. **Config / Constants** (optional) — If configuration or constant definitions are central to understanding the code

##### How to Build a Call-Chain Diagram

1. Read the entry function's source code completely
2. For each function it calls, determine:
   - Is it an internal helper (same module)? → attr with `children` or separate node in same group
   - Is it a cross-module call? → separate node, different color, place in "External" group
   - Does it have sub-calls worth showing? → recurse and show as nested children or connected nodes
3. Organize nodes **left-to-right** following execution order (entry on left, deepest calls on right)
4. Each node should have a `sig` with a **one-line hint** explaining what the function does
5. Add `callChain` to the entry function attr for the interactive detail panel

##### Element Mapping

| Code Concept | Graph Element |
|---|---|
| Entry function | NODE (type: `entry`) — thick rounded border + glow, root of the diagram |
| Class / core object | NODE (type: `class`) — double border, square corners |
| Module / package | NODE (type: `module`) — left accent bar, italic header |
| Function group / utility | NODE (type: `function`) — rounded thin border |
| Singleton instance | NODE (type: `singleton`) — dashed border |
| Pipeline step / major called function | NODE with attrs for its sub-calls |
| Small helper called once | attr with `children` inside parent node |
| Cross-module dependency | NODE (type: `external`) — dotted border, asymmetric corners, dimmed |
| Data type / dataclass | NODE (type: `data`) — thick top accent |
| UI widget / dialog | NODE (type: `widget`) — thick top accent |
| Public method | attr with `visibility: 'public'` |
| Private method (`_` prefix) | attr with `visibility: 'private'` |
| Descriptive note | attr without visibility |
| Direct function call A→B | CONNECTION (solid, arrow toward callee) |
| Signal / event / callback | CONNECTION (dashed, arrow toward target) |

##### Specialized Diagram Types

**UI Diagrams** — ONLY for projects with graphical interfaces (Qt, React, Web). Skip entirely for non-UI projects:
1. Create a dedicated diagram entry per major UI view/window
2. Use `c-ui` class for widget nodes with sections: Widgets, Event Handlers (private), Slots
3. Draw dashed pink connections from event handlers to business logic

**Data Type Diagrams** — For projects with dataclasses/NamedTuples/TypedDicts:
1. Create a dedicated "Data Types" diagram entry
2. Each dataclass → node with type `data`, cls `c-class-8` (maroon)
3. List fields as attrs with type in the `val` field
4. Add a "Data Flow" node showing creation/consumption pipeline

### Step 5: Verify

After generating both files, verify the data file has valid JS syntax.

## Handling Large Codebases

When the data JS file exceeds ~500 lines per diagram entry:

- Focus on the entry function's direct and second-level calls; collapse deeper calls into `children`
- Summarize repetitive patterns (e.g., "N similar UV operations") rather than listing every one
- Cross-module calls should reference the target diagram by name in the `sig` hint

## Known Pitfalls

### Connection Anchor Calculation Must Use offsetTop

When calculating where bezier connection lines attach to attribute rows, **always use `offsetTop` / `offsetParent` chain** — never use `getBoundingClientRect()`.

**Why**: The canvas applies `CSS transform: translate() scale()` for pan & zoom. `getBoundingClientRect()` returns screen-space pixel coordinates that already include the scale factor. When computing `relY = attrRect.top - nodeRect.top`, the result is in scaled pixels, but the connection coordinates are drawn in the unscaled canvas coordinate system. This causes connection lines to progressively misalign as the user zooms in/out.

**Correct pattern** (used in `code_flow_graph.html`):
```js
var relY = el.offsetHeight / 2;
var cur = el;
while (cur && cur !== nodeEl) {
  relY += cur.offsetTop;
  cur = cur.offsetParent;
}
```

**Wrong pattern** (causes misaligned connections at non-1x zoom):
```js
var attrRect = el.getBoundingClientRect();
var nodeRect = nodeEl.getBoundingClientRect();
var relY = (attrRect.top - nodeRect.top) + attrRect.height / 2;
```

If you generate standalone HTML viewers outside this skill (e.g., `warp_card_diagram.html`, `node_diagram.html`), apply the same offsetTop pattern in their `getAttrAnchor()` function.

### Canvas Transform Must Be Synced Before Measuring

In `switchDiagram()`, after resetting `scale = 1; panX = 0; panY = 0;`, you **must call `applyTransform()`** before the `requestAnimationFrame` callback that runs `redrawConnections()`. Otherwise the canvas still has the **previous diagram's transform** (e.g., `scale(0.5)` from `fitToView`), and any coordinate measurement (even `offsetTop`) operates on a stale visual state.

**Correct pattern**:
```js
scale = 1; panX = 0; panY = 0;
applyTransform(); // flush transform to canvas BEFORE measuring
requestAnimationFrame(function() {
  updateGroupBounds(); redrawConnections(); fitToView();
});
```

**Wrong pattern** (stale transform during measurement):
```js
scale = 1; panX = 0; panY = 0;
// missing applyTransform()!
requestAnimationFrame(function() {
  updateGroupBounds(); redrawConnections(); fitToView();
});
```

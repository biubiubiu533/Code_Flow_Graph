---
name: code-graph-viewer
description: >
  This skill generates interactive HTML node-graph diagrams to visualize codebase
  structure, class relationships, and function call chains. It should be used when
  the user asks to visualize, diagram, or map out code architecture, module
  dependencies, class hierarchies, or UI event flows. The output is a standalone
  HTML+JS viewer with draggable nodes, bezier-curve connections, group boxes,
  sidebar navigation, global search (Ctrl+K), call-chain detail panel, localStorage
  position persistence, and Catppuccin Mocha dark theme.
---

# Code Graph Viewer

Generate interactive node-graph HTML diagrams that visualize code structure and call relationships.

## When to Use

- User requests code structure visualization, architecture diagrams, or call-chain mapping
- User wants to understand how classes/modules/functions relate to each other
- User wants to see UI event flows (button click → handler → business logic)
- User asks to "diagram", "visualize", "map out", or "graph" the code

## Architecture

The output consists of two files placed in a dedicated folder:

1. **`code_graph_viewer.html`** — rendering engine (copy from `assets/code_graph_viewer.html`)
2. **`code_graph_data.js`** — diagram data (generated per-project)

The HTML loads the JS via `<script src="code_graph_data.js">` and must be in the same directory.

## Workflow

### Step 1: Analyze the Codebase

Explore the target codebase to identify:

- **Modules/packages** → become GROUPS (folder-level containers)
- **Classes/major functions** → become NODES
- **Methods** → become attributes (attrs) within node sections
- **Function calls between classes** → become CONNECTIONS
- **UI widgets and event handlers** → become dedicated UI nodes with event connections

For UI code, additionally identify widget hierarchy, event handler bindings, and which business logic methods each handler calls.

### Step 2: Create Output Folder

Create a new folder inside the project for the visualization output. Naming convention: `<project>/code_graph/` or a user-specified location.

### Step 3: Copy the HTML Engine

Copy `assets/code_graph_viewer.html` to the output folder. Do not modify it.

#### Engine Features (built-in)

1. **Search** — Ctrl+K opens search box; fuzzy-matches function names across ALL diagrams; click to jump cross-diagram
2. **Collapsed Children Redirect** — When children are collapsed, connections redirect to the parent attr instead of disappearing
3. **Click Blank to Deselect** — Click any blank area in the viewport to clear all highlights and close the detail panel
4. **Enhanced Legend** — Node types (class/function/singleton) AND connection color semantics (call/data/extern/signal)
5. **Signature Tooltips** — Hover any function attr to see full signature; callChain attrs show "Click to view call chain →" hint
6. **Call Chain Detail Panel** — Click attrs with `callChain` to open right-side interactive call tree; each item shows a `desc` (description) explaining what the function does; clicking any item with a matching graph node highlights that node and pans the viewport to it
7. **Position Persistence** — Node positions saved to localStorage per diagram; "Reset Layout" restores defaults
8. **Connection Anchor via offsetTop** — Connection line anchors use `offsetTop`/`offsetParent` chain (NOT `getBoundingClientRect`) to compute attr Y-offset within a node. This is critical because the canvas uses `CSS transform: scale()` for zoom — `getBoundingClientRect` returns screen-space coordinates that include the scale factor, causing connection lines to misalign at non-1x zoom levels

### Step 4: Generate `code_graph_data.js`

Refer to `references/data_format.md` for the complete data format specification including NODES, CONNECTIONS, GROUPS structure, color schemes, node types, and layout guidelines.

Key principles:

- **Unified colors across pages** — The same module/concept MUST use the same `cls` color class in ALL diagrams
- **Simplify** — Focus on core business logic; skip trivial getters/setters/logging; collapse internal helpers into parent's `children`
- **Call chains** — Add `callChain` to key entry-point functions to enable the detail panel; include `desc` for every item explaining what the function does
- **Signatures** — Add `sig` field with HTML tooltip for every non-trivial function attr

#### Diagram Organization Strategy

Diagrams are organized **by core entry-point function call chains**, NOT by file or folder structure. This gives a much clearer picture of actual program flow.

##### Required Diagrams (in sidebar order)

1. **Overview** — Module-level dependency graph showing all entry functions, UI, and shared services. Keep this high-level (one node per module/class, not per function).
2. **One diagram per core entry function** — Identified from the UI or entry points. Each diagram traces the **complete call chain** of that function:
   - The entry function as the root node
   - Each called function as a separate node (or attr with `children` for small helpers)
   - Each node describes **what the function does** (via `sig` hint) and **which module it lives in**
   - Cross-module calls are shown with different connection colors
   - Utility/external dependencies collected in a dedicated "External Deps" node
3. **UI** — Widget hierarchy and event handler → business logic dispatch
4. **Data Types** — Dataclasses, NamedTuples, TypedDicts with field listings and data flow

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
| Entry function | NODE (type: `entry`) — root of the diagram |
| Pipeline step / major called function | NODE with attrs for its sub-calls |
| Small helper called once | attr with `children` inside parent node |
| Cross-module dependency | NODE (type: `external`) in separate group |
| Public method | attr with `visibility: 'public'` |
| Private method (`_` prefix) | attr with `visibility: 'private'` |
| Descriptive note | attr without visibility |
| Direct function call A→B | CONNECTION (solid) |
| Signal / event / callback | CONNECTION (dashed) |

##### Specialized Diagram Types

**UI Diagrams** — For projects with graphical interfaces (Qt, React, Web):
1. Create a dedicated diagram entry per major UI view/window
2. Use `c-ui` class for widget nodes with sections: Widgets, Event Handlers (private), Slots
3. Draw dashed pink connections from event handlers to business logic

**Data Type Diagrams** — For projects with dataclasses/NamedTuples/TypedDicts:
1. Create a dedicated "Data Types" diagram entry
2. Each dataclass → node with type `class`, cls `c-class-8` (maroon)
3. List fields as attrs with type in the `val` field
4. Add a "Data Flow" node showing creation/consumption pipeline

### Step 5: Verify

After generating both files, verify the data file has valid JS syntax.

## Handling Large Codebases

When the data JS exceeds ~500 lines per diagram entry:

- Focus on the entry function's direct and second-level calls; collapse deeper calls into `children`
- Summarize repetitive patterns (e.g., "N similar UV operations") rather than listing every one
- Cross-module calls should reference the target diagram by name in the `sig` hint

## Known Pitfalls

### Connection Anchor Calculation Must Use offsetTop

When calculating where bezier connection lines attach to attribute rows, **always use `offsetTop` / `offsetParent` chain** — never use `getBoundingClientRect()`.

**Why**: The canvas applies `CSS transform: translate() scale()` for pan & zoom. `getBoundingClientRect()` returns screen-space pixel coordinates that already include the scale factor. When computing `relY = attrRect.top - nodeRect.top`, the result is in scaled pixels, but the connection coordinates are drawn in the unscaled canvas coordinate system. This causes connection lines to progressively misalign as the user zooms in/out.

**Correct pattern** (used in `code_graph_viewer.html`):
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

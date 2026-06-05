# Graph Report - uid_eco  (2026-06-04)

## Corpus Check
- 20 files · ~20,937 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 150 nodes · 197 edges · 12 communities (10 shown, 2 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9c3eb0da`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 16 edges
2. `Pkm` - 5 edges
3. `RegistryViolation` - 5 edges
4. `userInitials` - 5 edges
5. `scripts` - 4 edges
6. `VIOLATIONS` - 4 edges
7. `USERS` - 4 edges
8. `PkmStatus` - 4 edges
9. `RegistryViolationStatus` - 4 edges
10. `ViolationCard()` - 4 edges

## Surprising Connections (you probably didn't know these)
- `PkmCard()` --calls--> `userInitials`  [EXTRACTED]
  src/pages/PkmCard.tsx → src/data.ts
- `ViolationCard()` --calls--> `userInitials`  [EXTRACTED]
  src/pages/ViolationCard.tsx → src/data.ts

## Import Cycles
- None detected.

## Communities (12 total, 2 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.11
Nodes (13): Props, Props, Route, Crit, Dir, HistoryEntry, Pkm, PkmStatus (+5 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (23): dependencies, @babel/runtime, @bem-react/classname, @bem-react/classnames, chart.js, @consta/icons, @consta/uikit, react (+15 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (17): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+9 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (10): BRIGADES, CLUSTERS, CRITS, DIRS, FIELDS, MSProps, Props, SOURCES (+2 more)

### Community 4 - "Community 4"
Cohesion: 0.18
Nodes (11): PkmCard(), Props, statusCls(), fmtRub(), Props, statusCls(), ViolationCard(), PKM_STATUSES (+3 more)

### Community 5 - "Community 5"
Cohesion: 0.17
Nodes (4): MSProps, Props, VIOLATION_TYPES, ViolationType

### Community 6 - "Community 6"
Cohesion: 0.22
Nodes (7): PkmCreate(), PkmDraft, Props, todayIso(), RegistryViolation, USERS, VIOLATIONS

### Community 7 - "Community 7"
Cohesion: 0.21
Nodes (4): generalData, tabs, menu, MenuItem

### Community 9 - "Community 9"
Cohesion: 0.29
Nodes (5): data, FlagmanRating(), FlatRow, flatten(), Row

## Knowledge Gaps
- **65 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+60 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **2 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What connects `name`, `private`, `version` to the rest of the system?**
  _65 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.11076923076923077 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.11764705882352941 - nodes in this community are weakly interconnected._
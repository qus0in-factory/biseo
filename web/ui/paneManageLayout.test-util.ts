import assert from 'node:assert/strict'
export function assertPanelGrid(css: string) {
 assert.match(css, /\.settings-content > \*, \.settings-content \[role=tablist\] \{ min-width: 0; max-width: 100%; \}/)
 assert.match(css, /section > \[role=status\] \{ margin-block: \.5rem; \}/)
 assert.match(css, /\.pane-manage-head \{ display: contents; \}/)
 assert.match(css, /grid-template-columns: minmax\(0, 1fr\) auto/)
 assert.match(css, /\.pane-manage-name \{ min-width: 0; overflow-wrap: anywhere/)
 assert.match(css, /\.pane-manage-summary \{[^}]*flex-wrap: wrap;[^}]*grid-column: 1; grid-row: 2/)
 assert.match(css, /\.pane-actions \{[^}]*grid-column: 2; grid-row: 1 \/ span 2/)
}

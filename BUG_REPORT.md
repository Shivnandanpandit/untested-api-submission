# Bug Report

## Bug 1: Pagination Offset Calculation Error
- **Expected Behavior:** Requesting page `1` with limit `10` (`getPaginated(1, 10)`) should return items 1 through 10.
- **Actual Behavior:** The calculation `offset = page * limit` evaluated to `10` for page `1`, skipping the first 10 items.
- **Discovery Method:** `taskService.test.js` unit test (`should retrieve page 1 items correctly`).
- **Fix:** Update offset formula to `(page - 1) * limit`.

## Bug 2: Task Completion Overwrites Priority
- **Expected Behavior:** Calling `completeTask(id)` should update `status` to `'done'` while preserving the existing `priority`.
- **Actual Behavior:** Hardcoded `priority: 'medium'` reset high/low priority tasks back to medium.
- **Discovery Method:** `taskService.test.js` unit test (`should maintain existing priority when completing task`).
- **Fix:** Retain `task.priority` when creating the updated object.

## Bug 3: Status Filtering Substring Match
- **Expected Behavior:** `getByStatus('todo')` should match only exact status strings.
- **Actual Behavior:** `t.status.includes(status)` matches substrings (`status=do` matched both `todo` and `done`).
- **Discovery Method:** Code review & unit test inspection.
- **Fix:** Replace `.includes()` with strict equality (`t.status === status`).
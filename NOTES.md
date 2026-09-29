# Submission Notes

**What I'd test next if I had more time:**
- Edge cases for pagination, such as negative page numbers or non-numeric queries.
- Input sanitization against XSS in string fields (`title`, `description`, `assignee`).
- Concurrency testing for the in-memory store under high load.

**Anything that surprised me in the codebase:**
- The `completeTask` function completely overwrote the priority to `'medium'` regardless of its original state. It was a subtle bug that unit testing caught immediately.

**Questions I'd ask before shipping this to production:**
- Are we planning to migrate from the in-memory array to a persistent database (like PostgreSQL or MongoDB) before launch?
- Should the `assignee` field reference a specific User ID from a database rather than accepting a plain string?
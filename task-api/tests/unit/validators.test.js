const { validateCreateTask, validateUpdateTask } = require('../../src/utils/validators');

describe('Validators Unit Tests', () => {
  describe('validateCreateTask', () => {
    it('should return null for valid payload', () => {
      const valid = { title: 'Test Task', status: 'todo', priority: 'high', dueDate: '2026-10-01T00:00:00.000Z' };
      expect(validateCreateTask(valid)).toBeNull();
    });

    it('should reject missing or non-string title', () => {
      expect(validateCreateTask({})).toContain('title is required');
      expect(validateCreateTask({ title: '   ' })).toContain('title is required');
      expect(validateCreateTask({ title: 123 })).toContain('title is required');
    });

    it('should reject invalid status', () => {
      expect(validateCreateTask({ title: 'Task', status: 'invalid' })).toContain('status must be one of');
    });

    it('should reject invalid priority', () => {
      expect(validateCreateTask({ title: 'Task', priority: 'urgent' })).toContain('priority must be one of');
    });

    it('should reject invalid dueDate', () => {
      expect(validateCreateTask({ title: 'Task', dueDate: 'not-a-date' })).toContain('dueDate must be a valid ISO date string');
    });
  });

  describe('validateUpdateTask', () => {
    it('should return null for valid update payload', () => {
      expect(validateUpdateTask({ title: 'Updated' })).toBeNull();
      expect(validateUpdateTask({ priority: 'low' })).toBeNull();
    });

    it('should reject empty title string on update', () => {
      expect(validateUpdateTask({ title: '   ' })).toContain('title must be a non-empty string');
    });

    it('should reject invalid status on update', () => {
      expect(validateUpdateTask({ status: 'wrong' })).toContain('status must be one of');
    });
  });
});
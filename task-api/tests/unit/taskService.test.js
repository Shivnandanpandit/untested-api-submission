const taskService = require('../../src/services/taskService');

describe('taskService Unit Tests', () => {
  beforeEach(() => {
    taskService._reset();
  });

  it('should create and find task by ID', () => {
    const task = taskService.create({ title: 'New Task' });
    expect(task).toHaveProperty('id');
    expect(taskService.findById(task.id)).toEqual(task);
  });

  it('should list all tasks', () => {
    taskService.create({ title: 'Task 1' });
    taskService.create({ title: 'Task 2' });
    expect(taskService.getAll().length).toBe(2);
  });

  it('should filter strictly by status (catches substring matching bug)', () => {
    taskService.create({ title: 'Todo Item', status: 'todo' });
    taskService.create({ title: 'Done Item', status: 'done' });

    const todoTasks = taskService.getByStatus('todo');
    expect(todoTasks.length).toBe(1);
    expect(todoTasks[0].status).toBe('todo');
  });

  it('should retrieve page 1 items correctly (catches pagination offset bug)', () => {
    for (let i = 1; i <= 15; i++) {
      taskService.create({ title: `Item ${i}` });
    }

    const page1 = taskService.getPaginated(1, 10);
    expect(page1.length).toBe(10);
    expect(page1[0].title).toBe('Item 1');
  });

  it('should update task details', () => {
    const task = taskService.create({ title: 'Old Title' });
    const updated = taskService.update(task.id, { title: 'New Title' });
    expect(updated.title).toBe('New Title');
  });

  it('should maintain existing priority when completing task (catches priority reset bug)', () => {
    const task = taskService.create({ title: 'High Priority', priority: 'high' });
    const completed = taskService.completeTask(task.id);

    expect(completed.status).toBe('done');
    expect(completed.priority).toBe('high');
  });

  it('should compute status stats and overdue counts correctly', () => {
    const past = new Date(Date.now() - 86400000).toISOString();
    taskService.create({ title: 'Overdue', status: 'todo', dueDate: past });
    taskService.create({ title: 'Done in past', status: 'done', dueDate: past });

    const stats = taskService.getStats();
    expect(stats.todo).toBe(1);
    expect(stats.done).toBe(1);
    expect(stats.overdue).toBe(1);
  });

  it('should remove existing task and return false for non-existent task', () => {
    const task = taskService.create({ title: 'Delete me' });
    expect(taskService.remove(task.id)).toBe(true);
    expect(taskService.remove('fake-id')).toBe(false);
  });
});
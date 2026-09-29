const request = require('supertest');
const app = require('../../src/app');
const taskService = require('../../src/services/taskService');

describe('Task API Routes Integration Tests', () => {
  beforeEach(() => {
    taskService._reset();
  });

  describe('GET /tasks', () => {
    it('should return empty list when no tasks exist', async () => {
      const res = await request(app).get('/tasks');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should filter by status parameter', async () => {
      taskService.create({ title: 'Task 1', status: 'todo' });
      taskService.create({ title: 'Task 2', status: 'done' });

      const res = await request(app).get('/tasks?status=todo');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
    });

    it('should return paginated tasks', async () => {
      for (let i = 1; i <= 5; i++) taskService.create({ title: `Task ${i}` });

      const res = await request(app).get('/tasks?page=1&limit=2');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  describe('POST /tasks', () => {
    it('should create a task with valid data', async () => {
      const res = await request(app)
        .post('/tasks')
        .send({ title: 'Integration Test Task', priority: 'high' });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.title).toBe('Integration Test Task');
    });

    it('should return 400 for invalid payload', async () => {
      const res = await request(app).post('/tasks').send({});
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('PUT /tasks/:id', () => {
    it('should update an existing task', async () => {
      const task = taskService.create({ title: 'Original' });
      const res = await request(app)
        .put(`/tasks/${task.id}`)
        .send({ title: 'Updated' });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated');
    });

    it('should return 404 for non-existent ID', async () => {
      const res = await request(app)
        .put('/tasks/non-existent-id')
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /tasks/:id', () => {
    it('should delete a task and return 204', async () => {
      const task = taskService.create({ title: 'To Delete' });
      const res = await request(app).delete(`/tasks/${task.id}`);
      expect(res.status).toBe(204);
    });

    it('should return 404 when deleting missing task', async () => {
      const res = await request(app).delete('/tasks/invalid-id');
      expect(res.status).toBe(404);
    });
  });

  // ... (DELETE block is above here)

  describe('PATCH /tasks/:id/complete', () => {
    it('should mark task complete and return 200', async () => {
      const task = taskService.create({ title: 'Incomplete' });
      const res = await request(app).patch(`/tasks/${task.id}/complete`);
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('done');
      expect(res.body.completedAt).not.toBeNull();
    });

    it('should return 404 for missing task', async () => {
      const res = await request(app).patch('/tasks/missing-id/complete');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /tasks/stats', () => {
    it('should return correct task stats', async () => {
      taskService.create({ title: 'Task 1', status: 'todo' });
      const res = await request(app).get('/tasks/stats');
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('todo', 1);
      expect(res.body).toHaveProperty('overdue');
    });
  });

  describe('PATCH /tasks/:id/assign', () => {
    it('should assign a task successfully', async () => {
      const task = taskService.create({ title: 'Task to Assign' });
      const res = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({ assignee: 'Alice' });

      expect(res.status).toBe(200);
      expect(res.body.assignee).toBe('Alice');
    });

    it('should return 400 for empty or invalid assignee', async () => {
      const task = taskService.create({ title: 'Task' });
      const res = await request(app)
        .patch(`/tasks/${task.id}/assign`)
        .send({ assignee: '   ' });

      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 404 for non-existent task', async () => {
      const res = await request(app)
        .patch('/tasks/invalid-id/assign')
        .send({ assignee: 'Alice' });

      expect(res.status).toBe(404);
    });
  });
});
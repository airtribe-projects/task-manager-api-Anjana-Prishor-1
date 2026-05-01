require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 8089;
const { tasks } = require('./task.json');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// GET /tasks: Retrieve all tasks (with optional filtering)
app.get('/tasks', (req, res) => {
  let filteredTasks = tasks;

  // Optional query parameters for filtering
  const { completed, title, limit, sort } = req.query;

  // Filter by completion status
  if (completed !== undefined) {
    const isCompleted = completed === 'true';
    filteredTasks = filteredTasks.filter(task => task.completed === isCompleted);
  }

  // Filter by title (case-insensitive partial match)
  if (title) {
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  // Sort results
  if (sort) {
    if (sort === 'title') {
      filteredTasks = filteredTasks.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'id') {
      filteredTasks = filteredTasks.sort((a, b) => a.id - b.id);
    }
  }

  // Limit results
  if (limit) {
    const limitNum = parseInt(limit);
    if (!isNaN(limitNum) && limitNum > 0) {
      filteredTasks = filteredTasks.slice(0, limitNum);
    } else {
      return res.status(400).json({ error: 'Invalid limit - must be a positive number' });
    }
  }

  res.json(filteredTasks);
});

// GET /tasks/:id: Retrieve a specific task by its ID
app.get('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || req.params.id !== id.toString()) {
    return res.status(400).json({ error: 'Invalid task ID - must be a number' });
  }
  const task = tasks.find(t => t.id === id);
  if (!task) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json(task);
});

// POST /tasks: Create a new task
app.post('/tasks', (req, res) => {
  const { title, description, completed } = req.body;

  // Validate required fields (catches empty strings, null, undefined)
  if (!title || !description || completed === undefined) {
    return res.status(400).json({ error: 'Title, description, and completed are required and cannot be empty' });
  }

  const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1;
  const newTask = { id: newId, title, description, completed };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// PUT /tasks/:id: Update an existing task by its ID
app.put('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || req.params.id !== id.toString()) {
    return res.status(400).json({ error: 'Invalid task ID - must be a number' });
  }
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  const { title, description, completed } = req.body;
  if (title !== undefined) tasks[taskIndex].title = title;
  if (description !== undefined) tasks[taskIndex].description = description;
  if (completed !== undefined) tasks[taskIndex].completed = completed;
  res.json(tasks[taskIndex]);
});

// PATCH /tasks/:id: Partially update an existing task by its ID
app.patch('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);   
  if (isNaN(id) || req.params.id !== id.toString()) {
    return res.status(400).json({ error: 'Invalid task ID - must be a number' });
  }
  const taskIndex = tasks.findIndex(t => t.id === id);
  if(taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  } 
    const { title, description, completed } = req.body;
    if (title !== undefined) tasks[taskIndex].title = title;
    if (description !== undefined) tasks[taskIndex].description = description;
    if (completed !== undefined) tasks[taskIndex].completed = completed;
    res.json(tasks[taskIndex]);
});


// DELETE /tasks/:id: Delete a task by its ID
app.delete('/tasks/:id', (req, res) => {
  const id = parseInt(req.params.id);
  if (isNaN(id) || req.params.id !== id.toString()) {
    return res.status(400).json({ error: 'Invalid task ID - must be a number' });
  }
  const taskIndex = tasks.findIndex(t => t.id === id);
  if (taskIndex === -1) {
    return res.status(404).json({ error: 'Task not found' });
  }
  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});

module.exports = app;

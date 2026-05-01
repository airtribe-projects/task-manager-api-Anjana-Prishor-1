# Task Manager API

A RESTful API for managing tasks built with Node.js, Express, and in-memory storage.

## Overview

This project implements a complete CRUD (Create, Read, Update, Delete) API for task management. It provides endpoints to create, retrieve, update, and delete tasks with features like filtering, searching, and sorting.

## Features

- ✅ **Complete CRUD Operations**: Create, Read, Update, Delete tasks
- ✅ **Advanced Filtering**: Filter by completion status, search by title
- ✅ **Sorting & Limiting**: Sort by title/ID, limit results
- ✅ **Input Validation**: Comprehensive validation for all endpoints
- ✅ **Error Handling**: Proper HTTP status codes and error messages
- ✅ **Environment Configuration**: Uses dotenv for port configuration
- ✅ **Testing**: Includes unit tests with tap and supertest

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Testing**: tap, supertest
- **Environment**: dotenv
- **Data Storage**: In-memory (JSON file)

## Project Structure

```
task-manager-api/
├── app.js              # Main application file
├── task.json           # Initial task data
├── package.json        # Dependencies and scripts
├── .env               # Environment variables
├── test/
│   └── server.test.js # Unit tests
└── README.md          # This file
```

## API Endpoints

### Base URL
```
http://localhost:8089
```

### GET /tasks
Retrieve all tasks with optional filtering.

**Query Parameters:**
- `completed` (boolean): Filter by completion status (`true`/`false`)
- `title` (string): Search tasks by title (case-insensitive partial match)
- `sort` (string): Sort by `title` or `id`
- `limit` (number): Limit number of results

**Examples:**
```bash
# Get all tasks
GET /tasks

# Get only completed tasks
GET /tasks?completed=true

# Search for tasks containing "install"
GET /tasks?title=install

# Get first 5 tasks sorted by title
GET /tasks?limit=5&sort=title

# Complex query
GET /tasks?completed=false&title=node&limit=3&sort=id
```

### GET /tasks/:id
Retrieve a specific task by ID.

**Parameters:**
- `id` (number): Task ID (must be numeric)

**Examples:**
```bash
GET /tasks/1
GET /tasks/5
```

**Error Responses:**
- `400`: Invalid ID format (non-numeric)
- `404`: Task not found

### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task Description",
  "completed": false
}
```

**Validation:**
- All fields required
- Title and description cannot be empty
- Completed must be boolean

**Response:** `201 Created` with new task object

### PUT /tasks/:id
Update an existing task (full update).

**Parameters:**
- `id` (number): Task ID

**Request Body:** Same as POST (all fields required)

**Response:** Updated task object

### PATCH /tasks/:id
Partially update an existing task.

**Parameters:**
- `id` (number): Task ID

**Request Body:** Any subset of fields (optional updates)

**Response:** Updated task object

### DELETE /tasks/:id
Delete a task by ID.

**Parameters:**
- `id` (number): Task ID

**Response:** `204 No Content`

## Task Schema

```json
{
  "id": 1,
  "title": "Set up environment",
  "description": "Install Node.js, npm, and git",
  "completed": true
}
```

- `id`: Auto-generated unique number
- `title`: String (required, non-empty)
- `description`: String (required, non-empty)
- `completed`: Boolean (required)

## Installation & Setup

### Prerequisites
- Node.js v18 or higher
- npm

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd task-manager-api

# Install dependencies
npm install
```

### Environment Setup
Create a `.env` file in the root directory:
```env
PORT=8089
```

### Running the Application
```bash
# Development mode
npm start

# With nodemon (if installed)
npx nodemon app.js
```

The server will start on `http://localhost:8089`

### Running Tests
```bash
npm test
```

## Testing with Postman/cURL

### Prerequisites for Testing
1. Start the server: `npm start`
2. Server should be running on `http://localhost:8089`
3. Use Postman, curl, or any HTTP client

### 1. GET /tasks - Retrieve All Tasks

#### Basic Request
```bash
curl http://localhost:8089/tasks
```

#### With Filtering
```bash
# Get only completed tasks
curl "http://localhost:8089/tasks?completed=true"

# Get only incomplete tasks
curl "http://localhost:8089/tasks?completed=false"

# Search by title (case-insensitive)
curl "http://localhost:8089/tasks?title=install"

# Sort by title
curl "http://localhost:8089/tasks?sort=title"

# Sort by ID
curl "http://localhost:8089/tasks?sort=id"

# Limit results
curl "http://localhost:8089/tasks?limit=3"

# Complex query: incomplete tasks with "node" in title, limit 2, sort by ID
curl "http://localhost:8089/tasks?completed=false&title=node&limit=2&sort=id"
```

### 2. GET /tasks/:id - Retrieve Specific Task

#### Valid Request
```bash
curl http://localhost:8089/tasks/1
```

#### Error Cases
```bash
# Invalid ID format (non-numeric)
curl http://localhost:8089/tasks/abc
# Returns: 400 "Invalid task ID - must be a number"

# Task not found
curl http://localhost:8089/tasks/999
# Returns: 404 "Task not found"
```

### 3. POST /tasks - Create New Task

#### Valid Request
```bash
curl -X POST http://localhost:8089/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Learn API Testing",
    "description": "Practice making API requests with Postman",
    "completed": false
  }'
```

#### Error Cases
```bash
# Missing title
curl -X POST http://localhost:8089/tasks \
  -H "Content-Type: application/json" \
  -d '{"description":"Test","completed":false}'
# Returns: 400 "Title, description, and completed are required and cannot be empty"

# Empty title
curl -X POST http://localhost:8089/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"","description":"Test","completed":false}'
# Returns: 400 "Title, description, and completed are required and cannot be empty"

# Missing completed field
curl -X POST http://localhost:8089/tasks \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test"}'
# Returns: 400 "Title, description, and completed are required and cannot be empty"
```

### 4. PUT /tasks/:id - Full Update Task

#### Valid Request
```bash
curl -X PUT http://localhost:8089/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Updated Task Title",
    "description": "Updated task description",
    "completed": true
  }'
```

#### Error Cases
```bash
# Invalid ID
curl -X PUT http://localhost:8089/tasks/abc \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test","completed":false}'
# Returns: 400 "Invalid task ID - must be a number"

# Task not found
curl -X PUT http://localhost:8089/tasks/999 \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Test","completed":false}'
# Returns: 404 "Task not found"
```

### 5. PATCH /tasks/:id - Partial Update Task

#### Valid Request (update only title)
```bash
curl -X PATCH http://localhost:8089/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "Partially Updated Title"}'
```

#### Valid Request (update only completion status)
```bash
curl -X PATCH http://localhost:8089/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true}'
```

#### Valid Request (update multiple fields)
```bash
curl -X PATCH http://localhost:8089/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{"title": "New Title", "completed": false}'
```

### 6. DELETE /tasks/:id - Delete Task

#### Valid Request
```bash
curl -X DELETE http://localhost:8089/tasks/1
# Returns: 204 No Content (empty response)
```

#### Error Cases
```bash
# Invalid ID
curl -X DELETE http://localhost:8089/tasks/abc
# Returns: 400 "Invalid task ID - must be a number"

# Task not found
curl -X DELETE http://localhost:8089/tasks/999
# Returns: 404 "Task not found"
```

## Postman Collection

### Import into Postman
1. Open Postman
2. Click "Import"
3. Create a new collection called "Task Manager API"
4. Add requests for each endpoint above
5. Set base URL to `http://localhost:8089`

### Sample Postman Tests
```javascript
// Test GET /tasks returns array
pm.test("Returns array of tasks", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.be.an('array');
});

// Test POST /tasks creates task
pm.test("Creates new task", function () {
    var jsonData = pm.response.json();
    pm.expect(jsonData).to.have.property('id');
    pm.expect(jsonData).to.have.property('title');
    pm.expect(jsonData.completed).to.be.a('boolean');
});

// Test 404 for non-existent task
pm.test("Returns 404 for non-existent task", function () {
    pm.response.to.have.status(404);
});
```

## Automated Testing

### Run Unit Tests
```bash
npm test
```

### Test Coverage
The project includes tests for:
- POST /tasks (valid and invalid data)
- GET /tasks (returns array with correct properties)
- GET /tasks/:id (returns specific task)

### Manual Testing Checklist
- [ ] GET /tasks returns all tasks
- [ ] GET /tasks?completed=true filters correctly
- [ ] GET /tasks?title=search works
- [ ] GET /tasks/1 returns specific task
- [ ] POST /tasks creates new task with auto-generated ID
- [ ] PUT /tasks/1 updates existing task
- [ ] PATCH /tasks/1 partially updates task
- [ ] DELETE /tasks/1 removes task
- [ ] Invalid IDs return 400 errors
- [ ] Non-existent tasks return 404 errors
- [ ] Empty fields in POST return 400 errors

## Error Handling

The API provides comprehensive error handling:

- **400 Bad Request**: Invalid input data or parameters
- **404 Not Found**: Resource doesn't exist
- **204 No Content**: Successful deletion

All error responses include a descriptive error message.

## Development Notes

- **Data Persistence**: Currently uses in-memory storage (data resets on restart)
- **ID Generation**: Auto-increments based on highest existing ID
- **Validation**: Strict validation prevents empty/invalid data
- **Filtering**: Query parameters allow flexible data retrieval

## Future Enhancements

- Database integration (MongoDB, PostgreSQL)
- Authentication & authorization
- Task categories/tags
- Due dates and priorities
- User management
- API documentation (Swagger/OpenAPI)
- Rate limiting
- Logging middleware

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

ISC License
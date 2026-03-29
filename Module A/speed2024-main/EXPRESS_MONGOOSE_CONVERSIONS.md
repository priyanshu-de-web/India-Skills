# PHP to Express + Mongoose Conversions

This document describes the PHP/Laravel backend modules that have been converted to Express.js + Mongoose (MongoDB).

## Overview

The following PHP backend modules from the WorldSkills 2024 Speed Test have been converted:

| Module | Original | Converted | Port |
|--------|----------|-----------|------|
| C5 | Recurring Calendar (Laravel) | Express + Mongoose | 3000 |
| C7 | Excel Download (Laravel) | Express + Mongoose | 3001 |
| C9 | API CORS (Plain PHP) | Express + Mongoose | 3002 |
| C12 | Local Table Data Control (PHP) | Express + Mongoose | 3003 |
| B30 | Upload Progressbar (PHP) | Express | 3004 |

---

## Prerequisites

- Node.js (v18+)
- MongoDB (v6+)
- npm or yarn

## Quick Start

For each module, navigate to its `express-mongoose` folder and run:

```bash
npm install
npm start
```

---

## Module Details

### 1. Recurring Calendar (C5)

**Location:** `recurring-calendar/express-mongoose/`

**Features:**
- Create one-time and recurring tasks
- Recurring types: Daily, Weekly, Monthly, Yearly
- Calendar view with tasks
- MongoDB storage for tasks

**Endpoints:**
- `GET /` - Calendar view with tasks
- `POST /tasks` - Create new task
- `GET /api/tasks` - Get tasks as JSON
- `POST /api/tasks` - Create task via API

**MongoDB Schema:**
```javascript
{
  title: String,
  task_date: Date,
  recurring_cycle: Number,
  recurring_type: ['D', 'W', 'M', 'Y'],
  recurring_end_date: Date
}
```

**Run:**
```bash
cd recurring-calendar/express-mongoose
npm install
npm start
# Visit http://localhost:3000
```

---

### 2. Excel Download (C7)

**Location:** `excel-download/express-mongoose/`



**Features:**
- Download posts with comment counts as Excel file
- MongoDB storage for posts and comments
- Uses ExcelJS library

**Endpoints:**
- `GET /` - Download Excel file
- `GET /download` - Download Excel file
- `GET /api/posts` - Get posts as JSON

**MongoDB Schemas:**
```javascript
// Post
{
  title: String,
  content: String,
  created_at: Date
}

// Comment
{
  post_id: ObjectId,
  content: String,
  author: String
}
```

**Run:**
```bash
cd excel-download/express-mongoose
npm install
npm run seed  # Seed sample data
npm start
# Visit http://localhost:3001 to download Excel
```

---

### 3. API CORS (C9)

**Location:** `api-cors/express-mongoose/`

**Features:**
- REST API with CORS support
- GET, POST, PUT, DELETE methods
- Bearer token authentication
- Custom CORS middleware

**Endpoints:**
- `GET /api/get` - Get user data
- `POST /api/post` - Login with email/password
- `PUT /api/put?user_id=128` - Get token by user ID
- `DELETE /api/delete` - Delete with Bearer token

**Test Credentials:**
- Email: `user@skill.com`
- Password: `PassworD!1`
- Token: `==test_token==`

**Run:**
```bash
cd api-cors/express-mongoose
npm install
npm start
# API available at http://localhost:3002
```

**Test with curl:**
```bash
# GET
curl http://localhost:3002/api/get

# POST
curl -X POST http://localhost:3002/api/post \
  -H "Content-Type: application/json" \
  -d '{"email":"user@skill.com","password":"PassworD!1"}'

# PUT
curl -X PUT "http://localhost:3002/api/put?user_id=128"

# DELETE
curl -X DELETE http://localhost:3002/api/delete \
  -H "Authorization: Bearer ==test_token=="
```

---

### 4. Local Table Data Control (C12)

**Location:** `local-table-data-control/express-mongoose/`

**Features:**
- Dynamic table with editable fields and rows
- Add, delete, and save rows
- MongoDB storage (replaces JSON file)

**Endpoints:**
- `GET /` - Display table
- `POST /update` - Add/delete/save rows
- `GET /api/table` - Get table data as JSON
- `POST /api/table/row` - Add row via API
- `DELETE /api/table/row/:index` - Delete row via API
- `PUT /api/table` - Save all data via API

**MongoDB Schema:**
```javascript
{
  name: String,
  fields: [String],
  rows: [[String]]
}
```

**Run:**
```bash
cd local-table-data-control/express-mongoose
npm install
npm start
# Visit http://localhost:3003
```

---

### 5. Upload Progressbar (B30)

**Location:** `upload-progressbar/express-mongoose/`

**Features:**
- File upload with progress bar
- Uses Multer for file handling
- Real-time upload progress

**Endpoints:**
- `GET /` - Upload page
- `POST /upload` - Upload file
- `GET /files/:filename` - Access uploaded files

**Run:**
```bash
cd upload-progressbar/express-mongoose
npm install
npm start
# Visit http://localhost:3004
```

---

## Project Structure

Each converted module follows this structure:

```
module-name/express-mongoose/
├── package.json
├── server.js           # Entry point
├── models/             # Mongoose schemas
│   └── ModelName.js
├── controllers/        # Route handlers
│   └── controller.js
├── routes/             # Express routes
│   └── index.js
├── middleware/         # Custom middleware (if needed)
├── views/              # EJS templates (if needed)
├── public/             # Static files (if needed)
└── seeders/            # Database seeders (if needed)
```

---

## Key Differences: PHP/Laravel vs Express/Mongoose

| Feature | PHP/Laravel | Express/Mongoose |
|---------|-------------|------------------|
| Database | MySQL | MongoDB |
| ORM | Eloquent | Mongoose |
| Template Engine | Blade | EJS |
| File Upload | $_FILES | Multer |
| Session | PHP Session | Express Session |
| CORS | Manual headers | cors middleware |

---

## Environment Variables

Each module supports the following environment variables:

```env
PORT=3000                           # Server port
MONGODB_URI=mongodb://localhost:27017/db_name  # MongoDB connection
```

---

## Running All Modules

To run all modules simultaneously, use different terminal windows:

```bash
# Terminal 1
cd recurring-calendar/express-mongoose && npm start

# Terminal 2
cd excel-download/express-mongoose && npm start

# Terminal 3
cd api-cors/express-mongoose && npm start

# Terminal 4
cd local-table-data-control/express-mongoose && npm start

# Terminal 5
cd upload-progressbar/express-mongoose && npm start
```

Or create a root `package.json` with concurrent scripts.

---

## Original PHP Files Reference

The original PHP implementations can be found in the `answer` folders:

- `recurring-calendar/answer/` - Laravel project
- `excel-download/answer/` - Laravel project
- `api-cors/answer/back-end/` - Plain PHP
- `local-table-data-control/answer/` - Plain PHP
- `upload-progressbar/answer/` - Plain PHP

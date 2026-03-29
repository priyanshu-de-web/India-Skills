# Taiwan Explorer - Module D

Taiwan tourism promotion website with frontend (HTML/CSS/JS) and backend (Express.js + Mongoose).

## Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account (connection string already configured)

### Install & Run

```bash
npm install
npm run seed    # Seeds database with regions, attractions, info items
npm run dev     # Starts server with nodemon on port 3000
```

Or without nodemon:
```bash
npm start
```

Open `http://localhost:3000` in Google Chrome.

## Database Connection

Uses MongoDB Atlas via Mongoose. Connection string is in `.env`:

```
MONGO_URI=mongodb+srv://...@practice-cluster.fnafzt1.mongodb.net/module-d
```

Connection is established in `config/db.js` and called from `src/app.js` on startup.

## Database Schema

### Regions
| Field   | Type   | Description              |
|---------|--------|--------------------------|
| id      | Number | Region ID (1-4)          |
| key     | String | north/central/south/east |
| name    | String | Display name             |
| color   | String | Hex color code           |
| summary | String | Region description       |

### Attractions
| Field     | Type     | Description                  |
|-----------|----------|------------------------------|
| id        | Number   | Attraction ID (1-12)         |
| region_id | ObjectId | FK to Regions                |
| name      | String   | Attraction name              |
| description | String | Short description            |

### Info Items
| Field    | Type   | Description                              |
|----------|--------|------------------------------------------|
| id       | Number | Item ID (1-9)                            |
| category | String | transportation/accommodation/shopping    |
| icon     | String | SVG icon reference                       |
| title    | String | Item title                               |
| body     | String | Item description                         |

### Submissions
| Field        | Type   | Description             |
|--------------|--------|-------------------------|
| name         | String | Visitor name (required) |
| email        | String | Email (required)        |
| country      | String | Country of origin       |
| interests    | String | Travel interests        |
| message      | String | Message (required)      |
| submitted_at | Date   | Timestamp               |

## API Endpoints

| Method | Endpoint         | Description                        |
|--------|------------------|------------------------------------|
| GET    | /api/regions     | All regions with their attractions |
| GET    | /api/info-items  | Practical info items (?category=)  |
| POST   | /api/contact     | Submit contact form                |

## Project Structure

```
Module D/
├── server.js              # Entry point
├── src/app.js             # Express app setup, middleware, routes
├── config/db.js           # MongoDB connection
├── model/                 # Mongoose schemas
│   ├── Region.js
│   ├── Attraction.js
│   ├── InfoItem.js
│   └── Submission.js
├── controllers/           # Route handlers
│   ├── regionController.js
│   ├── infoController.js
│   └── contactController.js
├── routes/                # Express route definitions
│   ├── regionRoutes.js
│   ├── infoRoutes.js
│   └── contactRoutes.js
├── seed.js                # Database seeder
├── public/                # Frontend static files
│   ├── index.html
│   ├── css/style.css
│   └── js/main.js
└── media_files/           # Images, icons, CSV, PDF
```

## Features

### Frontend
- Responsive design (760px breakpoint)
- Fixed navigation with hamburger menu on mobile
- Interactive Taiwan map (SVG) with clickable regions
- Tab switching for experiences and practical info
- Image gallery sliders
- Fade-in scroll animations
- Hover effects on cards and buttons
- Real-time form validation
- Text-to-Speech for essential info
- Low-res images loaded on mobile (<760px)

### Backend
- Dynamic Regional Guide from database (JOIN regions + attractions)
- Practical Information tabs from database
- Contact form with server-side validation, sanitization, and timestamp
- RESTful API endpoints

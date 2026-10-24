# Learnova

Learnova is an online learning platform for students. It brings course discovery, video lessons, progress tracking, assignments, and study notes together in one place.

## What you can do

- Browse courses and view course details
- Create an account and sign in with email verification
- Enroll in courses and continue lessons where you left off
- Track course and lesson progress
- Upload assignments and manage your profile
- Review course resources and keep personal study notes

## Project structure

```text
client/learnova/   React frontend built with Vite and Tailwind CSS
server/            Express API backed by MongoDB
```

## Requirements

- Node.js and npm
- MongoDB running locally or a MongoDB connection string
- SMTP credentials for account verification emails
- Cloudinary credentials for assignment file uploads

## Setup

Open two terminals from the project directory.

### Start the API

Create `server/.env` with your local settings:

```env
PORT=5000
MONGO_DB_URI=mongodb://localhost:27017/learnova
JWT_ACCESS_SECRET=choose_a_long_random_value
JWT_REFRESH_SECRET=choose_another_long_random_value
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASS=your_smtp_password
SMTP_FROM=Learnova <you@example.com>
```

Install dependencies and run the API:

```bash
cd server
npm install
npm run dev
```

The API runs at `http://localhost:5000` by default.

### Start the frontend

In the second terminal:

```bash
cd client/learnova
npm install
npm run dev
```

Open the local address printed by Vite. The frontend uses `http://localhost:5000/api` by default. To use another API address, create `client/learnova/.env` and set:

```env
VITE_API_URL=http://localhost:5000/api
```

## Useful commands

Run these from `client/learnova`:

```bash
npm run build
npm run preview
npm run lint
```

Run the production API from `server` with:

```bash
npm start
```

## Curriculum data

The backend includes a curriculum seeding script at `server/scripts/seedCurriculum.js`. It connects using `MONGO_DB_URI` and loads course curriculum data into MongoDB.

# Blog Platform API

A full-stack blog platform built with Node.js, Express, MongoDB, and JWT authentication. Features role-based access control, CRUD operations for posts and comments, pagination, and search functionality.

## Features

- **User Authentication**: Register and login with JWT tokens
- **Role-Based Access Control**:
  - **Reader**: Can view published posts only
  - **Writer**: Can create, edit, and delete their own posts
  - **Admin**: Can manage all posts and comments
- **Blog Posts**: Create, read, update, delete posts with tags and status (draft/published)
- **Comments**: Authenticated users can comment on published posts
- **Pagination & Search**: Search posts by title, content, or tags with pagination
- **Simple Frontend**: HTML page to display published blog posts

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Frontend**: Plain HTML/CSS/JavaScript

## Project Structure

```
blog-platform/
├── config/
│   ├── database.js          # MongoDB connection
│   └── init.sql             # (Removed - was for PostgreSQL)
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── postController.js    # Post CRUD operations
│   └── commentController.js # Comment operations
├── middleware/
│   └── auth.js              # JWT authentication & authorization
├── models/
│   ├── User.js              # User schema
│   ├── Post.js              # Post schema
│   └── Comment.js           # Comment schema
├── routes/
│   ├── auth.js              # Auth routes
│   ├── posts.js             # Post routes
│   └── comments.js          # Comment routes
├── public/
│   └── index.html           # Simple frontend
├── .env                     # Environment variables
├── server.js                # Main application file
├── package.json
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository** (or download the files):

   ```bash
   git clone <repository-url>
   cd blog-platform
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:

   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/blog_platform
   JWT_SECRET=your_super_secret_jwt_key_here
   ```

   - Replace `your_super_secret_jwt_key_here` with a strong secret key
   - If using MongoDB Atlas, replace the MONGODB_URI with your connection string

4. **Start MongoDB** (if running locally):

   ```bash
   mongod
   ```

5. **Run the application**:

   ```bash
   npm start
   ```

   The server will start on `http://localhost:5000`

6. **Access the frontend**:
   Open `http://localhost:5000` in your browser to view the blog posts.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Posts

- `GET /api/posts` - Get all posts (with pagination, search, role-based filtering)
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create new post (Writer/Admin only)
- `PUT /api/posts/:id` - Update post (Writer/Admin only)
- `DELETE /api/posts/:id` - Delete post (Writer/Admin only)

### Comments

- `GET /api/comments/:postId` - Get comments for a post
- `POST /api/comments/:postId` - Create comment on post
- `DELETE /api/comments/:id` - Delete own comment

### Health Check

- `GET /api/health` - Check API status

## API Usage Examples

### Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "password123",
    "role": "Writer"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Create a Post (requires JWT token)

```bash
curl -X POST http://localhost:5000/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my blog post...",
    "tags": ["javascript", "nodejs"],
    "status": "published"
  }'
```

### Get Posts with Search and Pagination

```bash
curl "http://localhost:5000/api/posts?page=1&limit=10&search=javascript"
```

## Deployment

### Backend (Render)

1. Create a Render account and connect your GitHub repository
2. Create a new Web Service
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables in Render dashboard
6. Deploy

### Frontend (Vercel)

1. The frontend is served statically from the `/public` directory
2. Create a Vercel account and connect your repository
3. Deploy the entire project (Vercel will serve the static files)
4. Update the API_BASE_URL in `public/index.html` to point to your deployed backend

## Testing the Application

1. **Start the server**: `npm start`
2. **Register users** with different roles using the API
3. **Create posts** as a Writer or Admin
4. **View posts** on the frontend at `http://localhost:5000`
5. **Test authentication** and role-based access

## Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- Role-based access control
- Input validation and sanitization
- CORS enabled for cross-origin requests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the ISC License.

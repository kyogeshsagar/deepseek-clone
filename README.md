# DeepSeek Clone

A modern AI-powered chat application inspired by DeepSeek, built using **Next.js**, **Clerk Authentication**, **MongoDB**, and the **OpenAI API**. Users can securely sign in, interact with an AI assistant, and manage conversations through a clean, responsive interface.

## Features

* AI-powered chatbot
* Secure authentication with Clerk
* User management using Clerk webhooks
* MongoDB database integration
* REST API using Next.js App Router
* Responsive and modern UI
* Protected routes
* Server-side API handling
* Ready for Vercel deployment

## Tech Stack

* Next.js 16
* React
* Clerk Authentication
* MongoDB Atlas
* Mongoose
* OpenAI API
* Tailwind CSS
* Vercel

## Project Structure

```text
app/
 ├── api/
 │   ├── chat/
 │   │   └── route.js
 │   └── clerk/
 │       └── route.js
 ├── components/
 ├── config/
 ├── context/
 ├── models/
 ├── sign-in/
 ├── sign-up/
 ├── layout.js
 └── page.jsx
```

## Installation

Clone the repository:

```bash
git clone https://github.com/kyogeshsagar/deepseek-clone.git
```

Move into the project folder:

```bash
cd deepseek-clone
```

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment Variables

Create a `.env.local` file and add the following:

```env
MONGODB_URI=your_mongodb_connection_string

OPENAI_API_KEY=your_openai_api_key

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key

CLERK_SECRET_KEY=your_secret_key

SIGNING_SECRET=your_webhook_signing_secret
```

## Authentication

Authentication is powered by **Clerk**.

Features include:

* User Sign Up
* User Sign In
* Protected Routes
* Clerk Webhooks
* Automatic MongoDB User Synchronization

## API Routes

### Chat API

```text
POST /api/chat
```

Handles AI chat requests.

### Clerk Webhook

```text
POST /api/clerk
```

Receives Clerk webhook events and synchronizes users with MongoDB.

## Deployment

The project is deployed using **Vercel**.

Steps:

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure environment variables.
4. Deploy.

## Future Improvements

* Chat history
* Conversation management
* Markdown rendering
* Code syntax highlighting
* File upload support
* Image generation
* Streaming AI responses
* Dark mode
* Multi-model AI support

## Author

**K. Yogesh Sagar**

GitHub: https://github.com/kyogeshsagar

## License

This project is intended for educational and learning purposes.

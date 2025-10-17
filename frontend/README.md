# OpenAI Chat Frontend 🎨

A sleek, minimal Next.js chat interface that connects to the OpenAI Chat API backend. Think of it as your personal window into the world of AI conversations—clean, fast, and delightfully simple.

## What You're Getting

This is a modern Next.js 14 application with:
- ✨ Real-time streaming chat responses
- 🎨 Beautiful, responsive UI with dark mode support
- 🔒 Secure API key handling (password-style input)
- 🚀 Built with TypeScript and Tailwind CSS
- 📱 Mobile-friendly design

## Prerequisites

Before you dive in, make sure you have:
- Node.js 18+ installed ([download here](https://nodejs.org/))
- The backend API running on `http://localhost:8000` (see `../api/README.md`)
- An OpenAI API key handy

## Setup & Installation

All commands below should be run from the `frontend/` directory.

### 1. Install Dependencies

First, let's get all the packages installed:

```bash
npm install
```

This will download Next.js, React, Tailwind CSS, and all their friends.

### 2. Set Up Environment Variables (Optional)

For local development, create a `.env.local` file:

```bash
cp .env.local.example .env.local
```

The default configuration points to `http://localhost:8000`, which should work for local development. You only need to modify this for production deployment.

### 3. Run the Development Server

Fire up the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`. Hot reload is enabled, so any changes you make will instantly appear in your browser. Magic! ✨

## Using the Chat Interface

1. **Start the Backend**: Make sure your FastAPI backend is running on port 8000 with the `OPENAI_API_KEY` environment variable set (see `../api/README.md` for instructions)

2. **Open the Frontend**: Navigate to `http://localhost:3000` in your browser

3. **Configure Your Settings**:
   - **Model**: Choose from gpt-4.1-mini, gpt-4o, gpt-4o-mini, or gpt-3.5-turbo
   - **Developer Message**: Optionally customize the system prompt (defaults to "You are a helpful assistant")

4. **Start Chatting**: Type your message and hit Send! Watch as the AI responds in real-time with streaming text.

**Note**: The OpenAI API key is securely stored on the backend and never exposed to the browser.

## Features at a Glance

### Streaming Responses
Messages appear word-by-word as the AI generates them, just like in ChatGPT. No waiting for the full response!

### Dark Mode Support
Automatically adapts to your system's color scheme preference. Your eyes will thank you during those late-night coding sessions.

### Clean Message History
All your messages are displayed in an easy-to-read conversation format. Clear the chat anytime with the "Clear Chat" button.

### Error Handling
Helpful error messages guide you if something goes wrong—missing API key, network issues, you name it.

## Building for Production

When you're ready to deploy:

```bash
npm run build
npm start
```

This creates an optimized production build and starts the server on port 3000.

## Deployment on Vercel

This frontend is designed to work seamlessly with Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure everything
4. Your app will be live in minutes!

**Important**: When deploying, you'll need to update the API endpoint in `app/page.tsx` from `http://localhost:8000` to your production backend URL.

## Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout with metadata
│   ├── page.tsx           # Main chat interface component
│   └── globals.css        # Global styles and Tailwind imports
├── package.json           # Dependencies and scripts
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── next.config.js         # Next.js configuration
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI**: React 18 with hooks

## Common Issues & Solutions

### "Failed to fetch" Error
- Make sure the backend is running on `http://localhost:8000`
- Check that CORS is enabled in the backend (it should be by default)

### API Key Errors
- Verify your OpenAI API key is valid
- Make sure you've entered the full key including the `sk-` prefix

### Dark Mode Not Working
- Dark mode follows your system preferences
- Try changing your OS theme settings

## Development Tips

- The app uses client-side rendering (`'use client'`) for interactivity
- Streaming is handled via the Fetch API's `ReadableStream`
- Messages are stored in component state—refresh to clear history
- All API calls go through the FastAPI backend for security

## Need Help?

Check out the main project README or the API documentation. Happy chatting! 🚀
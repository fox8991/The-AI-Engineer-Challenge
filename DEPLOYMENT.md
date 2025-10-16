# 🚀 Deploying to Vercel - Full Stack Guide

This guide walks you through deploying both the FastAPI backend and Next.js frontend to Vercel as a unified full-stack application.

## 📋 Prerequisites

Before you start, make sure you have:

- ✅ A [Vercel account](https://vercel.com) (free tier works great!)
- ✅ Your code pushed to a Git repository (GitHub, GitLab, or Bitbucket)
- ✅ The Vercel CLI installed: `npm install -g vercel`
- ✅ Your OpenAI API key ready

## 🎯 Deployment Architecture

Your app will be deployed as a **monorepo** with:
- **Frontend**: Next.js app served from the root domain (e.g., `https://your-app.vercel.app`)
- **Backend**: FastAPI routes accessible at `/api/*` (e.g., `https://your-app.vercel.app/api/chat`)

The `vercel.json` in your project root is already configured to handle this routing!

## 🔧 Step 1: Configure Environment Variables

### Option A: Using Vercel CLI (Recommended for First Deployment)

1. **Navigate to your project root**:
   ```bash
   cd /path/to/The-AI-Engineer-Challenge
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to preview first** (this helps test before going to production):
   ```bash
   vercel
   ```
   
   When prompted:
   - **Set up and deploy**: Yes
   - **Which scope**: Choose your account
   - **Link to existing project**: No
   - **Project name**: Accept default or customize
   - **Directory**: `.` (project root)
   - **Override settings**: No

4. **After deployment completes**, you'll get a preview URL. Now add environment variables:
   ```bash
   vercel env add NEXT_PUBLIC_API_URL
   ```
   
   When prompted:
   - **Value**: Enter your preview URL (e.g., `https://your-app-xyz.vercel.app`)
   - **Environment**: Select `Production`, `Preview`, and `Development`

### Option B: Using Vercel Dashboard

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Import your repository
3. Go to **Project Settings** → **Environment Variables**
4. Add the following variable:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your production URL (you'll need to deploy first, then update this)
   - **Environments**: Check all (Production, Preview, Development)

## 🏗️ Step 2: Deploy to Production

### Method 1: Vercel CLI (Quick Deploy)

From your project root:

```bash
vercel --prod
```

This deploys to your production domain. Your app will be live at `https://your-project-name.vercel.app`

### Method 2: Vercel Dashboard (Git Integration - Recommended)

1. **Import Your Repository**:
   - Go to [Vercel Dashboard](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git provider and repository
   - Click "Import"

2. **Configure Build Settings**:
   Vercel should auto-detect Next.js. The default settings should work:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (leave blank or use `.`)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/.next`
   - **Install Command**: `cd frontend && npm install`

3. **Add Environment Variables**:
   - Click "Environment Variables"
   - Add `NEXT_PUBLIC_API_URL` with value `https://your-project-name.vercel.app`
   - Select all environments

4. **Deploy**:
   - Click "Deploy"
   - Wait for the build to complete (usually 2-3 minutes)

## ⚙️ Step 3: Update the Environment Variable

**Important**: After your first deployment, you need to update the API URL to point to your actual domain:

1. Go to **Project Settings** → **Environment Variables**
2. Edit `NEXT_PUBLIC_API_URL`
3. Set it to your production URL: `https://your-actual-domain.vercel.app`
4. **Redeploy** to apply the changes:
   ```bash
   vercel --prod
   ```
   Or trigger a redeploy from the Vercel dashboard

## 🔐 Important: OpenAI API Keys

**The API key is entered by users in the frontend**, not stored in environment variables. This is by design for security:

- ✅ Users provide their own OpenAI API keys through the UI
- ✅ Keys are never stored on the server
- ✅ Each request includes the user's API key
- ✅ This prevents your API key from being exposed or rate-limited by multiple users

## ✅ Step 4: Verify Your Deployment

1. **Visit your production URL**: `https://your-project-name.vercel.app`

2. **Test the chat interface**:
   - Enter your OpenAI API key
   - Send a test message
   - Verify streaming responses work

3. **Check the API endpoint** (optional):
   ```bash
   curl https://your-project-name.vercel.app/api/health
   ```
   Should return: `{"status":"ok"}`

## 🔄 Continuous Deployment

Once connected to Git, Vercel automatically:
- 🚀 Deploys every push to `main` branch → Production
- 🔍 Creates preview deployments for pull requests
- ⚡ Builds are incremental and fast

## 🐛 Troubleshooting

### "Failed to fetch" or CORS errors
- **Check**: Ensure `NEXT_PUBLIC_API_URL` is set to your production domain
- **Redeploy** after updating environment variables

### API returns 500 errors
- **Check Logs**: Go to Vercel Dashboard → Your Project → Functions tab
- Look for Python runtime errors in the FastAPI function logs

### Build fails for frontend
- **Common issue**: Missing dependencies
- **Solution**: Ensure `package.json` has all required packages
- **Check**: Build logs in Vercel dashboard for specific errors

### Environment variable not updating
- Environment variables require a **redeploy** to take effect
- **Solution**: Run `vercel --prod` or trigger redeploy from dashboard

### Backend routes (like /api/chat) return 404
- **Check**: Ensure `vercel.json` is in the project root
- **Verify**: The `api` folder contains `app.py` with FastAPI routes

## 🎨 Custom Domain (Optional)

To use your own domain:

1. Go to **Project Settings** → **Domains**
2. Click "Add Domain"
3. Enter your domain name
4. Follow DNS configuration instructions
5. Update `NEXT_PUBLIC_API_URL` to your custom domain
6. Redeploy

## 📊 Monitoring

Monitor your deployment health:
- **Functions**: Check `/api/health` endpoint
- **Analytics**: Enable Vercel Analytics in Project Settings
- **Logs**: Real-time logs available in Vercel Dashboard

## 🎯 Production Checklist

Before sharing your app:

- [ ] Environment variables configured correctly
- [ ] `NEXT_PUBLIC_API_URL` points to production domain
- [ ] Tested chat functionality with real API key
- [ ] Verified streaming responses work
- [ ] Checked mobile responsiveness
- [ ] Tested dark mode
- [ ] Reviewed error handling
- [ ] Confirmed no console errors in browser

## 🚀 Share Your App!

Once deployed, share your creation:
- **Production URL**: `https://your-project-name.vercel.app`
- Test in an incognito window to verify public access
- Share on LinkedIn and tag @AIMakerspace! 🎉

## 💡 Pro Tips

1. **Preview Deployments**: Use preview URLs to test changes before production
2. **Environment Branches**: Create different env vars for preview vs production
3. **Vercel CLI**: Use `vercel dev` for local development that mimics production
4. **Logs**: Always check function logs when debugging API issues
5. **Caching**: Vercel caches aggressively - clear cache if you're not seeing updates

## 📚 Additional Resources

- [Vercel Next.js Documentation](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Python Functions](https://vercel.com/docs/functions/serverless-functions/runtimes/python)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)

Happy deploying! 🚀✨


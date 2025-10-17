'use client'

import { useState, useRef, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'

/**
 * Main chat interface component
 * Provides a clean, minimal UI for interacting with the OpenAI Chat API
 */
export default function Home() {
  // State management for form inputs
  const [developerMessage, setDeveloperMessage] = useState('')
  const [userMessage, setUserMessage] = useState('')
  const [model, setModel] = useState('gpt-4.1-mini')
  
  // State for chat messages and UI status
  const [messages, setMessages] = useState<Array<{ role: string; content: string }>>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  // Ref for auto-scrolling to latest message
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  
  useEffect(() => {
    scrollToBottom()
  }, [messages])
  
  /**
   * Handles chat submission and streaming response
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validation
    if (!userMessage.trim()) {
      setError('Please enter a message')
      return
    }
    
    setError('')
    setIsLoading(true)
    
    // Add user message to chat history
    const newUserMessage = { role: 'user', content: userMessage }
    setMessages(prev => [...prev, newUserMessage])
    
    try {
      // Get API URL from environment variable, fallback to localhost for development
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      
      // Call the backend API
      const response = await fetch(`${apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer_message: developerMessage || 'You are a helpful assistant.',
          user_message: userMessage,
          model: model,
        }),
      })
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }
      
      // Handle streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      
      if (!reader) {
        throw new Error('No response body')
      }
      
      let assistantMessage = ''
      
      // Create a placeholder for the assistant's response
      setMessages(prev => [...prev, { role: 'assistant', content: '' }])
      
      // Read the stream
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value, { stream: true })
        assistantMessage += chunk
        
        // Update the last message (assistant's response) with new content
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantMessage }
          return updated
        })
      }
      
      // Clear user message input after successful send
      setUserMessage('')
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      // Remove the empty assistant message if there was an error
      setMessages(prev => prev.filter(msg => msg.content !== ''))
    } finally {
      setIsLoading(false)
    }
  }
  
  /**
   * Clears all messages from the chat history
   */
  const handleClearChat = () => {
    setMessages([])
    setError('')
  }
  
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto max-w-5xl p-4 h-screen flex flex-col">
        {/* Header with Icon */}
        <div className="mb-3 pt-3">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            <span className="text-3xl">💬</span>
            <span>OpenAI Chat Interface</span>
          </h1>
        </div>
        
        {/* Configuration Panel - Always Visible */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Model Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="gpt-4.1-nano">gpt-4.1-nano (fastest)</option>
                <option value="gpt-4.1-mini">gpt-4.1-mini (balanced)</option>
                <option value="gpt-4o-mini">gpt-4o-mini (popular)</option>
              </select>
            </div>
            
            {/* Developer Message (System Prompt) */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                System Prompt
              </label>
              <input
                type="text"
                value={developerMessage}
                onChange={(e) => setDeveloperMessage(e.target.value)}
                placeholder="You are a helpful assistant."
                className="w-full px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
          </div>
        </div>
        
        {/* Chat Messages Area - Maximized Height */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 p-4 mb-3 overflow-hidden flex flex-col min-h-0">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Conversation
            </h2>
            {messages.length > 0 && (
              <button
                onClick={handleClearChat}
                className="text-sm text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                Clear Chat
              </button>
            )}
          </div>
          
          <div className="flex-1 overflow-y-auto space-y-3 mb-3 min-h-0">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-slate-400 dark:text-slate-500">
                <p>No messages yet. Start a conversation below!</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-3 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1 opacity-75">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </p>
                    {message.role === 'user' ? (
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    ) : (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        {message.content ? (
                          <ReactMarkdown>{message.content}</ReactMarkdown>
                        ) : (
                          isLoading && index === messages.length - 1 && (
                            <span className="inline-flex items-center">
                              <span className="animate-pulse">●</span>
                              <span className="animate-pulse animation-delay-200">●</span>
                              <span className="animate-pulse animation-delay-400">●</span>
                            </span>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}
          
          {/* Message Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 disabled:opacity-50 shadow-sm"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-400 text-white font-medium rounded-lg transition-all disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <div className="text-center py-2">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Built with Next.js & FastAPI • Powered by OpenAI
          </p>
        </div>
      </div>
    </main>
  )
}


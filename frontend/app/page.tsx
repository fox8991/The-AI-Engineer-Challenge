'use client'

import { useState, useRef, useEffect } from 'react'

/**
 * Main chat interface component
 * Provides a clean, minimal UI for interacting with the OpenAI Chat API
 */
export default function Home() {
  // State management for form inputs
  const [apiKey, setApiKey] = useState('')
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
    if (!apiKey.trim()) {
      setError('Please provide an API key')
      return
    }
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
          api_key: apiKey,
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
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto max-w-5xl p-4 h-screen flex flex-col">
        {/* Header */}
        <div className="mb-6 pt-6">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2">
            OpenAI Chat Interface
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            A minimal, clean interface for chatting with OpenAI models
          </p>
        </div>
        
        {/* Configuration Panel */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">
            Configuration
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* API Key Input */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                OpenAI API Key *
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="sk-..."
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
            
            {/* Model Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Model
              </label>
              <select
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
              >
                <option value="gpt-4.1-mini">gpt-4.1-mini</option>
                <option value="gpt-4o">gpt-4o</option>
                <option value="gpt-4o-mini">gpt-4o-mini</option>
                <option value="gpt-3.5-turbo">gpt-3.5-turbo</option>
              </select>
            </div>
            
            {/* Developer Message (System Prompt) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Developer Message (System Prompt)
              </label>
              <input
                type="text"
                value={developerMessage}
                onChange={(e) => setDeveloperMessage(e.target.value)}
                placeholder="You are a helpful assistant."
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400"
              />
            </div>
          </div>
        </div>
        
        {/* Chat Messages Area */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 mb-6 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
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
          
          <div className="flex-1 overflow-y-auto space-y-4 mb-4">
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
                    <p className="whitespace-pre-wrap">{message.content}</p>
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
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="flex-1 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 placeholder-slate-400 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              {isLoading ? 'Sending...' : 'Send'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}


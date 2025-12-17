# Session Page with VAPI Voice Integration

This session page provides an interactive tutoring experience with integrated voice calling capabilities using VAPI.

## Features

### Error Handling

- **Topic Loading Errors**: Displays user-friendly error messages when topic data fails to load
- **VAPI Call Errors**: Shows call status and error messages for voice interactions
- **Retry Functionality**: Allows users to retry failed operations
- **Graceful Degradation**: Page remains functional even when voice features fail

### VAPI Voice Integration

- **Voice Calls**: Start/end voice conversations with AI tutor
- **Real-time Status**: Shows call status (starting, active, ended, errors)
- **Speech Detection**: Visual indicators for when AI is speaking or listening
- **Context-Aware**: AI tutor receives topic context for personalized teaching

### Dynamic Content

- **Topic-Specific Sessions**: Loads topic data and displays relevant information
- **Adaptive AI Messages**: Initial greeting adapts to the loaded topic
- **Loading States**: Skeleton loading for smooth user experience
- **Responsive Design**: Works on desktop and mobile devices

## VAPI Configuration

### Required Environment Variables

```env
NEXT_PUBLIC_VAPI_WEB_TOKEN=your_vapi_web_token_here
```

### VAPI Call Configuration

- **Transcriber**: Deepgram Nova-2 for speech-to-text
- **Model**: GPT-3.5-turbo with custom system prompt
- **Voice**: 11Labs voice synthesis
- **Context**: Topic-specific tutoring instructions

## Database Integration

### Topic Fetching

```sql
SELECT
  id, title, description, order_index,
  class:class_id (name),
  subject:subject_id (name)
FROM topics
WHERE id = $topicId
```

### Error Handling Flow

1. **Network Errors**: Retry with exponential backoff
2. **Data Errors**: Show user-friendly messages
3. **VAPI Errors**: Log and display status messages
4. **Recovery**: Allow users to retry or return to dashboard

## Component Structure

### State Management

- `isCallActive`: Voice call status
- `callStatus`: Current call status message
- `isRecording`: Speech detection state
- `messages`: Chat message history
- `inputMessage`: Text input value

### Event Handlers

- `handleVoiceCall()`: Start/end VAPI calls
- `handleSendMessage()`: Process text messages
- VAPI event listeners for call lifecycle

### UI States

- **Loading**: Skeleton placeholders during data fetch
- **Error**: Error cards with retry options
- **Active Call**: Voice call interface with status
- **Text Chat**: Standard messaging interface

## Usage

### Starting a Session

1. Navigate to `/auth/session/[topicId]`
2. Topic data loads automatically
3. AI greeting adapts to topic content
4. Voice call button becomes available

### Voice Interaction

1. Click "Voice Call" to start VAPI session
2. AI receives topic context and begins tutoring
3. Real-time speech detection and synthesis
4. Click "End Call" to terminate session

### Text Interaction

1. Type questions in the input field
2. Send messages for AI responses
3. Text input disabled during voice calls

## Error Scenarios

### Topic Not Found

- Displays "Topic not found" message
- Provides navigation back to dashboard

### VAPI Connection Failed

- Shows "Failed to start call" status
- Allows retry attempts
- Falls back to text-only mode

### Network Issues

- Displays connection error messages
- Provides retry functionality
- Maintains chat history

## Future Enhancements

- **Call Recording**: Save voice sessions for review
- **Progress Tracking**: Mark topics complete after sessions
- **Multi-language Support**: Expand language options
- **Advanced AI Models**: Upgrade to GPT-4 or custom models
- **Session Analytics**: Track engagement and learning outcomes</content>
  <parameter name="filePath">/home/caleb/Documents/projects/edison-team-royce-main/SESSION_PAGE_README.md

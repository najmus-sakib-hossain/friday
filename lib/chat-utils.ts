import { v4 as uuidv4 } from 'uuid';
import { Message, MessageRole } from '@/types/chat';

interface SubmitMessageOptions {
  content: string;
  role?: MessageRole;
  mediaType?: 'text' | 'image' | 'audio' | 'video';
  mediaConfig?: {
    type: 'text' | 'image' | 'audio' | 'video';
    model?: string;
    aspectRatio?: string;
    duration?: string;
    endpoint?: string;
  };
  onMessageAdded?: (message: Message) => void;
  onResponseStart?: () => void;
  onResponseChunk?: (chunk: string) => void;
  onResponseComplete?: (message: Message) => void;
  onError?: (error: Error) => void;
}

export async function submitMessage({
  content,
  role = 'user',
  mediaType = 'text',
  mediaConfig,
  onMessageAdded,
  onResponseStart,
  onResponseChunk,
  onResponseComplete,
  onError
}: SubmitMessageOptions) {
  try {
    // Create user message
    const userMessage: Message = {
      id: uuidv4(),
      content,
      role,
      timestamp: Date.now().toString(),
      type: mediaType
    };

    // Let the caller know we've added the user message
    if (onMessageAdded) {
      onMessageAdded(userMessage);
    }

    // Handle different media types
    if (mediaType === 'text') {
      // For text, use the chat API endpoint
      await handleTextMessage(content, onResponseStart, onResponseChunk, onResponseComplete);
    } else {
      // For media, use the media API endpoint
      await handleMediaMessage(
        content, 
        mediaType, 
        mediaConfig,
        onResponseStart, 
        onResponseComplete
      );
    }
  } catch (error) {
    console.error('Error submitting message:', error);
    if (onError) {
      onError(error instanceof Error ? error : new Error('Unknown error occurred'));
    }
  }
}

async function handleTextMessage(
  content: string,
  onResponseStart?: () => void,
  onResponseChunk?: (chunk: string) => void,
  onResponseComplete?: (message: Message) => void
) {
  // Prepare the conversation history for the API
  const contents = [
    {
      role: 'user',
      parts: [{ text: content }]
    }
  ];

  // Call the chat API with streaming
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      modelId: 'gemma-3-27b-it',
      contents,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Chat API error: ${text}`);
  }

  // Signal that we're starting to receive a response
  if (onResponseStart) {
    onResponseStart();
  }

  // Process the streaming response
  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('No response body reader available');
  }

  const decoder = new TextDecoder();
  let assistantMessageId = uuidv4();
  let assistantContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        try {
          const jsonString = line.substring(6); // Remove "data: "
          const data = JSON.parse(jsonString);
          if (data.text) {
            assistantContent += data.text;
            
            if (onResponseChunk) {
              onResponseChunk(data.text);
            }
          }
        } catch (e) {
          // Ignore invalid JSON
        }
      }
    }
  }

  // Complete response
  if (onResponseComplete) {
    const assistantMessage: Message = {
      id: assistantMessageId,
      content: assistantContent,
      role: 'assistant',
      timestamp: Date.now().toString(),
      type: 'text'
    };
    onResponseComplete(assistantMessage);
  }
}

async function handleMediaMessage(
  prompt: string,
  mediaType: 'image' | 'audio' | 'video',
  mediaConfig?: {
    type: 'text' | 'image' | 'audio' | 'video';
    model?: string;
    aspectRatio?: string;
    duration?: string;
    endpoint?: string;
  },
  onResponseStart?: () => void,
  onResponseComplete?: (message: Message) => void
) {
  // Signal response start
  if (onResponseStart) {
    onResponseStart();
  }

  // Call the media API
  const response = await fetch('/api/media', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      type: mediaType,
      prompt,
      aspectRatio: mediaConfig?.aspectRatio || '16:9',
      model: mediaConfig?.model,
      duration: mediaConfig?.duration || '8'
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Media API error: ${text}`);
  }

  // Parse the response
  const data = await response.json();
  
  // Complete response with media data
  if (onResponseComplete) {
    const assistantMessage: Message = {
      id: uuidv4(),
      content: `Generated ${mediaType} based on your prompt`,
      role: 'assistant',
      timestamp: Date.now().toString(),
      type: mediaType,
      mediaUrl: data.url,
      mediaData: {
        thumbnailUrl: data.thumbnailUrl,
        aspectRatio: mediaConfig?.aspectRatio || '16:9'
      }
    };
    onResponseComplete(assistantMessage);
  }
}

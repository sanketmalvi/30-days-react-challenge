import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
import { FiUser, FiCpu } from 'react-icons/fi';

export default function ChatMessage({ message, loading }) {
  const isUser = message.type === 'user';

  return (
    <div className={`flex items-start gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && <FiCpu className="mt-1 text-xl text-blue-500" />}
      {isUser && <FiUser className="mt-1 text-xl text-gray-500" />}

      <div
        className={`max-w-sm whitespace-pre-wrap px-4 py-2 rounded-xl text-sm shadow-md prose dark:prose-invert
          ${isUser ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700'}
        `}
      >
        <ReactMarkdown rehypePlugins={[rehypeHighlight]}>
          {loading ? 'Typing...' : message.text}
        </ReactMarkdown>
      </div>
    </div>
  );
}

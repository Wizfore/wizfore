'use client'

import { useState, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownPreviewProps {
  content: string
  className?: string
  maxLength?: number
}

export default function MarkdownPreview({ content, className = '', maxLength = 100 }: MarkdownPreviewProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    // 서버 사이드에서는 단순 텍스트만 표시
    const plainText = content.replace(/[#*>`\-\[\]]/g, '').trim()
    const truncated = maxLength ? plainText.substring(0, maxLength) + (plainText.length > maxLength ? '...' : '') : plainText
    return <div className={className}>{truncated}</div>
  }

  // 클라이언트에서는 마크다운 렌더링
  const truncatedContent = maxLength ? content.substring(0, maxLength) + (content.length > maxLength ? '...' : '') : content

  return (
    <div className={`prose prose-sm max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 제목 태그 크기 조정
          h1: ({ children }) => <h1 className="text-sm font-semibold mb-1">{children}</h1>,
          h2: ({ children }) => <h2 className="text-sm font-medium mb-1">{children}</h2>,
          h3: ({ children }) => <h3 className="text-sm font-medium mb-1">{children}</h3>,
          h4: ({ children }) => <h4 className="text-sm font-medium mb-1">{children}</h4>,
          h5: ({ children }) => <h5 className="text-sm font-medium mb-1">{children}</h5>,
          h6: ({ children }) => <h6 className="text-sm font-medium mb-1">{children}</h6>,
          // 문단 간격 조정
          p: ({ children }) => <p className="text-sm mb-2 leading-relaxed">{children}</p>,
          // 이미지 크기 제한
          img: ({ src, alt }) => (
            <img src={src} alt={alt} className="max-w-full h-auto max-h-20 rounded object-cover" />
          ),
          // 목록 스타일 조정
          ul: ({ children }) => <ul className="text-sm mb-2 ml-4 list-disc">{children}</ul>,
          ol: ({ children }) => <ol className="text-sm mb-2 ml-4 list-decimal">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          // 인용구 스타일 조정
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-gray-300 pl-2 italic text-gray-600 text-sm">
              {children}
            </blockquote>
          ),
          // 코드 블록 스타일 조정
          code: ({ children }) => (
            <code className="bg-gray-100 px-1 py-0.5 rounded text-xs font-mono">
              {children}
            </code>
          ),
          pre: ({ children }) => (
            <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
              {children}
            </pre>
          ),
          // 강조 텍스트
          strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          // 링크 스타일
          a: ({ href, children }) => (
            <a href={href} className="text-blue-600 hover:text-blue-800 underline text-sm" target="_blank" rel="noopener noreferrer">
              {children}
            </a>
          ),
          // 테이블 스타일
          table: ({ children }) => (
            <table className="min-w-full border-collapse text-sm">
              {children}
            </table>
          ),
          th: ({ children }) => (
            <th className="border border-gray-300 px-2 py-1 bg-gray-100 font-semibold text-left">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-300 px-2 py-1">
              {children}
            </td>
          ),
        }}
      >
        {truncatedContent}
      </ReactMarkdown>
    </div>
  )
}
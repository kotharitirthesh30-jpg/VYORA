import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Configure marked options
  marked.setOptions({
    breaks: true,
    gfm: true,
  });

  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // Pre-process code blocks to add copy functionality cleanly
  const renderFormatted = () => {
    try {
      const html = marked.parse(content) as string;
      return { __html: html };
    } catch {
      return { __html: content };
    }
  };

  return (
    <div
      className="prose prose-invert max-w-none text-[#F5F5FA] text-sm leading-relaxed
        [&>p]:mb-3 [&>p:last-child]:mb-0
        [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:mb-3
        [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:mb-3
        [&>li]:mb-1
        [&>h1]:text-xl [&>h1]:font-bold [&>h1]:text-white [&>h1]:mt-4 [&>h1]:mb-2
        [&>h2]:text-lg [&>h2]:font-semibold [&>h2]:text-white [&>h2]:mt-3 [&>h2]:mb-2
        [&>h3]:text-base [&>h3]:font-semibold [&>h3]:text-[#22D3EE] [&>h3]:mt-3 [&>h3]:mb-1.5
        [&>table]:w-full [&>table]:border-collapse [&>table]:my-3 [&>table]:text-xs
        [&>table_th]:border [&>table_th]:border-white/10 [&>table_th]:bg-[#171925] [&>table_th]:p-2 [&>table_th]:text-left [&>table_th]:text-[#22D3EE]
        [&>table_td]:border [&>table_td]:border-white/10 [&>table_td]:p-2 [&>table_td]:bg-[#10111A]/60
        [&>pre]:bg-[#10111A] [&>pre]:border [&>pre]:border-white/10 [&>pre]:rounded-lg [&>pre]:p-3 [&>pre]:my-2 [&>pre]:overflow-x-auto
        [&>code]:text-[#22D3EE] [&>code]:bg-white/5 [&>code]:px-1.5 [&>code]:py-0.5 [&>code]:rounded [&>code]:text-xs
        [&>pre>code]:bg-transparent [&>pre>code]:p-0 [&>pre>code]:text-[#F5F5FA]
        [&>blockquote]:border-l-2 [&>blockquote]:border-[#8B5CF6] [&>blockquote]:pl-3 [&>blockquote]:italic [&>blockquote]:text-[#999BAE]
        [&>a]:text-[#22D3EE] [&>a]:underline hover:[&>a]:text-[#8B5CF6]"
      dangerouslySetInnerHTML={renderFormatted()}
    />
  );
};

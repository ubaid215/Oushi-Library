"use client";

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import TextAlign from '@tiptap/extension-text-align'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'
import Highlight from '@tiptap/extension-highlight'
import {
  Bold,
  Italic,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Highlighter,
  Type
} from "lucide-react";
import { useEffect } from 'react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="editor-toolbar">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`editor-btn ${editor.isActive('bold') ? 'is-active' : ''}`}
        title="Bold"
      >
        <Bold size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`editor-btn ${editor.isActive('italic') ? 'is-active' : ''}`}
        title="Italic"
      >
        <Italic size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleStrike().run()}
        disabled={!editor.can().chain().focus().toggleStrike().run()}
        className={`editor-btn ${editor.isActive('strike') ? 'is-active' : ''}`}
        title="Strikethrough"
      >
        <Strikethrough size={16} />
      </button>
      <div className="editor-divider" />
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`editor-btn ${editor.isActive('bulletList') ? 'is-active' : ''}`}
        title="Bullet List"
      >
        <List size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`editor-btn ${editor.isActive('orderedList') ? 'is-active' : ''}`}
        title="Numbered List"
      >
        <ListOrdered size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`editor-btn ${editor.isActive('blockquote') ? 'is-active' : ''}`}
        title="Quote"
      >
        <Quote size={16} />
      </button>
      <div className="editor-divider" />
      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="editor-btn"
        title="Undo"
      >
        <Undo size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="editor-btn"
        title="Redo"
      >
        <Redo size={16} />
      </button>
      <div className="editor-divider" />
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`editor-btn ${editor.isActive({ textAlign: 'left' }) ? 'is-active' : ''}`}
        title="Align Left"
      >
        <AlignLeft size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`editor-btn ${editor.isActive({ textAlign: 'center' }) ? 'is-active' : ''}`}
        title="Align Center"
      >
        <AlignCenter size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`editor-btn ${editor.isActive({ textAlign: 'right' }) ? 'is-active' : ''}`}
        title="Align Right"
      >
        <AlignRight size={16} />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`editor-btn ${editor.isActive({ textAlign: 'justify' }) ? 'is-active' : ''}`}
        title="Justify"
      >
        <AlignJustify size={16} />
      </button>

      <div className="editor-divider" />

      <div className="editor-color-picker" title="Text Color">
        <Type size={16} className="editor-color-icon" style={{ color: editor.getAttributes('textStyle').color }} />
        <input
          type="color"
          onInput={event => editor.chain().focus().setColor((event.target as HTMLInputElement).value).run()}
          value={editor.getAttributes('textStyle').color || '#000000'}
        />
      </div>

      <div className="editor-color-picker" title="Highlight Color">
        <Highlighter size={16} className="editor-color-icon" style={{ color: editor.isActive('highlight') ? editor.getAttributes('highlight').color : 'currentColor' }} />
        <input
          type="color"
          onInput={event => editor.chain().focus().toggleHighlight({ color: (event.target as HTMLInputElement).value }).run()}
          value={editor.isActive('highlight') ? editor.getAttributes('highlight').color || '#ffff00' : '#ffff00'}
        />
      </div>
    </div>
  );
};

export function RichTextEditor({ value, onChange, minHeight = "150px" }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      TextStyle,
      Color,
      Highlight.configure({
        multicolor: true,
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base focus:outline-none max-w-none',
      },
    },
  });

  // Update editor content if value changes externally
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div className="rich-text-container">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} className="rich-text-content" style={{ minHeight }} />
      <style jsx global>{`
        .rich-text-container {
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--color-surface);
          display: flex;
          flex-direction: column;
          font-family: var(--font-body);
        }

        .rich-text-container:focus-within {
          border-color: var(--color-dusty-400);
          box-shadow: 0 0 0 3px rgba(110, 99, 158, 0.15);
        }

        .editor-toolbar {
          display: flex;
          align-items: center;
          gap: var(--space-1);
          padding: var(--space-2);
          border-bottom: 1px solid var(--color-border-subtle);
          background: var(--color-dusty-50);
          flex-wrap: wrap;
        }

        .editor-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          border: none;
          background: transparent;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--duration-fast);
        }

        .editor-btn:hover:not(:disabled) {
          background: var(--color-dusty-200);
          color: var(--color-dusty-700);
        }

        .editor-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .editor-btn.is-active {
          background: var(--color-dusty-500);
          color: white;
        }

        .editor-divider {
          width: 1px;
          height: 20px;
          background: var(--color-border);
          margin: 0 var(--space-1);
        }

        .editor-color-picker {
          position: relative;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: background var(--duration-fast);
        }

        .editor-color-picker:hover {
          background: var(--color-dusty-200);
        }

        .editor-color-icon {
          pointer-events: none;
          position: absolute;
          z-index: 1;
        }

        .editor-color-picker input[type="color"] {
          position: absolute;
          opacity: 0;
          width: 100%;
          height: 100%;
          cursor: pointer;
          border: none;
          padding: 0;
        }

        .rich-text-content {
          padding: var(--space-4);
          flex: 1;
          cursor: text;
          background: var(--color-surface);
        }

        .rich-text-content .ProseMirror {
          min-height: inherit;
          outline: none;
          font-size: var(--text-sm);
          color: var(--color-text-primary);
        }

        .rich-text-content .ProseMirror > *:first-child {
          margin-top: 0;
        }

        .rich-text-content .ProseMirror > *:last-child {
          margin-bottom: 0;
        }

        /* Typography for Editor */
        .rich-text-content .ProseMirror p {
          margin-bottom: 1em;
          line-height: 1.6;
        }
        
        .rich-text-content .ProseMirror strong {
            font-weight: 700;
        }
        
        .rich-text-content .ProseMirror em {
            font-style: italic;
        }

        .rich-text-content .ProseMirror ul {
          list-style-type: disc;
          margin-bottom: 1em;
          padding-left: 2rem;
        }
        
        .rich-text-content .ProseMirror ol {
          list-style-type: decimal;
          margin-bottom: 1em;
          padding-left: 2rem;
        }

        .rich-text-content .ProseMirror li {
          margin-bottom: 0.25em;
        }

        .rich-text-content .ProseMirror li p {
          margin-bottom: 0.25em;
        }

        .rich-text-content .ProseMirror blockquote {
          border-left: 4px solid var(--color-dusty-300);
          padding-left: 1rem;
          margin-left: 0;
          color: var(--color-text-secondary);
          font-style: italic;
          background: var(--color-dusty-50);
          padding-top: 0.5rem;
          padding-bottom: 0.5rem;
          border-radius: 0 var(--radius-md) var(--radius-md) 0;
        }
      `}</style>
    </div>
  );
}

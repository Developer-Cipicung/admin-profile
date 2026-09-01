import React, { useCallback, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
const IconSvg = ({ path, className = "w-[18px] h-[18px]" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={path} />
  </svg>
);

const Icons = {
  Bold: () => <IconSvg path="M14 12a4 4 0 0 0 0-8H6v8M15 20a4 4 0 0 0 0-8H6v8M6 4v16" />,
  Italic: () => <IconSvg path="M19 4h-9M14 20H5M15 4L9 20" />,
  Underline: () => <IconSvg path="M6 4v6a6 6 0 0 0 12 0V4M4 20h16" />,
  Heading1: () => <IconSvg path="M4 12h8M4 18V6M12 18V6M17 12h.01M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.25-4-1.25M21 12v6" />,
  Heading2: () => <IconSvg path="M4 12h8M4 18V6M12 18V6M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.25-4-1.25" />,
  List: () => <IconSvg path="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  ListOrdered: () => <IconSvg path="M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" />,
  Quote: () => <IconSvg path="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h1c0 1 0 1 0 2v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" />,
  AlignLeft: () => <IconSvg path="M21 6H3M15 12H3M17 18H3" />,
  AlignCenter: () => <IconSvg path="M21 6H3M17 12H7M19 18H5" />,
  AlignRight: () => <IconSvg path="M21 6H3M21 12H9M21 18H7" />,
  Link: () => <IconSvg path="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />,
  Image: () => <IconSvg path="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM21 15l-5-5L5 21" />,
  Undo: () => <IconSvg path="M3 7v6h6M3 13l3.35-3.35a8 8 0 1 1-1.35 6.35" />,
  Redo: () => <IconSvg path="M21 7v6h-6M21 13l-3.35-3.35a8 8 0 1 0 1.35 6.35" />
};

import { newsService } from '../../services/news.service';
import { getFullImageUrl, processHtmlForDisplay, processHtmlForSave } from '../../utils/image';

const MenuBar = ({ editor, setUploadState, onImageUploadSuccess }) => {
  if (!editor) return null;
  
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Reset input
    event.target.value = '';

    // Validate type and size (5MB)
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setUploadState({ status: 'error', message: 'Hanya file JPEG, PNG, dan WebP yang diperbolehkan.' });
      setTimeout(() => setUploadState({ status: 'idle', message: '' }), 4000);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadState({ status: 'error', message: 'Ukuran file maksimal 5MB.' });
      setTimeout(() => setUploadState({ status: 'idle', message: '' }), 4000);
      return;
    }

    setIsUploading(true);
    setUploadState({ status: 'uploading', message: 'Mengunggah gambar...' });
    
    try {
      const response = await newsService.uploadBodyImage(file);
      if (response && response.url) {
        // Insert at cursor position as block using the absolute URL for display
        const fullUrl = getFullImageUrl(response.url);
        editor.chain().focus().setImage({ src: fullUrl }).run();
        
        if (onImageUploadSuccess && response.key) {
          onImageUploadSuccess(response.key);
        }

        setUploadState({ status: 'success', message: 'Gambar berhasil ditambahkan' });
        setTimeout(() => setUploadState({ status: 'idle', message: '' }), 3000);
      }
    } catch (error) {
      console.error('Failed to upload image', error);
      setUploadState({ status: 'error', message: 'Gagal mengunggah gambar. Silakan coba lagi.' });
      setTimeout(() => setUploadState({ status: 'idle', message: '' }), 5000);
    } finally {
      setIsUploading(false);
    }
  };

  const addLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  const IconButton = ({ onClick, isActive, disabled, children, title }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-2 rounded-md transition-colors flex items-center justify-center ${
        isActive 
          ? 'bg-blue-100 text-blue-700' 
          : 'text-gray-600 hover:bg-gray-100'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );

  return (
    <div className="flex flex-wrap gap-1 p-2 bg-gray-50 border-b border-gray-200 rounded-t-md">
      <div className="flex space-x-1 border-r border-gray-300 pr-1 mr-1">
        <IconButton onClick={() => editor.chain().focus().toggleBold().run()} isActive={editor.isActive('bold')} title="Tebal (Bold)">
          <Icons.Bold />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().toggleItalic().run()} isActive={editor.isActive('italic')} title="Miring (Italic)">
          <Icons.Italic />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().toggleUnderline().run()} isActive={editor.isActive('underline')} title="Garis Bawah (Underline)">
          <Icons.Underline />
        </IconButton>
      </div>

      <div className="flex space-x-1 border-r border-gray-300 pr-1 mr-1">
        <IconButton onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} isActive={editor.isActive('heading', { level: 2 })} title="Judul Utama (H2)">
          <Icons.Heading1 />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} isActive={editor.isActive('heading', { level: 3 })} title="Sub Judul (H3)">
          <Icons.Heading2 />
        </IconButton>
      </div>

      <div className="flex space-x-1 border-r border-gray-300 pr-1 mr-1">
        <IconButton onClick={() => editor.chain().focus().setTextAlign('left').run()} isActive={editor.isActive({ textAlign: 'left' })} title="Rata Kiri">
          <Icons.AlignLeft />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().setTextAlign('center').run()} isActive={editor.isActive({ textAlign: 'center' })} title="Rata Tengah">
          <Icons.AlignCenter />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().setTextAlign('right').run()} isActive={editor.isActive({ textAlign: 'right' })} title="Rata Kanan">
          <Icons.AlignRight />
        </IconButton>
      </div>

      <div className="flex space-x-1 border-r border-gray-300 pr-1 mr-1">
        <IconButton onClick={() => editor.chain().focus().toggleBulletList().run()} isActive={editor.isActive('bulletList')} title="Daftar Bullet">
          <Icons.List />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().toggleOrderedList().run()} isActive={editor.isActive('orderedList')} title="Daftar Angka">
          <Icons.ListOrdered />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().toggleBlockquote().run()} isActive={editor.isActive('blockquote')} title="Kutipan (Blockquote)">
          <Icons.Quote />
        </IconButton>
      </div>

      <div className="flex space-x-1 border-r border-gray-300 pr-1 mr-1">
        <IconButton onClick={addLink} isActive={editor.isActive('link')} title="Sisipkan Tautan">
          <Icons.Link />
        </IconButton>
        
        <input 
          type="file" 
          accept="image/jpeg,image/png,image/webp" 
          className="hidden" 
          ref={fileInputRef}
          onChange={handleImageUpload}
        />
        <IconButton 
          onClick={() => fileInputRef.current?.click()} 
          disabled={isUploading}
          title={isUploading ? "Mengunggah..." : "Sisipkan Gambar"}
        >
          {isUploading ? (
            <span className="w-[18px] h-[18px] border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
          ) : (
            <Icons.Image />
          )}
        </IconButton>
      </div>

      <div className="flex space-x-1">
        <IconButton onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Batalkan (Undo)">
          <Icons.Undo />
        </IconButton>
        <IconButton onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Ulangi (Redo)">
          <Icons.Redo />
        </IconButton>
      </div>
    </div>
  );
};

export const RichTextEditor = React.forwardRef(({ value, onChange, disabled, onImageUploadSuccess }, ref) => {
  const [uploadState, setUploadState] = useState({ status: 'idle', message: '' });

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
      }),
      Image.configure({
        inline: false, // Make images block-level for better layout
        allowBase64: false, // Force URLs only
        HTMLAttributes: {
          class: 'rounded-md shadow-sm max-w-full h-auto mx-auto my-4 border border-gray-200',
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline hover:text-blue-800',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content: processHtmlForDisplay(value),
    editable: !disabled,
    onUpdate: ({ editor }) => {
      onChange(processHtmlForSave(editor.getHTML()));
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose-base prose-blue max-w-none focus:outline-none min-h-[400px] p-6 lg:px-8 bg-white',
      },
    },
  });

  return (
    <div className={`border rounded-md overflow-hidden bg-white flex flex-col shadow-sm transition-colors ${disabled ? 'opacity-70 bg-gray-50' : 'border-gray-300 focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500'}`}>
      <MenuBar editor={editor} setUploadState={setUploadState} onImageUploadSuccess={onImageUploadSuccess} />
      
      <div className="relative flex-grow">
        <EditorContent editor={editor} />
        
        {uploadState.status === 'uploading' && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10 backdrop-blur-[1px]">
            <div className="bg-white px-6 py-4 rounded-xl shadow-lg border border-gray-100 flex flex-col items-center">
              <span className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></span>
              <p className="text-sm font-medium text-gray-700">{uploadState.message}</p>
            </div>
          </div>
        )}
      </div>

      {uploadState.status !== 'idle' && uploadState.status !== 'uploading' && (
        <div className={`px-4 py-2.5 text-xs font-medium border-t ${
          uploadState.status === 'success' 
            ? 'bg-green-50 text-green-700 border-green-100' 
            : 'bg-red-50 text-red-700 border-red-100'
        }`}>
          {uploadState.message}
        </div>
      )}
    </div>
  );
});

RichTextEditor.displayName = 'RichTextEditor';

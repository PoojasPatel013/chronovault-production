"use client"
import { forwardRef, useEffect, useImperativeHandle } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Bold from "@tiptap/extension-bold"
import Italic from "@tiptap/extension-italic"
import Underline from "@tiptap/extension-underline"
import Heading from "@tiptap/extension-heading"
import { FaBold, FaItalic, FaUnderline, FaHeading, FaMagic } from "react-icons/fa"
import VoiceWidget from "./VoiceWidget"

const AutoFormatEditor = forwardRef(({ initialContent, onChange }, ref) => {
  const editor = useEditor({
    extensions: [StarterKit, Bold, Italic, Underline, Heading.configure({ levels: [1, 2, 3] })],
    content: initialContent || "",
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        spellCheck: "true",
      },
    },
    immediatelyRender: false, // SSR safe
  })

  useImperativeHandle(ref, () => ({ editor }))

  // Sync editor when initialContent changes (for editing existing notes)
  useEffect(() => {
    if (!editor) return
    const currentHTML = editor.getHTML()
    const targetHTML = initialContent || ""
    // Only update if content is actually different and not empty
    if (currentHTML !== targetHTML && targetHTML.trim() !== "") {
      editor.commands.setContent(targetHTML)
    }
  }, [initialContent, editor])

  if (!editor) return null

  return (
    <div className="border border-white/10 rounded-xl bg-white/5">
      <div className="flex items-center gap-2 p-2 border-b border-white/10 bg-gray-800">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1 rounded ${editor.isActive('bold') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
          title="Bold"
        >
          <FaBold size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1 rounded ${editor.isActive('italic') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
          title="Italic"
        >
          <FaItalic size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1 rounded ${editor.isActive('underline') ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
          title="Underline"
        >
          <FaUnderline size={14} />
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1 rounded ${editor.isActive('heading', { level: 1 }) ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-300'}`}
          title="Heading 1"
        >
          <FaHeading size={14} />
        </button>
        <VoiceWidget
          onResult={(transcript) => {
            editor.chain().focus().insertContent(transcript + " ").run()
          }}
        />
        <div className="ml-auto">
          <button
            onClick={() => {
              // Auto-format functionality - could implement smart formatting
              const text = editor.getText()
              // Simple auto-format: capitalize first letter of sentences
              const formatted = text.replace(/(^\w|\.\s*\w)/g, l => l.toUpperCase())
              editor.commands.setContent(formatted)
            }}
            className="p-1 rounded hover:bg-gray-700 text-purple-400"
            title="Auto Format"
          >
            <FaMagic size={14} />
          </button>
        </div>
      </div>
      <EditorContent editor={editor} className="min-h-[100px] p-2 focus:outline-none text-white" />
    </div>
  )
})

AutoFormatEditor.displayName = 'AutoFormatEditor'

export default AutoFormatEditor

import React, { useState, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Alert, AlertDescription } from "../../components/ui/alert";
import { Story } from "../../types/Story";
import { createStory } from '../../services/storyAPI';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { IconBold, IconItalic, IconList, IconListNumbers, IconH2, IconDeviceFloppy } from '@tabler/icons-react';
import { sanitizeHtml } from '../../utils/htmlSanitizer';

const CreateStory: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [storyTitle, setStoryTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const prevStoryId = location.state?.prevStoryId;
  const themeRoomId = location.state?.themeRoomId;
  const rootNode = location.state?.rootNode

  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Start writing your story here...</p>',
  });

  const processContent = (content: string): string => {
    const sanitizedContent = sanitizeHtml(content);
    return sanitizedContent.replace(/<\/p><p>/g, '</p><br><p>');
  };

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const newStory: Partial<Story> = {
        title: storyTitle,
        content: processContent(editor?.getHTML() || ''),
        type: rootNode ? 'root' : 'child',
        themeRoomId: themeRoomId,
        prev: prevStoryId ? [prevStoryId] : [],
        authorId: '66a8449eb7c52cb3dec16071',
      };
      await createStory(newStory);
      navigate(-1);
    } catch (err) {
      console.error('Error creating story:', err);
      setError('Failed to create story. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [storyTitle, editor, rootNode, themeRoomId, prevStoryId, navigate]);

  return (
    <form onSubmit={handleSubmit} className="grid min-h-screen w-full grid-cols-1 lg:grid-cols-[1fr_300px] pt-24">
      <div className="flex flex-col border-r bg-background">
        <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
          <div className="flex-1">
            <Input
              type="text"
              placeholder="Untitled"
              value={storyTitle}
              onChange={(e) => setStoryTitle(e.target.value)}
              className="h-8 w-full bg-transparent text-lg font-medium focus:outline-none sm:h-10"
            />
          </div>
          <Button type="submit" variant="ghost" size="icon" disabled={isLoading}>
            <IconDeviceFloppy className="h-5 w-5" />
            <span className="sr-only">Save</span>
          </Button>
        </header>
        <div className="flex-1 overflow-auto p-4 sm:p-6 flex flex-col">
          <div className="flex items-center space-x-2 mb-2 overflow-x-auto pb-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1 ${editor?.isActive('bold') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              <IconBold className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1 ${editor?.isActive('italic') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              <IconItalic className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1 ${editor?.isActive('heading', { level: 2 }) ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              <IconH2 className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-1 ${editor?.isActive('bulletList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              <IconList className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => editor?.chain().focus().toggleOrderedList().run()}
              className={`p-1 ${editor?.isActive('orderedList') ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
            >
              <IconListNumbers className="h-5 w-5" />
            </Button>
          </div>
          <div className="prose max-w-none flex-grow flex flex-col">
            <div className="prose dark:prose-invert max-w-none flex-grow overflow-y-auto">
              <EditorContent editor={editor} className="h-full" />
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Story'}
            </Button>
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <div className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 sm:h-16 sm:px-6">
          <h2 className="text-lg font-medium">Related</h2>
        </div>
        <div className="grid gap-4 p-4 sm:p-6">
          {/* Template cards */}
        </div>
      </div>
    </form>
  );
};

export default CreateStory;
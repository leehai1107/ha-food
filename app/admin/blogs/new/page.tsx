"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

function EditorToolbar({ editor }: { editor: Editor | null }) {  
    if (!editor) {
        return null;
    }

    return (
        <div className="border border-input bg-transparent rounded-t-md border-b-0 p-1 flex gap-1">
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? 'bg-muted' : ''}
                type="button"
            >
                <b>B</b>
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? 'bg-muted' : ''}
                type="button"
            >
                <i>I</i>
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive('strike') ? 'bg-muted' : ''}
                type="button"
            >
                <s>S</s>
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? 'bg-muted' : ''}
                type="button"
            >
                H2
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive('heading', { level: 3 }) ? 'bg-muted' : ''}
                type="button"
            >
                H3
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'bg-muted' : ''}
                type="button"
            >
                • List
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive('orderedList') ? 'bg-muted' : ''}
                type="button"
            >
                1. List
            </Button>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive('blockquote') ? 'bg-muted' : ''}
                type="button"
            >
                Quote
            </Button>
        </div>
    );
}

export default function NewBlog() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const descriptionEditor = useEditor({
        extensions: [StarterKit],
        editorProps: {
            attributes: {
                class: 'prose prose-sm min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none',
            },
        },
    });

    const contentEditor = useEditor({
        extensions: [StarterKit],
        editorProps: {
            attributes: {
                class: 'prose prose-sm min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 focus-visible:outline-none',
            },
        },
    });

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            description: descriptionEditor?.getHTML() || '',
            content: contentEditor?.getHTML() || '',
            image: formData.get("image"),
            tags: formData.get("tags"),
            author: formData.get("author"),
        };

        try {
            const res = await fetch("/api/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                throw new Error("Failed to create blog");
            }

            toast.success("Blog created successfully");
            router.push("/admin/blogs");
            router.refresh();
        } catch (error) {
            toast.error("Failed to create blog");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input name="title" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <div className="rounded-md border border-input overflow-hidden">
                            <EditorToolbar editor={descriptionEditor} />
                            <EditorContent editor={descriptionEditor} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Content</label>
                        <div className="rounded-md border border-input overflow-hidden">
                            <EditorToolbar editor={contentEditor} />
                            <EditorContent editor={contentEditor} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Image URL</label>
                        <Input name="image" type="url" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tags (comma-separated)</label>
                        <Input name="tags" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Author</label>
                        <Input name="author" required />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Blog Post"}
                        </Button>
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
} 
"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

type Blog = {
    id: string;
    title: string;
    description: string;
    content: string;
    image: string;
    tags: string;
    author: string;
};

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

export default function EditBlog({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(false);
    const resolvedParams = use(params);
    const blogId = resolvedParams.id;

    const descriptionEditor = useEditor({
        extensions: [StarterKit],
        content: blog?.description || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none dark:prose-invert',
            },
        },
    });

    const contentEditor = useEditor({
        extensions: [StarterKit],
        content: blog?.content || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-foreground focus-visible:outline-none dark:prose-invert',
            },
        },
    });

    useEffect(() => {
        if (blog?.description) {
            descriptionEditor?.commands.setContent(blog.description);
        }
    }, [blog?.description, descriptionEditor]);

    useEffect(() => {
        if (blog?.content) {
            contentEditor?.commands.setContent(blog.content);
        }
    }, [blog?.content, contentEditor]);

    useEffect(() => {
        if (!blogId) return;

        async function fetchBlog() {
            try {
                const res = await fetch(`/api/blogs/${blogId}`);
                const data = await res.json();
                setBlog(data);
            } catch (error) {
                console.error(error);
                toast.error("Failed to load blog");
            }
        }
        fetchBlog();
    }, [blogId]);

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
            const res = await fetch(`/api/blogs/${blogId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to update blog");

            toast.success("Blog updated successfully");
            router.push("/admin/blogs");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update blog");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    if (!blog) return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-48 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-32" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Blog Post</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input name="title" required defaultValue={blog.title} />
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
                        <Input name="image" type="url" required defaultValue={blog.image} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Tags (comma-separated)</label>
                        <Input name="tags" required defaultValue={blog.tags} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Author</label>
                        <Input name="author" required defaultValue={blog.author} />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Updating..." : "Update Blog Post"}
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
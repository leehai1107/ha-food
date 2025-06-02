"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function NewProject() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            title: formData.get("title"),
            description: formData.get("description"),
            image: formData.get("image"),
            link: formData.get("link"),
            technologies: formData.get("technologies"),
        };

        try {
            const res = await fetch("/api/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                router.push("/admin/projects");
                router.refresh();
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Project</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input name="title" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea name="description" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Image URL</label>
                        <Input name="image" type="url" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Project Link</label>
                        <Input name="link" type="url" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Technologies (comma-separated)</label>
                        <Input name="technologies" required />
                    </div>
                    <Button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Project"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
} 
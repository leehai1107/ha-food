"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

type Project = {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
    technologies: string;
};

export default function EditProject({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(false);
    const resolvedParams = use(params);
    const projectId = resolvedParams.id;

    useEffect(() => {
        if (!projectId) return;

        async function fetchProject() {
            try {
                const res = await fetch(`/api/projects/${projectId}`);
                const data = await res.json();
                setProject(data);
            } catch (error) {
                toast.error("Failed to load project");
                console.error(error);
            }
        }
        fetchProject();
    }, [projectId]);

    if (!project) return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Project</CardTitle>
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
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="h-10 w-24" />
                        <Skeleton className="h-10 w-24" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!projectId) return;
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
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to update project");

            toast.success("Project updated successfully");
            router.push("/admin/projects");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update project");
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Edit Project</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Title</label>
                        <Input name="title" defaultValue={project.title} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea name="description" defaultValue={project.description} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Image URL</label>
                        <Input name="image" type="url" defaultValue={project.image} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Project Link</label>
                        <Input name="link" type="url" defaultValue={project.link} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Technologies (comma-separated)</label>
                        <Input name="technologies" defaultValue={project.technologies} required />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
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
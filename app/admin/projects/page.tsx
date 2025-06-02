import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GET } from "@/app/api/projects/route";

type Project = {
    id: string;
    title: string;
    description: string;
    image: string;
    link: string;
    technologies: string;
    createdAt: Date;
    updatedAt: Date;
}

function LoadingState() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-10 w-32" />
            </div>

            <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardContent className="flex items-center justify-between p-6">
                            <div className="space-y-2">
                                <Skeleton className="h-6 w-64" />
                                <Skeleton className="h-4 w-96" />
                                <div className="flex items-center gap-2 mt-2">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-2" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Skeleton className="h-10 w-16" />
                                <Skeleton className="h-10 w-20" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

export default async function AdminProjects() {
    const response = await GET();
    const projects = (await response.json()) as Project[];

    if (!projects) return <LoadingState />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Projects</h1>
                <Button asChild>
                    <a href="/admin/projects/new">Add New Project</a>
                </Button>
            </div>

            <div className="space-y-4">
                {projects.map((project) => (
                    <Card key={project.id}>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <h3 className="font-semibold">{project.title}</h3>
                                <p className="text-sm text-muted-foreground">{project.description}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                    <a href={`/admin/projects/${project.id}/edit`}>Edit</a>
                                </Button>
                                <Button variant="destructive">Delete</Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
} 
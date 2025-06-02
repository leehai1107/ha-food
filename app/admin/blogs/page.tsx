import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

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

export default async function AdminBlogs() {
    const blogs = await prisma.blog.findMany({
        orderBy: { createdAt: "desc" },
    });

    if (!blogs) return <LoadingState />;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Manage Blogs</h1>
                <Button asChild>
                    <a href="/admin/blogs/new">Add New Blog</a>
                </Button>
            </div>

            <div className="space-y-4">
                {blogs.map((blog) => (
                    <Card key={blog.id}>
                        <CardContent className="flex items-center justify-between p-6">
                            <div>
                                <h3 className="font-semibold">{blog.title}</h3>
                                <p className="text-sm text-muted-foreground">{blog.description}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <p className="text-xs text-muted-foreground">
                                        By {blog.author}
                                    </p>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <p className="text-xs text-muted-foreground">
                                        {new Date(blog.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" asChild>
                                    <a href={`/admin/blogs/${blog.id}/edit`}>Edit</a>
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
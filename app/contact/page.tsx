import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/custom/icon"

export default function Contact() {
    return (
        <section className="w-full px-6 py-16">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Get In Touch</h1>
                    <p className="text-muted-foreground max-w-xl mx-auto">
                        Have a project in mind or just want to chat? Feel free to reach out. I&apos;ll get back to you as soon as possible.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    <div className="space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icons.mail className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Email</h3>
                                <p className="text-muted-foreground">hello@leehai.dev</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icons.mapPin className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Location</h3>
                                <p className="text-muted-foreground">Ho Chi Minh City, Vietnam</p>
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4">
                            <Button variant="outline" size="icon" asChild>
                                <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                                    <Icons.gitHub className="h-4 w-4" />
                                </a>
                            </Button>
                            <Button variant="outline" size="icon" asChild>
                                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                                    <Icons.twitter className="h-4 w-4" />
                                </a>
                            </Button>
                            <Button variant="outline" size="icon" asChild>
                                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                                    <Icons.linkedin className="h-4 w-4" />
                                </a>
                            </Button>
                        </div>
                    </div>

                    <Card>
                        <CardContent className="pt-6">
                            <form className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" htmlFor="name">Name</label>
                                        <Input id="name" placeholder="John Doe" required />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium" htmlFor="email">Email</label>
                                        <Input id="email" type="email" placeholder="john@example.com" required />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="subject">Subject</label>
                                    <Input id="subject" placeholder="Project Inquiry" required />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium" htmlFor="message">Message</label>
                                    <Textarea
                                        id="message"
                                        placeholder="Tell me about your project..."
                                        className="min-h-[150px]"
                                        required
                                    />
                                </div>
                                <Button type="submit" className="w-full">Send Message</Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </section>
    )
} 
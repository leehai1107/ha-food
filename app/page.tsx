import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Icons } from "@/components/custom/icon"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import Image from "next/image"
import { GET } from "./api/homepage/content/route"
import { HomepageContent } from "@prisma/client"

export default async function Home() {
  const response = await GET();

  const content = (await response.json()) as HomepageContent
  console.log("content data:",content.content)


  if (!content) {
    return <div>No Contents found</div>;
  }

  return (
    <>
      {/* Hero Section */}
      <section className="w-full px-6 py-24 flex flex-col items-center justify-center text-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <Badge className="mb-4" variant="secondary">Available for Projects</Badge>
        <h1 className="text-5xl font-bold mb-6">
          Hi, I&apos;m <span className="text-primary relative">
            Lee Hai
            <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/20 -z-10"></span>
          </span> 👋
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mb-8">
          A passionate full-stack developer crafting beautiful and functional web experiences.
          I specialize in React, Next.js, Go, and modern web technologies.
        </p>
        <div className="flex gap-4">
          <Button size="lg" asChild>
            <a href="/contact">
              Get in Touch
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <a href="/projects">
              View My Work
              <Icons.externalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>

      {/* Featured Section */}
      <section className="w-full px-6 py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1">
              <h2 className="text-3xl font-bold">What I Do</h2>
              <p className="text-muted-foreground mt-2">Specialized services I offer to my clients</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Web Development Card */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icons.code className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Web Development</h3>
                <p className="text-muted-foreground">
                  Building responsive and performant web applications using modern frameworks and best practices.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">React</Badge>
                  <Badge variant="secondary">Next.js</Badge>
                  <Badge variant="secondary">TypeScript</Badge>
                  <Badge variant="secondary">Go</Badge>
                  <Badge variant="secondary">Java</Badge>
                </div>
              </CardContent>
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            </Card>

            {/* UI/UX Design Card */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icons.layout className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">UI/UX Design</h3>
                <p className="text-muted-foreground">
                  Creating intuitive and beautiful user interfaces with attention to detail and user experience.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Figma</Badge>
                  <Badge variant="secondary">Tailwind</Badge>
                  <Badge variant="secondary">Design Systems</Badge>
                </div>
              </CardContent>
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            </Card>

            {/* Technical Writing Card */}
            <Card className="relative overflow-hidden">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icons.pencil className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">Technical Writing</h3>
                <p className="text-muted-foreground">
                  Sharing knowledge and experiences through detailed technical articles and documentation.
                </p>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary">Documentation</Badge>
                  <Badge variant="secondary">Tutorials</Badge>
                  <Badge variant="secondary">Blog Posts</Badge>
                </div>
              </CardContent>
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="w-full px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Projects</h2>
            <Button variant="outline" asChild>
              <a href="/projects">View All Projects</a>
            </Button>
          </div>
          {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {projects.map((project) => (
              <Card key={project.id} className="group overflow-hidden">
                <CardHeader className="p-0">
                  <div className="aspect-video relative overflow-hidden">
                    <Image
                      src={project.image || "/placeholder-project.jpg"}
                      width={100}
                      height={100}
                      alt={project.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button variant="secondary" size="sm" asChild>
                        <a href={`/projects/${project.id}`}>View Details</a>
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies?.split(',').map((tech, index) => (
                      <Badge key={index} variant="secondary">{tech.trim()}</Badge>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="px-6 pb-6 pt-0">
                  <Button variant="link" className="p-0" asChild>
                    <a href={`/projects/${project.id}`}>Learn more →</a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div> */}

          {/* Pagination */}
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </section>

      {/* Blogs Section */}
      <section className="w-full px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Featured Posts</h2>
          <div className="flex gap-8">
            {/* Featured Post */}
            <Card className="flex-1">
              <CardHeader className="p-0">
                <Image
                  src="/featured.jpg"
                  width={100}
                  height={100}
                  alt="Featured Post"
                  className="object-cover w-full h-48"
                />
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-2">How to Create Detailed Buyer Personas for Your Business</h3>
                <p className="text-muted-foreground mb-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui eligendi vitae sit.
                </p>
                <p className="text-sm text-muted-foreground">Johnson Smith in Design</p>
                <p className="text-sm text-muted-foreground">April 13, 2020 · 6 min read</p>
              </CardContent>
              <CardFooter className="px-6 pb-6 pt-0">
                <Button variant="outline" asChild>
                  <a href="/featured">All Featured Posts</a>
                </Button>
              </CardFooter>
            </Card>

            {/* Trending Posts */}
            <div className="w-1/3">
              <h3 className="text-xl font-bold mb-4">Trending</h3>
              <ul className="space-y-4">
                <li>
                  <a href="/post/1" className="flex items-center gap-4">
                    <Image src="/trending1.jpg" alt="Trending 1" className="w-16 h-16 object-cover" width={100} height={100} />
                    <div>
                      <h4 className="font-semibold">How to Identify first blog post&apos;s topic</h4>
                      <p className="text-sm text-muted-foreground">Johnson Smith in Design</p>
                      <p className="text-sm text-muted-foreground">April 13, 2020 · 6 min read</p>
                    </div>
                  </a>
                </li>
                {/* Repeat for more trending posts */}
              </ul>
            </div>
          </div>

          {/* Highlighted Article */}
          <div className="mt-16">
            <Card className="flex">
              <Image
                src="/highlighted.jpg"
                alt="Highlighted Article"
                className="w-1/3 object-cover"
                width={100}
                height={100}
              />
              <CardContent className="p-6 flex-1">
                <h3 className="text-xl font-semibold mb-2">Your Blog Posts are Boring: 9 Tips for Making your Writing more Interesting</h3>
                <p className="text-muted-foreground mb-4">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos blanditiis, odit non asperiores possimus voluptas sit nihil.
                </p>
                <p className="text-sm text-muted-foreground">Johnson Smith in Design</p>
                <p className="text-sm text-muted-foreground">April 13, 2020 · 6 min read</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full px-6 py-16 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold">What services do you offer?</h3>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  I offer web development, UI/UX design, and technical writing services.
                </p>
              </CardContent>
            </Card>
            {/* Repeat for more FAQs */}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="w-full px-6 py-24 bg-muted/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Have a project in mind or just want to chat? Feel free to reach out. I&apos;ll get back to you as soon as possible.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
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
                      <Input id="name" type="text" placeholder="John Doe" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium" htmlFor="email">Email</label>
                      <Input id="email" type="email" placeholder="john@example.com" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium" htmlFor="subject">Subject</label>
                    <Input id="subject" type="text" placeholder="Project Inquiry" required />
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
    </>
  )
}

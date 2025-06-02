import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/custom/icon";

export default function About() {
  return (
    <section className="w-full px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>About Me</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Hello! I&apos;m Lee Hai, a passionate full-stack developer with a knack for crafting beautiful and functional web experiences. I specialize in React, Next.js, Go, and modern web technologies.
            </p>
            <p className="text-muted-foreground mb-4">
              With a strong background in both front-end and back-end development, I have a comprehensive understanding of the entire web development process. I am committed to delivering high-quality solutions that meet the needs of my clients.
            </p>
            <p className="text-muted-foreground mb-4">
              In my free time, I enjoy exploring new technologies, contributing to open-source projects, and writing technical articles to share my knowledge with the community.
            </p>
            <div className="flex gap-4 mt-6">
              <Button size="lg" asChild>
                <a href="/file/LeChiHai.pdf" download>
                  Download CV
                  <Icons.arrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/contact">
                  Contact Me
                  <Icons.mail className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

import { Card, CardHeader, CardContent } from "@/components/ui/card"

const faqs = [
    {
        question: "What services do you offer?",
        answer: "I specialize in full-stack web development, UI/UX design, and technical writing. This includes custom web applications, responsive design, and comprehensive documentation."
    },
    {
        question: "What is your development process?",
        answer: "My development process involves understanding requirements, creating prototypes, iterative development with regular feedback, testing, and deployment with ongoing support."
    },
    {
        question: "What technologies do you work with?",
        answer: "I work with modern web technologies including React, Next.js, TypeScript, Node.js, Go, and various databases. I'm always learning and adapting to new technologies."
    },
    {
        question: "How long does a typical project take?",
        answer: "Project timelines vary based on complexity and requirements. A simple website might take 2-4 weeks, while a complex web application could take 2-3 months or more."
    },
    {
        question: "Do you offer maintenance and support?",
        answer: "Yes, I offer ongoing maintenance and support services to ensure your application remains up-to-date and runs smoothly."
    }
]

export default function FAQ() {
    return (
        <section className="w-full px-6 py-16">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
                    <p className="text-muted-foreground">
                        Find answers to common questions about my services and process.
                    </p>
                </div>

                <div className="space-y-6">
                    {faqs.map((faq, index) => (
                        <Card key={index}>
                            <CardHeader>
                                <h3 className="text-xl font-semibold">{faq.question}</h3>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{faq.answer}</p>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <p className="text-muted-foreground mb-4">
                        Still have questions? Feel free to reach out.
                    </p>
                    <a
                        href="/contact"
                        className="text-primary hover:text-primary/80 font-medium"
                    >
                        Contact me →
                    </a>
                </div>
            </div>
        </section>
    )
} 
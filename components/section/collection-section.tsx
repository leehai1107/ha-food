import Image from "next/image";
import ReactMarkdown from "react-markdown";
import { CollectionContent } from "@/types";  // tùy vào nơi lưu trữ
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import rehypeColor from "@/lib/plugins/rehypeColor";
import remarkColor from "@/lib/plugins/remarkColor";


export default function CollectionSection({ data }: { data: CollectionContent }) {
  const { mediaType, mediaUrl, content } = data;

  return (
    <section className = "px-4 pt-5 bg-primary-white animate-float-in-bottom">
    <div     className = "container mx-auto flex flex-col md:flex-row items-center gap-5">
        {/* Media */}
        <div className = "md:w-1/2 w-full relative aspect-video">
          {mediaType === "image" ? (
            <Image
              src = {mediaUrl}
              alt = "Collection Banner"
              fill
              priority
              className = "object-cover rounded-lg shadow-md"
            />
          ) : (
            <video
              className = "w-full h-full object-cover rounded-lg shadow-md"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src = {mediaUrl} type = "video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Markdown content */}
        <div className = "md:w-1/2 w-full space-y-4 pt-6 text-primary-black">
          <ReactMarkdown
                rehypePlugins = {[rehypeRaw, rehypeColor]}
                remarkPlugins = {[remarkGfm, remarkColor]}
            components={{
              h1: ({ children }) => (
                <h1 className = "text-3xl font-bold mb-4 font-heading">
                  {children}
                </h1>
              ),
              h2: ({ children }) => (
                <h2 className = "text-2xl font-bold mb-3 mt-6 font-heading">
                  {children}
                </h2>
              ),
              h3: ({ children }) => (
                <h3 className = "text-xl font-bold mb-2 mt-5 font-heading">
                  {children}
                </h3>
              ),
              p: ({ children }) => (
                <p className = "mb-4 leading-relaxed font-primary">
                  {children}
                </p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside mb-4 font-primary">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside mb-4 font-primary">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="mb-1 font-primary">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 mb-4 font-primary">
                  {children}
                </blockquote>
              ),
              code: ({ children }) => (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              pre: ({ children }) => (
                <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">
                  {children}
                </pre>
              ),
              a: ({ href, children }) => (
                <a
                  href={href}
                  className="text-primary hover:text-dark-yellow underline font-primary"
                >
                  {children}
                </a>
              ),
              img: ({ src, alt }) =>
                src ? (
                  <Image
                    src={src}
                    alt={alt || ""}
                    className="max-w-full h-auto rounded-lg shadow-md mb-4"
                    width={1280}
                    height={720}
                  />
                ) : null,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      </div>
    </section>
  );
}

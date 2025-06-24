"use client";

import { useEffect, useState, use } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import type { Catalogue } from "../../../types";
import Link from "next/link";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function CatalogueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pdfError, setPdfError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/catalogues/${id}`)
      .then((res) => res.json())
      .then(setCatalogue);
  }, [id]);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setPdfError(null);
  }

  function onDocumentLoadError(error: Error) {
    console.error("PDF load error:", error);
    setPdfError("Failed to load PDF. Please try again or download the file.");
  }

  if (!catalogue)
    return (
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-red-600 hover:text-red-700">
              Trang chủ
            </Link>
            <span className="text-gray-500">/</span>
            <Link
              href="/catalogues"
              className="text-red-600 hover:text-red-700"
            >
              Catalogue
            </Link>
          </nav>
        </div>
      </div>
    );

  return (
    <>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-red-600 hover:text-red-700">
              Trang chủ
            </Link>
            <span className="text-gray-500">/</span>
            <Link
              href="/catalogues"
              className="text-red-600 hover:text-red-700"
            >
              Catalogue
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900 font-medium">{catalogue.name}</span>
          </nav>
        </div>
      </div>

      {/* Header */}
      <div className="bg-primary text-white py-16">
        <div className="container-limited text-center">
          <h1 className="text-3xl md:text-4xl font-bold font-heading">
            {catalogue.name}
          </h1>
        </div>
      </div>

      {/* PDF Viewer */}
      <div className="max-w-4xl mx-auto p-4">
        {pdfError ? (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded">
            <p className="text-red-600">{pdfError}</p>
            <a
              href={catalogue.pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline mt-2 inline-block"
            >
              Download PDF instead
            </a>
          </div>
        ) : (
          <div className="mb-4 flex justify-center overflow-x-auto">
            <Document
              file={catalogue.pdfLink}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
              loading={<div>Loading PDF...</div>}
            >
              {Array.from({ length: numPages }, (_, index) => (
                <Page
                  key={`page_${index + 1}`}
                  pageNumber={index + 1}
                  width={800}
                />
              ))}
            </Document>
          </div>
        )}
      </div>
    </>
  );
}

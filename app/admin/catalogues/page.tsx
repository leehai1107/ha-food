"use client";
import { useEffect, useState } from "react";
import { fetchCatalogues, deleteCatalogue } from "../../../services/api";
import type { Catalogue } from "../../../types";
import CatalogueFormModal from "./CatalogueFormModal";
import Image from "next/image";

export default function AdminCataloguesPage() {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCatalogue, setEditingCatalogue] = useState<Catalogue | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const refresh = () => fetchCatalogues().then(setCatalogues);

  useEffect(() => {
    refresh();
  }, []);

  const handleAdd = () => {
    setEditingCatalogue(null);
    setModalOpen(true);
  };

  const handleEdit = (cat: Catalogue) => {
    setEditingCatalogue(cat);
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this catalogue?")) return;
    await deleteCatalogue(id);
    setCatalogues((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Catalogues</h1>
      <button
        onClick={handleAdd}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Add Catalogue
      </button>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Cover</th>
            <th className="p-2 border">PDF</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {catalogues.map((cat) => (
            <tr key={cat.id}>
              <td className="p-2 border">{cat.id}</td>
              <td className="p-2 border">{cat.name}</td>
              <td className="p-2 border">
                {cat.coverImage && cat.coverImage.trim() ? (
                  <Image
                    src={cat.coverImage}
                    alt="cover"
                    className="h-12"
                    width={48}
                    height={48}
                  />
                ) : (
                  <span className="text-gray-400 italic">No image</span>
                )}
              </td>
              <td className="p-2 border">
                <a
                  href={cat.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  View PDF
                </a>
              </td>
              <td className="p-2 border">
                <button
                  onClick={() => handleEdit(cat)}
                  className="px-2 py-1 border rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="px-2 py-1 border rounded text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {modalOpen && (
        <CatalogueFormModal
          catalogue={editingCatalogue}
          onClose={() => setModalOpen(false)}
          onSubmit={refresh}
        />
      )}
    </div>
  );
}

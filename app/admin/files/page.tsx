"use client";
import React, { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, FolderPlus } from "lucide-react";
import Image from "next/image";

const API_URL = "/api/admin/files";
const FOLDER_API = "/api/admin/files/folder";
const UPLOADS_URL = "/uploads";

type FileNode = {
  name: string;
  type: "file";
  url: string;
  size: number;
  path: string;
};

type FolderNode = {
  name: string;
  type: "folder";
  url: string;
  path: string;
  children: TreeNode[];
};

type TreeNode = FileNode | FolderNode;

function walkTreeWithPath(files: any[], parent = ""): TreeNode[] {
  return files.map((file): TreeNode => {
    const fullPath = `${parent}${file.name}`;
    if (file.type === "folder") {
      return {
        ...file,
        path: fullPath + "/",
        children: walkTreeWithPath(file.children || [], fullPath + "/"),
      };
    }
    return {
      ...file,
      path: fullPath,
    };
  });
}

export default function AdminFilesPage() {
  const [fileTree, setFileTree] = useState<TreeNode[]>([]);
  const [filteredTree, setFilteredTree] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [search, setSearch] = useState("");
  const [targetFolder, setTargetFolder] = useState("");
  const [newFolderName, setNewFolderName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchFiles = async () => {
    setLoading(true);
    const res = await fetch(API_URL);
    const data = await res.json();
    const tree = walkTreeWithPath(data.data || []);
    setFileTree(tree);
    setFilteredTree(tree);
    setLoading(false);
  };

  const getAllFolders = (nodes: TreeNode[], list: string[] = []) => {
    for (const node of nodes) {
      if (node.type === "folder") {
        list.push(node.path);
        getAllFolders(node.children, list);
      }
    }
    return list;
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredTree(fileTree);
    } else {
      const lowerSearch = search.toLowerCase();
      const filterRecursive = (nodes: TreeNode[]): TreeNode[] => {
        return nodes
          .map((node) => {
            if (node.type === "folder") {
              const children = filterRecursive(node.children || []);
              if (
                node.name.toLowerCase().includes(lowerSearch) ||
                children.length > 0
              ) {
                return { ...node, children };
              }
              return null;
            } else if (node.name.toLowerCase().includes(lowerSearch)) {
              return node;
            }
            return null;
          })
          .filter(Boolean) as TreeNode[];
      };
      setFilteredTree(filterRecursive(fileTree));
    }
  }, [search, fileTree]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFiles) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("folder", targetFolder);
    Array.from(selectedFiles).forEach((file) => formData.append("file", file));
    const res = await fetch(API_URL, { method: "POST", body: formData });
    setUploading(false);
    setSelectedFiles(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (res.ok) fetchFiles();
    else alert("Upload failed");
  };

  const handleDelete = async (filePath: string) => {
    if (!window.confirm(`Are you sure you want to delete "${filePath}"?`))
      return;
    setLoading(true);
    const res = await fetch(`${API_URL}?file=${encodeURIComponent(filePath)}`, {
      method: "DELETE",
    });
    setLoading(false);
    if (res.ok) fetchFiles();
    else alert("Delete failed");
  };

  const handleDeleteFolder = async (folderPath: string) => {
    const confirm = window.confirm(`Delete folder "${folderPath}"?`);
    if (!confirm) return;

    setLoading(true);
    const res = await fetch(
      `/api/admin/files/folder?name=${encodeURIComponent(folderPath)}`,
      {
        method: "DELETE",
      }
    );
    setLoading(false);

    if (res.ok) {
      fetchFiles();
    } else {
      const data = await res.json();
      alert("Delete folder failed: " + data.error);
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    const res = await fetch(FOLDER_API, {
      method: "POST",
      body: JSON.stringify({ name: newFolderName.trim() }),
      headers: { "Content-Type": "application/json" },
    });
    setNewFolderName("");
    if (res.ok) fetchFiles();
    else alert("Failed to create folder");
  };

  const handleCopy = (url: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const shareUrl = `${baseUrl}${url}`;
    navigator.clipboard.writeText(shareUrl);
    alert("Link copied: " + shareUrl);
  };

  const renderFiles = (nodes: TreeNode[]) =>
    nodes.map((node) => {
      if (node.type === "folder") {
        return (
          <details key={node.path} className="mb-2">
            <summary className="cursor-pointer font-semibold flex items-center justify-between">
              <span>📁 {node.name}</span>
              <button
                onClick={() => handleDeleteFolder(node.path)}
                className="ml-2 text-red-600 text-xs hover:underline"
              >
                🗑 Delete
              </button>
            </summary>
            <div className="ml-4 mt-2">{renderFiles(node.children)}</div>
          </details>
        );
      }
      return (
        <div
          key={node.path}
          className="flex items-center justify-between p-2 border rounded mb-1"
        >
          <div className="flex items-center gap-2">
            {node.url.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
              <Image
                src={node.url}
                alt={node.name}
                width={32}
                height={32}
                className="object-cover rounded"
              />
            ) : (
              <span>📄</span>
            )}
            <span className="text-sm">{node.name}</span>
          </div>
          <div className="text-sm text-gray-500">
            {(node.size / 1024).toFixed(1)} KB
          </div>
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => handleCopy(node.url)}
              className="text-blue-600 text-sm"
            >
              Copy Link
            </button>
            <button
              onClick={() => handleDelete(node.path)}
              className="text-red-600 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      );
    });

  const folderOptions = ["", ...getAllFolders(fileTree)];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">📁 File Manager</h1>

      <form onSubmit={handleUpload} className="mb-4 space-y-2">
        <input
          type="file"
          multiple
          ref={fileInputRef}
          onChange={(e) => setSelectedFiles(e.target.files)}
        />
        <select
          value={targetFolder}
          onChange={(e) => setTargetFolder(e.target.value)}
          className="border px-2 py-1 rounded"
        >
          <option value="">/ (root)</option>
          {folderOptions.map((f) => (
            <option key={f} value={f}>
              /{f}
            </option>
          ))}
        </select>
        <Button
          type="submit"
          disabled={uploading}
          className="gap-2 text-primary-white"
        >
          {uploading ? (
            <>Uploading…</>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" />
              Upload
            </>
          )}
        </Button>
      </form>

      <form onSubmit={handleCreateFolder} className="mb-4 space-x-2">
        <input
          type="text"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          placeholder="New folder name"
          className="border px-2 py-1 rounded"
        />
        <Button variant="secondary" type="submit" className="gap-2">
          <FolderPlus className="h-4 w-4" />
          Create Folder
        </Button>
      </form>

      <input
        type="text"
        placeholder="Search files or folders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 w-full border px-3 py-1 rounded"
      />

      {loading ? (
        <div>Loading...</div>
      ) : filteredTree.length > 0 ? (
        <div>{renderFiles(filteredTree)}</div>
      ) : (
        <div className="text-gray-500">No files found.</div>
      )}
    </div>
  );
}

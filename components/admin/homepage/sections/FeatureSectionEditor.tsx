"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";

interface Client {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
  position: number;
  isActive: boolean;
}

interface FeatureSectionEditorProps {
  data?: {
    clients: Client[];
  };
  onChange: (data: { clients: Client[] }) => void;
}

export default function FeatureSectionEditor({
  data,
  onChange,
}: FeatureSectionEditorProps) {
  const clients = data?.clients || [];

  const addClient = () => {
    const newClient: Client = {
      id: Date.now(),
      name: "Tên khách hàng mới",
      logoUrl: "",
      websiteUrl: "",
      description: "Mô tả khách hàng",
      position: clients.length,
      isActive: true,
    };
    onChange({ clients: [...clients, newClient] });
  };

  const updateClient = (index: number, field: keyof Client, value: any) => {
    const updatedClients = [...clients];
    updatedClients[index] = { ...updatedClients[index], [field]: value };
    onChange({ clients: updatedClients });
  };

  const removeClient = (index: number) => {
    const updatedClients = clients.filter((_, i) => i !== index);
    onChange({ clients: updatedClients });
  };

  const moveClient = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === clients.length - 1) return;

    const updatedClients = [...clients];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    [updatedClients[index], updatedClients[newIndex]] = [
      updatedClients[newIndex],
      updatedClients[index],
    ];

    // Update positions
    updatedClients.forEach((client, i) => {
      client.position = i;
    });

    onChange({ clients: updatedClients });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Feature Section - Khách hàng tiêu biểu</CardTitle>
        <CardDescription>
          Quản lý danh sách khách hàng tiêu biểu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {clients.map((client, index) => (
          <Card key={client.id} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">
                  Khách hàng {index + 1}
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveClient(index, "up")}
                    disabled={index === 0}
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveClient(index, "down")}
                    disabled={index === clients.length - 1}
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeClient(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tên khách hàng</Label>
                  <Input
                    value={client.name}
                    onChange={(e) =>
                      updateClient(index, "name", e.target.value)
                    }
                    placeholder="Tên khách hàng"
                  />
                </div>

                <div className="space-y-2">
                  <Label>URL logo</Label>
                  <Input
                    value={client.logoUrl}
                    onChange={(e) =>
                      updateClient(index, "logoUrl", e.target.value)
                    }
                    placeholder="URL logo khách hàng"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Website</Label>
                <Input
                  value={client.websiteUrl}
                  onChange={(e) =>
                    updateClient(index, "websiteUrl", e.target.value)
                  }
                  placeholder="URL website khách hàng"
                />
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Input
                  value={client.description}
                  onChange={(e) =>
                    updateClient(index, "description", e.target.value)
                  }
                  placeholder="Mô tả khách hàng"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`active-${client.id}`}
                  checked={client.isActive}
                  onChange={(e) =>
                    updateClient(index, "isActive", e.target.checked)
                  }
                  className="rounded"
                />
                <Label htmlFor={`active-${client.id}`}>Hiển thị</Label>
              </div>

              {/* Preview */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium">Xem trước:</Label>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    <strong>Tên:</strong> {client.name}
                  </p>
                  <p>
                    <strong>Logo:</strong> {client.logoUrl || "Chưa có"}
                  </p>
                  <p>
                    <strong>Website:</strong> {client.websiteUrl || "Chưa có"}
                  </p>
                  <p>
                    <strong>Mô tả:</strong> {client.description}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    {client.isActive ? "Hiển thị" : "Ẩn"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addClient} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Thêm khách hàng mới
        </Button>
      </CardContent>
    </Card>
  );
}

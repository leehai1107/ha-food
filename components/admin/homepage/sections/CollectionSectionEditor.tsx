"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CollectionContent } from "@/types";
import MDEditor from "@uiw/react-md-editor";

interface CollectionSectionEditorProps {
  data?: CollectionContent;
  onChange: (data: CollectionContent) => void;
}

export default function CollectionSectionEditor({
  data,
  onChange,
}: CollectionSectionEditorProps) {
  const collection = data || {
    id: 1,
    mediaType: "image",
    mediaUrl: "",
    content: "",
  };

  const updateField = (field: keyof CollectionContent, value: any) => {
    onChange({ ...collection, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Collection Section</CardTitle>
        <CardDescription>Chỉnh sửa nội dung section collection</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Loại media</Label>
            <Select
              value={collection.mediaType}
              onValueChange={(value) => updateField("mediaType", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="image">Hình ảnh</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>URL media</Label>
            <Input
              value={collection.mediaUrl}
              onChange={(e) => updateField("mediaUrl", e.target.value)}
              placeholder="URL hình ảnh hoặc video"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Nội dung (Markdown)</Label>
          <MDEditor
            value       = {collection.content}
            onChange    = {(content) => updateField("content", content || "")}
            height      = {400}
            preview     = "edit"
            hideToolbar = {false}
            data-color-mode="light"
          />
          <p className="text-sm text-gray-500">
            Hỗ trợ Markdown với các plugin màu sắc. Ví dụ: [color=#B0041A]Văn
            bản màu đỏ[/color]
          </p>
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium">Xem trước:</Label>
          <div className="mt-2 text-sm text-gray-600">
            <p>
              <strong>Media:</strong> {collection.mediaType} -{" "}
              {collection.mediaUrl}
            </p>
            <p>
              <strong>Nội dung:</strong>
            </p>
            <div className="mt-2 p-3 bg-white rounded border text-xs max-h-32 overflow-y-auto">
              {collection.content || "Chưa có nội dung"}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

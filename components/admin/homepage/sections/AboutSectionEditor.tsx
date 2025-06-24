import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AboutSectionEditorProps {
  data?: {
    imageUrl: string;
    imageUrlMd: string;
    imageUrlLg: string;
  };
  onChange: (data: {
    imageUrl: string;
    imageUrlMd: string;
    imageUrlLg: string;
  }) => void;
}

export default function AboutSectionEditor({
  data,
  onChange,
}: AboutSectionEditorProps) {
  const about = data || {
    imageUrl: "",
    imageUrlMd: "",
    imageUrlLg: "",
  };

  const updateField = (field: keyof typeof about, value: string) => {
    onChange({ ...about, [field]: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>About Section</CardTitle>
        <CardDescription>
          Chỉnh sửa hình ảnh cho section giới thiệu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Hình ảnh Mobile (Small)</Label>
            <Input
              value={about.imageUrl}
              onChange={(e) => updateField("imageUrl", e.target.value)}
              placeholder="URL hình ảnh cho mobile"
            />
          </div>

          <div className="space-y-2">
            <Label>Hình ảnh Tablet (Medium)</Label>
            <Input
              value={about.imageUrlMd}
              onChange={(e) => updateField("imageUrlMd", e.target.value)}
              placeholder="URL hình ảnh cho tablet"
            />
          </div>

          <div className="space-y-2">
            <Label>Hình ảnh Desktop (Large)</Label>
            <Input
              value={about.imageUrlLg}
              onChange={(e) => updateField("imageUrlLg", e.target.value)}
              placeholder="URL hình ảnh cho desktop"
            />
          </div>
        </div>

        {/* Preview */}
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium">Xem trước:</Label>
          <div className="mt-2 text-sm text-gray-600 space-y-1">
            <p>
              <strong>Mobile:</strong> {about.imageUrl || "Chưa có"}
            </p>
            <p>
              <strong>Tablet:</strong> {about.imageUrlMd || "Chưa có"}
            </p>
            <p>
              <strong>Desktop:</strong> {about.imageUrlLg || "Chưa có"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

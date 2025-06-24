import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { Testimonial } from "@/types";

interface TestimonialSectionEditorProps {
  data?: {
    items: Testimonial[];
  };
  onChange: (data: { items: Testimonial[] }) => void;
}

export default function TestimonialSectionEditor({
  data,
  onChange,
}: TestimonialSectionEditorProps) {
  const testimonials = data?.items || [];

  const addTestimonial = () => {
    const newTestimonial: Testimonial = {
      id: Date.now(),
      name: "Tên khách hàng mới",
      location: "Vị trí công việc",
      type: "",
      content: "Nội dung đánh giá...",
      avatarUrl: "",
      rating: 5,
      position: testimonials.length,
      isActive: true,
    };
    onChange({ items: [...testimonials, newTestimonial] });
  };

  const updateTestimonial = (
    index: number,
    field: keyof Testimonial,
    value: any
  ) => {
    const updatedTestimonials = [...testimonials];
    updatedTestimonials[index] = {
      ...updatedTestimonials[index],
      [field]: value,
    };
    onChange({ items: updatedTestimonials });
  };

  const removeTestimonial = (index: number) => {
    const updatedTestimonials = testimonials.filter((_, i) => i !== index);
    onChange({ items: updatedTestimonials });
  };

  const moveTestimonial = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === testimonials.length - 1) return;

    const updatedTestimonials = [...testimonials];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    [updatedTestimonials[index], updatedTestimonials[newIndex]] = [
      updatedTestimonials[newIndex],
      updatedTestimonials[index],
    ];

    // Update positions
    updatedTestimonials.forEach((testimonial, i) => {
      testimonial.position = i;
    });

    onChange({ items: updatedTestimonials });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Testimonial Section - Đánh giá khách hàng</CardTitle>
        <CardDescription>Quản lý các đánh giá từ khách hàng</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {testimonials.map((testimonial, index) => (
          <Card key={testimonial.id} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Đánh giá {index + 1}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveTestimonial(index, "up")}
                    disabled={index === 0}
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveTestimonial(index, "down")}
                    disabled={index === testimonials.length - 1}
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeTestimonial(index)}
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
                    value={testimonial.name}
                    onChange={(e) =>
                      updateTestimonial(index, "name", e.target.value)
                    }
                    placeholder="Tên khách hàng"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Vị trí công việc</Label>
                  <Input
                    value={testimonial.location}
                    onChange={(e) =>
                      updateTestimonial(index, "location", e.target.value)
                    }
                    placeholder="Vị trí công việc"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>URL avatar</Label>
                <Input
                  value={testimonial.avatarUrl || ""}
                  onChange={(e) =>
                    updateTestimonial(index, "avatarUrl", e.target.value)
                  }
                  placeholder="URL ảnh đại diện"
                />
              </div>

              <div className="space-y-2">
                <Label>Đánh giá (1-5 sao)</Label>
                <Input
                  type="number"
                  min="1"
                  max="5"
                  value={testimonial.rating}
                  onChange={(e) =>
                    updateTestimonial(index, "rating", parseInt(e.target.value))
                  }
                  placeholder="Số sao đánh giá"
                />
              </div>

              <div className="space-y-2">
                <Label>Nội dung đánh giá</Label>
                <Textarea
                  value={testimonial.content}
                  onChange={(e) =>
                    updateTestimonial(index, "content", e.target.value)
                  }
                  placeholder="Nội dung đánh giá từ khách hàng..."
                  rows={4}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`active-testimonial-${testimonial.id}`}
                  checked={testimonial.isActive}
                  onChange={(e) =>
                    updateTestimonial(index, "isActive", e.target.checked)
                  }
                  className="rounded"
                />
                <Label htmlFor={`active-testimonial-${testimonial.id}`}>
                  Hiển thị
                </Label>
              </div>

              {/* Preview */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium">Xem trước:</Label>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    <strong>Tên:</strong> {testimonial.name}
                  </p>
                  <p>
                    <strong>Vị trí:</strong> {testimonial.location}
                  </p>
                  <p>
                    <strong>Avatar:</strong>{" "}
                    {testimonial.avatarUrl || "Chưa có"}
                  </p>
                  <p>
                    <strong>Đánh giá:</strong> {"⭐".repeat(testimonial.rating)}
                  </p>
                  <p>
                    <strong>Nội dung:</strong> {testimonial.content}
                  </p>
                  <p>
                    <strong>Trạng thái:</strong>{" "}
                    {testimonial.isActive ? "Hiển thị" : "Ẩn"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addTestimonial} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Thêm đánh giá mới
        </Button>
      </CardContent>
    </Card>
  );
}

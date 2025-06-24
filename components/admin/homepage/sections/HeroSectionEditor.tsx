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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, MoveUp, MoveDown } from "lucide-react";
import { HeroSlide } from "@/types";

interface HeroSectionEditorProps {
  data?: {
    slides: HeroSlide[];
  };
  onChange: (data: { slides: HeroSlide[] }) => void;
}

export default function HeroSectionEditor({
  data,
  onChange,
}: HeroSectionEditorProps) {
  const slides = data?.slides || [];

  const addSlide = () => {
    const newSlide: HeroSlide = {
      id: Date.now(),
      title: "Tiêu đề mới",
      subtitle: "Mô tả mới",
      ctaText: "Xem thêm",
      ctaLink: "/products",
      imageUrl: "",
      type: "image",
      position: slides.length,
    };
    onChange({ slides: [...slides, newSlide] });
  };

  const updateSlide = (index: number, field: keyof HeroSlide, value: any) => {
    const updatedSlides = [...slides];
    updatedSlides[index] = { ...updatedSlides[index], [field]: value };
    onChange({ slides: updatedSlides });
  };

  const removeSlide = (index: number) => {
    const updatedSlides = slides.filter((_, i) => i !== index);
    onChange({ slides: updatedSlides });
  };

  const moveSlide = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === slides.length - 1) return;

    const updatedSlides = [...slides];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    [updatedSlides[index], updatedSlides[newIndex]] = [
      updatedSlides[newIndex],
      updatedSlides[index],
    ];

    // Update positions
    updatedSlides.forEach((slide, i) => {
      slide.position = i;
    });

    onChange({ slides: updatedSlides });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hero Section - Slides</CardTitle>
        <CardDescription>Quản lý các slide trong hero section</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {slides.map((slide, index) => (
          <Card key={slide.id} className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Slide {index + 1}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSlide(index, "up")}
                    disabled={index === 0}
                  >
                    <MoveUp className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => moveSlide(index, "down")}
                    disabled={index === slides.length - 1}
                  >
                    <MoveDown className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSlide(index)}
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
                  <Label>Tiêu đề</Label>
                  <Input
                    value={slide.title}
                    onChange={(e) =>
                      updateSlide(index, "title", e.target.value)
                    }
                    placeholder="Nhập tiêu đề slide"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Loại media</Label>
                  <Select
                    value={slide.type}
                    onValueChange={(value) => updateSlide(index, "type", value)}
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
              </div>

              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={slide.subtitle}
                  onChange={(e) =>
                    updateSlide(index, "subtitle", e.target.value)
                  }
                  placeholder="Nhập mô tả slide"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL media</Label>
                  <Input
                    value={
                      slide.type === "image"
                        ? slide.imageUrl || ""
                        : slide.videoUrl || ""
                    }
                    onChange={(e) => {
                      if (slide.type === "image") {
                        updateSlide(index, "imageUrl", e.target.value);
                      } else {
                        updateSlide(index, "videoUrl", e.target.value);
                      }
                    }}
                    placeholder={
                      slide.type === "image" ? "URL hình ảnh" : "URL video"
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Text CTA</Label>
                  <Input
                    value={slide.ctaText}
                    onChange={(e) =>
                      updateSlide(index, "ctaText", e.target.value)
                    }
                    placeholder="Text nút CTA"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Link CTA</Label>
                <Input
                  value={slide.ctaLink}
                  onChange={(e) =>
                    updateSlide(index, "ctaLink", e.target.value)
                  }
                  placeholder="URL khi click CTA"
                />
              </div>

              {/* Preview */}
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <Label className="text-sm font-medium">Xem trước:</Label>
                <div className="mt-2 text-sm text-gray-600">
                  <p>
                    <strong>Tiêu đề:</strong> {slide.title}
                  </p>
                  <p>
                    <strong>Mô tả:</strong> {slide.subtitle}
                  </p>
                  <p>
                    <strong>Media:</strong>{" "}
                    {slide.type === "image" ? slide.imageUrl : slide.videoUrl}
                  </p>
                  <p>
                    <strong>CTA:</strong> {slide.ctaText} → {slide.ctaLink}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={addSlide} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Thêm slide mới
        </Button>
      </CardContent>
    </Card>
  );
}

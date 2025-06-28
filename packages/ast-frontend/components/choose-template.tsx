"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Crown, Code, Palette } from "lucide-react";
import Image from "next/image";

interface StepTwoProps {
  formData: {
    selectedTemplate: number | null;
  };
  updateFormData: (
    data: Partial<{
      resume: File | null;
      selectedTemplate: number | null;
      jobDescription: string;
      jobTitle: string;
      company: string;
    }>,
  ) => void;
  onNext: () => void;
  onPrev: () => void;
}

const templates = [
  {
    id: 1,
    name: "Executive",
    description: "Sophisticated design for C-level positions",
    preview: "/template",
    icon: Crown,
    popular: true,
  },
  {
    id: 2,
    name: "Creative",
    description: "Modern design for creative roles",
    preview: "/template2",
    icon: Palette,
    popular: false,
  },
  {
    id: 3,
    name: "Technical",
    description: "Clean layout for developers & engineers",
    preview: "/template3",
    icon: Code,
    popular: true,
  },
];

export const ChooseTemplate = ({
  formData,
  updateFormData,
  onNext,
  onPrev,
}: StepTwoProps) => {
  const selectTemplate = (templateId: number) => {
    updateFormData({ selectedTemplate: templateId });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-white mb-4">
          Choose Your Template
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Select a professional template that matches your industry and career
          level
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-12">
        {templates.map((template) => {
          const TemplateIcon = template.icon;
          const isSelected = formData.selectedTemplate === template.id;

          return (
            <Card
              key={template.id}
              className={`
                group cursor-pointer transition-all duration-300 transform hover:scale-105 relative overflow-hidden
                ${
                  isSelected
                    ? "ring-2 ring-purple-500 shadow-2xl shadow-purple-500/25 bg-gray-800/80 border-purple-500/50"
                    : "hover:shadow-xl hover:shadow-black/20 bg-gray-900/50 border-gray-700 hover:border-purple-500/30"
                }
              `}
              onClick={() => selectTemplate(template.id)}
            >
              {template.popular && (
                <div className="absolute top-3 right-3 z-20">
                  <div className="px-2 py-1 rounded-full bg-purple-600 text-white text-xs font-semibold">
                    Popular
                  </div>
                </div>
              )}

              <CardContent className="p-0">
                <div className="relative">
                  <div className="aspect-[4/5] bg-gray-800 relative overflow-hidden">
                    <Image
                      src={template.preview || "/placeholder.svg"}
                      alt={template.name}
                      width={1000}
                      height={1000}
                      className="w-full h-full object-cover opacity-80"
                    />
                    {isSelected && (
                      <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center shadow-lg">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center">
                        <TemplateIcon className="w-4 h-4 text-white" />
                      </div>
                      <h3 className="font-bold text-white text-lg">
                        {template.name}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Selected Template Confirmation */}
      {formData.selectedTemplate && (
        <Card className="mb-8 bg-gray-900/50 border-purple-500/20">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center">
                <Check className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-white font-semibold text-lg">
                  {
                    templates.find((t) => t.id === formData.selectedTemplate)
                      ?.name
                  }{" "}
                  Template Selected
                </h4>
                <p className="text-gray-400">
                  Perfect choice! This template will make your resume stand out.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between max-w-md mx-auto">
        <Button
          variant="outline"
          onClick={onPrev}
          className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700 px-8 py-3 rounded-xl"
        >
          Back
        </Button>
        <Button
          onClick={onNext}
          disabled={!formData.selectedTemplate}
          className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-purple-600/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Job Info
        </Button>
      </div>
    </div>
  );
};

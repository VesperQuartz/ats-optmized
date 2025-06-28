import { AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorDisplayProps {
  error: string;
}

export const ErrorDisplay = ({ error }: ErrorDisplayProps) => {
  return (
    <Card className="bg-red-900/20 border-red-500/50 mb-6">
      <CardContent className="p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="text-red-400" size={20} />
          <span className="text-red-300">{error}</span>
        </div>
      </CardContent>
    </Card>
  );
};

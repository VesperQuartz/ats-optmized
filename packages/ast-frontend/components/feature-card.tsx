import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  delay: string;
}

export const FeatureCard = ({
  icon,
  title,
  description,
  delay,
}: FeatureCardProps) => {
  console.log("I am here");
  return (
    <div
      className={`bg-arcade-terminal border border-arcade-purple rounded-xl p-6 flex flex-col items-center text-center animate-slide-up ${delay}`}
    >
      <div className="w-12 h-12 flex items-center justify-center text-arcade-purple mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 text-white">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  );
};

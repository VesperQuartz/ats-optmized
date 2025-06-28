"use client";
import React from "react";
import { useRouter } from "next/navigation";

const Terminal = () => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const navigate = useRouter();

  const commands = [
    "$ upload resume.pdf",
    "$ extract-text --format=structured",
    "$ optimize --job='Software Engineer' --company='Google'",
    "$ generate-latex --ats-optimized",
    "$ compile-pdf --download-ready",
    "$ success: optimized-resume.pdf ready!",
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % commands.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [commands.length]);

  const handleTerminalClick = () => {
    navigate.push("/resume-optimizer");
  };

  return (
    <div
      className="terminal bg-arcade-terminal border border-gray-800 rounded-lg p-6 max-w-2xl mx-auto mb-12 cursor-pointer hover:border-arcade-purple transition-colors"
      onClick={handleTerminalClick}
    >
      <div className="terminal-header mb-4">
        <div className="terminal-button close-button"></div>
        <div className="terminal-button minimize-button"></div>
        <div className="terminal-button maximize-button"></div>
        <span className="text-gray-400 text-sm ml-4">resume-optimizer.sh</span>
      </div>

      <div className="font-mono text-sm">
        {commands.slice(0, currentIndex + 1).map((command, index) => (
          <div key={index} className="mb-2">
            <span className="text-green-400">{command}</span>
            {index === currentIndex && <span className="cursor"></span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terminal;

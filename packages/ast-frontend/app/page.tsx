"use client";
import Header from "@/components/navbar";
import Terminal from "@/components/terminal";
import { FeatureCard } from "@/components/feature-card";
import { FileText, Zap, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import Link from "next/link";

const HomePage = () => {
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col overflow-hidden bg-arcade-dark">
      <div className="flex-1 container mx-auto px-4 py-8 max-w-6xl">
        <Header />
        <div
          className={`mt-16 mb-12 text-center transition-opacity duration-700 ${loaded ? "opacity-100" : "opacity-0"}`}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="gradient-text">Optimize Your Resume for ATS</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
            Upload your resume, enter job details, and get an AI-optimized
            version that passes ATS filters and lands you interviews.
          </p>
          <Button
            asChild
            className="bg-arcade-purple hover:bg-arcade-purple/90 text-white px-8 py-3 text-lg font-medium rounded-lg"
          >
            <div>
              <FileText className="mr-2" size={20} />
              <Link href={"/resume-optimizer"}>Get Started</Link>
            </div>
          </Button>
        </div>

        <Terminal />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-16 mb-16">
          <FeatureCard
            icon={<FileText size={28} />}
            title="Upload & Extract"
            description="Simply upload your current resume and we'll extract the text automatically"
            delay="delay-100"
          />

          <FeatureCard
            icon={<Target size={28} />}
            title="Job-Specific Optimization"
            description="Enter job details and get a resume tailored specifically for that position"
            delay="delay-300"
          />

          <FeatureCard
            icon={<Zap size={28} />}
            title="ATS-Ready Output"
            description="Download a professionally formatted resume that passes ATS systems"
            delay="delay-500"
          />
        </div>
      </div>

      <footer className="py-6 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>© 2025 Resume Optimizer. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;

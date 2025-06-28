import { Button } from "@/components/ui/button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 rounded bg-arcade-purple flex items-center justify-center">
          <span className="text-white font-bold text-sm">RO</span>
        </div>
        <span className="text-white font-semibold text-lg">
          Resume Optimizer
        </span>
      </div>

      <Button
        asChild
        className="bg-arcade-purple hover:bg-arcade-purple/90 text-white"
      >
        <Link href={"/resume-optimizer"}>Optimize Resume</Link>
      </Button>
    </header>
  );
};

export default Header;

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LandingNav() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="relative z-50 border-b-4 border-black bg-[#FFFAF0] px-4 py-4 md:px-6">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <div className="rounded-md border-4 border-black bg-[#FF90E8] p-1 text-xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            GV
          </div>
          <span className="text-xl font-black">Genvoice</span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-6 md:flex">
          <a
            className="font-bold hover:underline cursor-pointer"
            onClick={() => {
              const featuresSection = document.getElementById("features");
              featuresSection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Features
          </a>
          <a
            className="font-bold hover:underline cursor-pointer"
            onClick={() => {
              const privacySection = document.getElementById("privacy");
              privacySection?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Privacy
          </a>
          <Button className="rounded-md border-4 border-black bg-[#93C5FD] px-6 py-2 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            Get Started
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="neutral"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="absolute left-0 top-full z-50 w-full border-b-4 border-black bg-[#FFFAF0] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <a
              href="#features"
              className="font-bold hover:underline"
              onClick={() => setIsMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#privacy"
              className="font-bold hover:underline"
              onClick={() => setIsMenuOpen(false)}
            >
              Privacy
            </a>
            <Button className="rounded-md border-4 border-black bg-[#93C5FD] px-6 py-2 font-bold text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Get Started
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}

import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-[#FFFAF0] px-4 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2 md:gap-8">
          <div className="flex flex-col justify-center">
            <div className="mb-6 inline-block rounded-lg border-4 border-black bg-[#BFDBFE] px-4 py-1 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              100% Client-Side
            </div>
            <h1 className="mb-6 text-5xl font-black leading-tight md:text-6xl lg:text-7xl">
              Invoices that{" "}
              <span className="relative inline-block">
                <span className="relative z-10">stay private</span>
                <span className="absolute bottom-2 left-0 z-0 h-4 w-full bg-[#FF90E8]"></span>
              </span>
            </h1>
            <p className="mb-8 text-xl">
              Generate professional invoices without your data ever leaving your
              device. No server, no cloud, just pure privacy.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to={"/app"}>
                <Button className="rounded-md border-4 border-black bg-[#93C5FD] px-8 py-6 text-lg font-bold text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  Start Invoicing Now
                </Button>
              </Link>
              <Button
                variant="neutral"
                className="rounded-md border-4 border-black bg-white px-8 py-6 text-lg font-bold text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                onClick={() => {
                  const featuresSection = document.getElementById("features");
                  featuresSection?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                See How It Works
              </Button>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="relative h-[400px] w-full max-w-[500px] rotate-3 rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="mb-4 h-8 rounded-md border-2 border-black bg-[#BFDBFE]"></div>
              <div className="mb-6 h-12 rounded-md border-2 border-black"></div>
              <div className="mb-4 grid grid-cols-2 gap-4">
                <div className="h-20 rounded-md border-2 border-black"></div>
                <div className="h-20 rounded-md border-2 border-black"></div>
              </div>
              <div className="mb-4 h-32 rounded-md border-2 border-black"></div>
              <div className="flex justify-end">
                <div className="h-10 w-32 rounded-md border-2 border-black bg-[#FF90E8]"></div>
              </div>
            </div>
            <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full border-4 border-black bg-[#FDE68A] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
            <div className="absolute -right-4 top-8 h-16 w-16 rounded-md border-4 border-black bg-[#86EFAC] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-8 -left-8 h-16 w-16 rounded-md border-4 border-black bg-[#93C5FD] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
      <div className="absolute -right-8 -top-8 h-16 w-16 rounded-full border-4 border-black bg-[#FF90E8] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
    </section>
  );
}

import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export function LandingCta() {
  return (
    <section className="bg-[#FFFAF0] px-4 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-xl border-4 border-black bg-[#93C5FD] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] md:p-12">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-6 text-4xl font-black md:text-5xl">
              Ready to take control of your invoicing?
            </h2>
            <p className="mb-8 text-xl">
              Join thousands of freelancers and small businesses who trust
              Genvoice for their invoicing needs.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to={"/app"}>
                <Button className="rounded-md border-4 border-black bg-black px-8 py-6 text-lg font-bold text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] transition-all hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] active:translate-y-0.5 active:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
                  Get Started for Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

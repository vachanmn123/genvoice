import { FileText, Users, Package, BarChart4 } from "lucide-react";

export function LandingFeatures() {
  return (
    <section id="features" className="bg-[#FFFAF0] px-4 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-black md:text-5xl">
            <span className="relative inline-block">
              <span className="relative z-10">Powerful Features</span>
              <span className="absolute bottom-2 left-0 z-0 h-4 w-full bg-[#86EFAC]"></span>
            </span>
          </h2>
          <p className="mx-auto max-w-2xl text-xl">
            Everything you need to manage invoices, clients, and products — all
            in your browser.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="mb-4 inline-flex rounded-lg border-4 border-black bg-[#BFDBFE] p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl border-4 border-black bg-[#FDE68A] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <h3 className="mb-4 text-2xl font-black">
                Customize to Your Brand
              </h3>
              <p className="mb-4">
                Choose from multiple themes, add your logo, and customize
                invoice templates to match your brand identity.
              </p>
              <ul className="space-y-2">
                {customizationFeatures.map((feature, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <div className="rounded-full border-2 border-black bg-black p-0.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative h-[200px] w-full max-w-[300px] rounded-xl border-4 border-black bg-white p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                <div className="mb-4 grid grid-cols-3 gap-2">
                  <div className="h-8 rounded-md border-2 border-black bg-[#FF90E8]"></div>
                  <div className="h-8 rounded-md border-2 border-black bg-[#93C5FD]"></div>
                  <div className="h-8 rounded-md border-2 border-black bg-[#86EFAC]"></div>
                </div>
                <div className="mb-4 h-6 w-3/4 rounded-md border-2 border-black"></div>
                <div className="mb-4 h-24 rounded-md border-2 border-black"></div>
                <div className="h-6 w-1/2 rounded-md border-2 border-black bg-[#BFDBFE]"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: FileText,
    title: "Invoice Management",
    description:
      "Create, edit, and download professional invoices as PDFs with just a few clicks.",
  },
  {
    icon: Users,
    title: "Client Management",
    description:
      "Store and manage client information with detailed profiles and search functionality.",
  },
  {
    icon: Package,
    title: "Product Catalog",
    description:
      "Maintain a catalog of your products and services with prices and descriptions.",
  },
  {
    icon: BarChart4,
    title: "Dashboard & Stats",
    description:
      "Get a quick overview of your business with visual charts and statistics.",
  },
];

const customizationFeatures = [
  "Multiple color themes",
  "Custom logo upload",
  "Customizable Company information",
];

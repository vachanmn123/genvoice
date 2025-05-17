import { Shield, Lock, Smartphone, Wifi } from "lucide-react";

export function LandingPrivacy() {
  return (
    <section id="privacy" className="bg-[#FFFAF0] px-4 py-16 md:py-24">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-2">
          <div>
            <div className="mb-6 inline-block rounded-lg border-4 border-black bg-[#FF90E8] px-4 py-1 font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              Privacy First
            </div>
            <h2 className="mb-6 text-4xl font-black md:text-5xl">
              Your data never leaves your device
            </h2>
            <p className="mb-8 text-xl">
              Genvoice runs entirely in your browser. No servers, no cloud
              storage, no data collection. Your business information stays
              private, just as it should be.
            </p>

            <div className="space-y-6">
              {privacyFeatures.map((feature, index) => (
                <div key={index} className="flex gap-4">
                  <div className="rounded-lg border-4 border-black bg-[#BFDBFE] p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="mb-1 text-xl font-bold">{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative h-[400px] w-full max-w-[400px] -rotate-2 rounded-xl border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <div className="absolute -right-4 -top-4 rounded-full border-4 border-black bg-[#86EFAC] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Lock className="h-8 w-8" />
              </div>

              <div className="mt-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full border-2 border-black"></div>
                  <div className="h-6 w-3/4 rounded-md border-2 border-black"></div>
                </div>

                <div className="space-y-2">
                  <div className="h-4 w-full rounded-md border-2 border-black"></div>
                  <div className="h-4 w-5/6 rounded-md border-2 border-black"></div>
                  <div className="h-4 w-4/6 rounded-md border-2 border-black"></div>
                </div>

                <div className="flex justify-between">
                  <div className="h-16 w-[30%] rounded-md border-2 border-black"></div>
                  <div className="h-16 w-[65%] rounded-md border-2 border-black"></div>
                </div>

                <div className="h-24 rounded-md border-2 border-black"></div>

                <div className="flex justify-end">
                  <div className="h-10 w-32 rounded-md border-2 border-black bg-[#FDE68A]"></div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-8 -left-8 h-24 w-24 rounded-md border-4 border-black bg-[#FF90E8] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

const privacyFeatures = [
  {
    icon: Shield,
    title: "No Data Collection",
    description:
      "We don't collect, store, or analyze your data. Everything stays on your device.",
  },
  {
    icon: Smartphone,
    title: "Local Storage",
    description:
      "All your data is stored locally using IndexedDB or localStorage in your browser.",
  },
  {
    icon: Wifi,
    title: "Works Offline",
    description:
      "Once loaded, Genvoice works without an internet connection. Create invoices anywhere.",
  },
];

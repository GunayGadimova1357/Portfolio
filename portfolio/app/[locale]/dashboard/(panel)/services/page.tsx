import {ServicesManager} from "@/services/components/services-manager";
import {getAllServices} from "@/lib/services";

export const dynamic = "force-dynamic";

export default async function DashboardServicesPage() {
  const services = await getAllServices();

  return (
    <>
      <section className="rounded-[2rem] border border-white/10 bg-[#101015] p-6 md:p-8">
        <p className="text-sm text-white/55">Services</p>
        <h1 className="mt-2 text-4xl font-semibold text-white">Services</h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-7 text-white/58">
          Edit existing service cards, update their visibility, or delete outdated items.
        </p>
      </section>

      <ServicesManager initialServices={services} />
    </>
  );
}

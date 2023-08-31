import logo_bpjs from "@/public/images/logo-bpjs.png";
import graphic_portue from "@/public/images/graphic-portue.png";
import logo_koni from "@/public/images/logo-koni.png";
import logo_ipsi from "@/public/images/logo-ipsi.png";
import logo_bjb from "@/public/images/logo-bjb.png";
import Image from "next/image";
import Profile from "./Profile";

const SponsorLogo = () => {
  return (
    <section className="w-full">
      {/* <div className="grid grid-cols-12 gap-3 max-w-full px-3 py-1 items-center h-[50px]"> */}
      <div className="grid grid-cols-[repeat(14,_minmax(0,_1fr))] md:grid-cols-12 gap-3 max-w-full px-3 py-1 items-center h-[50px]">
        <div className="w-full h-full col-span-2">
          <Profile />
        </div>
        <div className="hidden md:block col-span-4"></div>
        <div className="w-full h-full col-span-2 md:col-span-1 relative">
          <Image
            src={graphic_portue}
            alt="graphic-portue"
            fill
            className="w-fit h-full object-contain"
          />
        </div>
        <div className="w-full h-full col-span-2 md:col-span-1 relative">
          <Image
            src={logo_koni}
            alt="graphic-portue"
            fill
            className="w-fit h-full object-contain"
          />
        </div>
        <div className="w-full h-full col-span-2 md:col-span-1 relative">
          <Image
            src={logo_ipsi}
            alt="graphic-portue"
            fill
            className="w-fit h-full object-contain"
          />
        </div>
        <div className="w-full h-full col-span-4 md:col-span-2 relative">
          <Image
            src={logo_bpjs}
            alt="graphic-portue"
            fill
            className="w-full h-fit object-contain"
          />
        </div>
        <div className="w-full h-full col-span-2 md:col-span-1 relative">
          <Image
            src={logo_bjb}
            alt="graphic-portue"
            fill
            className="w-fit h-full object-contain"
          />
        </div>
      </div>
    </section>
  );
};
export default SponsorLogo;

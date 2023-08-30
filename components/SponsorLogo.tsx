import logo_bpjs from "@/public/images/logo-bpjs.png";
import graphic_portue from "@/public/images/graphic-portue.png";
import logo_koni from "@/public/images/logo-koni.png";
import logo_ipsi from "@/public/images/logo-ipsi.png";
import logo_bjb from "@/public/images/logo-bjb.png";
import Image from "next/image";
import Profile from "./Profile";

const SponsorLogo = () => {
  return (
    <section className="w-full flex justify-between h-[40px] sm:h-[60px] md:h-[80px] p-2 items-center ">
      <div className="h-full flex items-center">
        <Profile />
        <Image
          src={graphic_portue}
          alt="graphic-portue"
          className="w-fit h-full my-auto"
        />
      </div>
      <div className="flex gap-3 h-full w-full justify-end">
        <Image src={logo_koni} alt="logo-koni" className="w-fit h-full" />
        <Image src={logo_ipsi} alt="logo-ipsi" className="w-fit h-full" />
        <Image src={logo_bpjs} alt="logo-bpjs" className="w-fit h-full" />
        <Image src={logo_bjb} alt="logo-bjb" className="w-fit h-full" />
      </div>
    </section>
  );
};
export default SponsorLogo;

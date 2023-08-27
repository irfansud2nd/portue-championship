import logo_bpjs from "@/public/images/logo-bpjs.png";
import logo_1 from "@/public/images/logo-1.png";
import logo_ipsi from "@/public/images/logo-ipsi.png";
import logo_bjb from "@/public/images/logo-bjb.png";
import Image from "next/image";
import Profile from "./Profile";

const SponsorLogo = () => {
  return (
    <section className="w-full flex justify-between h-[80px] p-2 items-center">
      <div>
        <Profile />
      </div>
      <div className="flex gap-3 h-full">
        <Image src={logo_bpjs} alt="logo-bpjs" className="w-fit h-full" />
        <Image src={logo_1} alt="logo-1" className="w-fit h-full" />
        <Image src={logo_ipsi} alt="logo-ipsi" className="w-fit h-full" />
        <Image src={logo_bjb} alt="logo-bjb" className="w-fit h-full" />
      </div>
    </section>
  );
};
export default SponsorLogo;

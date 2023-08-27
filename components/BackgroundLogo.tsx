import mascot_1 from "@/public/images/mascot-1.png";
import mascot_2 from "@/public/images/mascot-2.png";
import Image from "next/image";
const BackgroundLogo = () => {
  return (
    <div className="absolute top-0 right-0 bottom-0 left-0 -z-[1]">
      <div className="flex flex-col w-full h-full justify-between">
        <Image
          src={mascot_1}
          alt="mascot-1"
          className="self-end h-[250px] w-fit -translate-x-[10vw] translate-y-[50px]"
        />
        <Image src={mascot_2} alt="mascot-2" className="h-[200px] w-fit" />
      </div>
    </div>
  );
};
export default BackgroundLogo;

import Image from "next/image";

const BackgroundImages = () => {
  return (
    <div className="fixed top-0 right-0 left-0 bottom-0 -z-10">
      <div className="absolute top-0 left-0 -z-[8]">
        <div className="w-[200px] h-[250px] relative">
          <Image
            src="/images/corner-element.png"
            fill
            alt="corner-element"
            className="object-cover"
          />
        </div>
      </div>
      <div className="w-full h-full relative">
        <Image
          src="/images/bg.png"
          fill
          alt="backdrop"
          className="object-cover object-center -z-[9]"
        />
      </div>
      <div className="absolute bottom-0 right-0 -z-[8] rotate-180">
        <div className="w-[200px] h-[250px] relative">
          <Image
            src="/images/corner-element.png"
            fill
            alt="corner-element"
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
};
export default BackgroundImages;

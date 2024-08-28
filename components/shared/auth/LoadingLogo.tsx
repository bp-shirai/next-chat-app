import Image from "next/image";

interface Props {
  size?: number;
}

export const LoadingLogo = ({ size = 100 }: Props) => {
  return (
    <div className="flex w-full h-full items-center justify-center bg-white">
      <Image src={"/logo.svg"} alt="Logo" width={size} height={size} className="animate-pulse duration-700 m-auto"></Image>
    </div>
  );
};

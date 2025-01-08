import Image from "next/image";
import loader from "@/assets/loader.gif";

const LoadingPage = () => {
  return <Image src={loader} height={150} width={150} alt="Loading..."></Image>;
};

export default LoadingPage;

import Banner from "./home/banner/Banner";
import Ethos from "./home/ethos/Ethos";
import OurPhilosophy from "./home/our-philosophy/OurPhilosophy";
import Welcome from "./home/welcome/Welcome";
// import CallToAction from "./home/call-to-action/CallToAction";

export default function Home() {
  return (
    <>
      <Banner/>
      {/* <Welcome/> */}
      <OurPhilosophy/>
      <Ethos/>
      {/* <CallToAction/> */}
    </>
  );
}

import Footer from "./components/layout/Footer";
 
import { MainComponent } from "./main";

export default function Root() {
  return <MainComponent 
  footer={<Footer />} />;
}

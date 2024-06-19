import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import { MainComponent } from "./main";

export default function Root() {
  return <MainComponent header={<Header />} footer={<Footer />} />;
}

import Footer from "./components/layout/footer";
import Header from "./components/layout/header";
import { MainComponent } from "./main";

export default function Root() {
  return <MainComponent header={<Header />} footer={<Footer />} />;
}

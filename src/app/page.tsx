import {Component} from "./main3"
import {MainComponent} from "./main"
import {Header} from "./header"
import {Footer} from "./footer"

export default function Root() {
  return (
    // <Component />
    <MainComponent
    header={<Header />}
    footer={<Footer />}/>
  );
}

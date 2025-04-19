import React from "react";
import ImgSlide from "./ImgSlide";
import About from "../About/About";
import Usefullto from "./Usefullto";
import Section from "../Section/Section";
import LastSection from "../LastSection/LastSection";
import Footer from "../Footer/Footer";


export default function Home() {
return (<>
    <ImgSlide/>

    {/* <About/> */}
    <Usefullto></Usefullto>
    <Section></Section>
    <LastSection></LastSection>
    <Footer />
    </>
);
}

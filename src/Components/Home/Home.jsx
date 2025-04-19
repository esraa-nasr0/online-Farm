import React from "react";
import ImgSlide from "./ImgSlide";
import About from "../About/About";
import Usefullto from "./Usefullto";
import Section from "../Section/Section";
import LastSection from "../LastSection/LastSection";

export default function Home() {
return (<>
    <ImgSlide/>

    {/* <About/> */}
    <Usefullto></Usefullto>
    <Section></Section>
    <LastSection></LastSection>
    </>
);
}

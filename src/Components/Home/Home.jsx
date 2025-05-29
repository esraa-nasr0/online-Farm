import React from "react";
import ImgSlide from "./ImgSlide";
import About from "../About/About";
import Usefullto from "./Usefullto";
import Section from "../Section/Section";
import LastSection from "../LastSection/LastSection";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";


export default function Home() {
return (<>
<div className=" mt-0">
    <Navbar></Navbar>
   <ImgSlide/>
    <Usefullto></Usefullto>
    <Section></Section>
    <LastSection></LastSection>
    <Footer />
</div>
 
    </>
);
}

import React from "react";
import Navigation from "./Navigation";
import Hero from "./Hero";
import Feature from "./Feature";
import Categories from "./Categories";
import Footer from "./Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      
      <Hero />
      <Feature />
      <Categories />
      
     
    </div>
  );
}
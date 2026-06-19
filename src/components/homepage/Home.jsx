import React, { useState } from "react";
import dynamic from 'next/dynamic';
import HeroSection from "../herosection";
import HomeDesign from "../homedesign/HomeDesign";
import Moduleboat from "./Moduleboat";

const AIPoweredEcosystemSection = dynamic(() => import("../AIPoweredEcosystemSection"));
const MagazineSlider = dynamic(() => import("../magazines/MagazinePage"));
const TestimonialSlider = dynamic(() => import("../designslider/testimonial/TestimonialSlider"));
const Trust = dynamic(() => import("../homedesign/Trust"));

const Home = () => {
  const [isModuleOpen, setIsModuleOpen] = useState(false);

  return (
    <>
      <HeroSection />
      <HomeDesign />
      <AIPoweredEcosystemSection />
      <MagazineSlider />
      <TestimonialSlider />
      <Trust />

      {/* Your existing Module Modal */}
      {isModuleOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={() => setIsModuleOpen(false)}
          ></div>

          <div className="fixed inset-0 flex items-center justify-center z-50 px-4">
            <div
              className="relative w-full max-w-3xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 rounded-3xl p-6 shadow-2xl border border-white/10 animate-zoom-in"
            >
              <button
                onClick={() => setIsModuleOpen(false)}
                className="absolute top-4 right-4 text-white text-3xl font-bold hover:scale-110 transition"
              >
                ×
              </button>
              <Moduleboat />
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Home;
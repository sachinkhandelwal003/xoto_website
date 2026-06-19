import React from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { FiSmartphone, FiLayers, FiMaximize2 } from "react-icons/fi";
import heroBg from "../../../assets/img/hero-bg.jpg";
import Category from "../Category";
import Products from "../Products";

const Ecommerce = () => {
  const { t, i18n } = useTranslation("ecommerce");

  // ✅ Keep number formatting (does NOT affect layout direction)
  const formatNumber = (num) =>
    new Intl.NumberFormat(i18n.language).format(num);

  return (
    // ✅ FORCE LTR – no RTL switching
    <div className="bg-gray-50 font-sans" dir="ltr">
      
      {/* ================= HERO SECTION ================= */}
   <section className="relative flex items-center justify-center py-28 overflow-hidden h-[70vh]">
  {/* Background */}
  <div className="absolute inset-0">
    <img
      src={heroBg}
      alt="Hero Background"
      className="w-full h-full object-cover"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
  </div>

  {/* Bottom clipping shapes */}
  <div className="absolute bottom-0 left-0 bg-[var(--color-body)] z-[3] clip-left-shape" />
  <div className="absolute bottom-0 right-0 bg-[var(--color-body)] z-[3] clip-right-shape" />

  <style>{`
    .clip-left-shape {
      position: absolute;
      bottom: 0; left: 0;
      width: 30vw;
      max-width: 320px;
      min-width: 120px;
      height: clamp(28px, 3.5vw, 48px);
      background: var(--color-body);
      z-index: 5;
      clip-path: polygon(0 0, 55% 0, 100% 100%, 0% 100%);
    }
    .clip-right-shape {
      position: absolute;
      bottom: 0; right: 0;
      width: 30vw;
      max-width: 320px;
      min-width: 120px;
      height: clamp(28px, 3.5vw, 48px);
      background: var(--color-body);
      z-index: 5;
      clip-path: polygon(47% 0, 100% 0, 100% 100%, 0% 100%);
    }
    @media (min-width: 360px) {
      .xs\\:text-\\[2\\.25rem\\] { font-size: 2.25rem !important; }
    }
  `}</style>

  {/* Content */}
  <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
    <motion.h1
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="heading-light mb-4 sm:mb-6"
      style={{ fontSize: 'clamp(2rem, 5vw, 54px)', lineHeight: '1.15' }}
    >
      {t("hero.title")}
    </motion.h1>

    <p className="text-base sm:text-lg md:text-xl text-white/90 mb-8 sm:mb-10 max-w-2xl mx-auto">
      {t("hero.subtitle")}
    </p>

    <div className="flex flex-row flex-nowrap gap-3 sm:gap-4 justify-center pt-2 sm:pt-4 max-w-sm sm:max-w-none mx-auto">
      <Link
        to="/ecommerce/filter"
        className="bg-[#5c039b] text-white border-2 border-[#5c039b] px-4 sm:px-8 py-2.5 sm:py-3 rounded-md shadow-lg text-sm sm:text-base flex-1 sm:flex-none whitespace-nowrap text-center hover:bg-[#4a0280] hover:border-[#4a0280] transition"
      >
        {t("hero.explore")}
      </Link>

      <Link
        to="/seller/registration"
        className="border-2 border-white text-white px-4 sm:px-8 py-2.5 sm:py-3 rounded-md hover:bg-[#5c039b] hover:border-[#5c039b] transition text-sm sm:text-base flex-1 sm:flex-none whitespace-nowrap text-center"
      >
        {t("hero.vendor")}
      </Link>
    </div>
  </div>
</section>

      {/* ================= CATEGORIES & PRODUCTS ================= */}
      <Category />
      <Products />

      {/* ================= PROMO / AR SECTION ================= */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-xl border border-gray-100">
            
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t("ar.title")}
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                {t("ar.desc")}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: <FiSmartphone size={28} />, titleKey: "cards.arScan.title", descKey: "cards.arScan.desc", btnKey: "cards.arScan.btn" },
                { icon: <FiLayers size={28} />,     titleKey: "cards.virtual.title", descKey: "cards.virtual.desc", btnKey: "cards.virtual.btn" },
                { icon: <FiMaximize2 size={28} />,  titleKey: "cards.fit.title",    descKey: "cards.fit.desc",    btnKey: "cards.fit.btn" },
              ].map((card, i) => (
                <div key={i} className="bg-purple-50 rounded-xl p-6 border border-purple-100 flex flex-col h-full">
                  <div className="w-16 h-16 bg-[#5c039b] rounded-xl flex items-center justify-center mb-6 mx-auto text-white">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-bold text-center mb-3">
                    {t(card.titleKey)}
                  </h3>
                  <p className="text-gray-600 text-center mb-6 flex-1">
                    {t(card.descKey)}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-3 bg-[#5c039b] hover:bg-[#4a0280] text-white font-semibold rounded-lg transition duration-200"
                  >
                    {t(card.btnKey)}
                  </motion.button>
                </div>
              ))}
            </div>

            {/* HOW IT WORKS */}
            <div className="mt-16 grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">{t("how.title")}</h3>
                <ul className="space-y-4">
                  {[1, 2, 3].map((n) => (
                    <li key={n} className="flex gap-3">
                      <span className="w-8 h-8 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center font-bold">
                        {formatNumber(n)}
                      </span>
                      <div>
                        <p className="font-semibold">
                          {t(`how.step${n}.title`)}
                        </p>
                        <p className="text-sm text-gray-600">
                          {t(`how.step${n}.desc`)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
};

export default Ecommerce;

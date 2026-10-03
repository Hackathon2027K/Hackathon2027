"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "motion/react";

export const HeroParallax = ({ products }) => {
  const firstRow = products.slice(0, 5);
  const secondRow = products.slice(5, 10);
  const thirdRow = products.slice(10, 15);

  const ref = useRef(null);

  // Detect mobile screen
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();

    window.addEventListener("resize", checkScreen);

    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const springConfig = {
    stiffness: 300,
    damping: 30,
    bounce: 100,
  };

  // Horizontal movement
  const translateX = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, 1000]),
    springConfig
  );

  const translateXReverse = useSpring(
    useTransform(scrollYProgress, [0, 1], [0, -1000]),
    springConfig
  );

  // Rotation
  const rotateX = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [15, 0]),
    springConfig
  );

  const rotateZ = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [20, 0]),
    springConfig
  );

  // Opacity
  const opacity = useSpring(
    useTransform(scrollYProgress, [0, 0.2], [0.2, 1]),
    springConfig
  );

  // Different translateY for mobile & desktop
  const translateYValues = isMobile
    ? [-600, 0] // Mobile
    : [-900, 250]; // Desktop

  const translateY = useSpring(
    useTransform(scrollYProgress, [0, 0.2], translateYValues),
    springConfig
  );

  return (
    <div
      ref={ref}
      className="
        h-[220vh] md:h-[300vh]
        pb-20
        overflow-hidden
        antialiased
        relative
        flex
        flex-col
        bg-white
        [perspective:1000px]
        [transform-style:preserve-3d]
      "
    >
      <Header />

      <motion.div
        style={{
          rotateX,
          rotateZ,
          translateY,
          opacity,
        }}
        className="flex flex-col gap-6 md:gap-16 mt-10 md:mt-0"
      >
        {/* First Row */}
        <motion.div className="flex flex-row-reverse gap-4 md:gap-10 mb-4 md:mb-10">
          {firstRow.map((product) => (
            <ProductCard
              key={product.title}
              product={product}
              translate={translateX}
            />
          ))}
        </motion.div>

        {/* Second Row */}
        <motion.div className="flex flex-row gap-4 md:gap-10 mb-4 md:mb-10">
          {secondRow.map((product) => (
            <ProductCard
              key={product.title}
              product={product}
              translate={translateXReverse}
            />
          ))}
        </motion.div>

        {/* Third Row */}
        <motion.div className="flex flex-row-reverse gap-4 md:gap-10">
          {thirdRow.map((product) => (
            <ProductCard
              key={product.title}
              product={product}
              translate={translateX}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export const Header = () => {
  return (
    <div className="max-w-7xl relative mx-auto px-4 md:px-16 w-full min-h-[100vh] flex flex-col justify-center items-center text-center z-10">
      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-neutral-900 leading-none md:leading-tight">
        SRCAS Hackathon's <br/> Highlights
      </h1>

      <p className="max-w-2xl text-sm sm:text-base md:text-xl mt-4 md:mt-6 text-neutral-600 leading-relaxed">
        Explore memorable moments from SRCAS Hackathon's <br/>
        Showcasing innovation, creativity, and teamwork <br/>
        Relive the energy and excitement of the event
      </p>
    </div>
  );
};

export const ProductCard = ({ product, translate }) => {
  return (
    <motion.div
      style={{ x: translate }}
      whileHover={{ y: -20 }}
      className="
        group/product
        relative
        shrink-0
        rounded-2xl
        overflow-hidden
        border
        border-neutral-200
        shadow-md

        h-40 w-[16rem]
        sm:h-52 sm:w-[22rem]
        md:h-96 md:w-[30rem]
      "
    >
      {product.link ? (
        <a
          href={product.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full w-full"
        >
          <img
            src={product.thumbnail}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </a>
      ) : (
        <div className="block h-full w-full">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>
      )}

      {/* Removed Overlay and Title */}
    </motion.div>

    
  );
};
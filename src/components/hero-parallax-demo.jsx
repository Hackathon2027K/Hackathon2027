"use client";
import React from "react";
import { HeroParallax } from "@/components/ui/hero-parallax";

export default function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}

import img1 from '../assets/highlights/highlights_image/IMG_0073.JPG';
import img2 from '../assets/highlights/highlights_image/IMG_0078.JPG';
import img3 from '../assets/highlights/highlights_image/IMG_0079.JPG';
import img4 from '../assets/highlights/highlights_image/IMG_0080.JPG';
import img5 from '../assets/highlights/highlights_image/IMG_0083.JPG';
import img6 from '../assets/highlights/highlights_image/IMG_0094.JPG';
import img7 from '../assets/highlights/highlights_image/IMG_0099.JPG';
import img8 from '../assets/highlights/highlights_image/IMG_0545.JPG';
import img9 from '../assets/highlights/highlights_image/IMG_0547.JPG';
import img10 from '../assets/highlights/highlights_image/IMG_0550.JPG';
import img11 from '../assets/highlights/highlights_image/IMG_0555.JPG';
import img12 from '../assets/highlights/highlights_image/IMG_0558.JPG';

export const products = [
  { title: "AI Integration", thumbnail: img1 },
  { title: "Machine Learning", thumbnail: img2 },
  { title: "Cloud Architecture", thumbnail: img3 },
  { title: "Neural Networks", thumbnail: img4 },
  { title: "Quantum Computing", thumbnail: img5 },
  { title: "Data Analytics", thumbnail: img6 },
  { title: "Cybersecurity", thumbnail: img7 },
  { title: "Blockchain Tech", thumbnail: img8 },
  { title: "IoT Devices", thumbnail: img9 },
  { title: "Edge Computing", thumbnail: img10 },
  { title: "Robotics", thumbnail: img11 },
  { title: "Virtual Reality", thumbnail: img12 },
  { title: "Augmented Reality", thumbnail: img1 }, // reusing
  { title: "Deep Learning", thumbnail: img2 }, // reusing
  { title: "5G Networks", thumbnail: img3 }, // reusing
];


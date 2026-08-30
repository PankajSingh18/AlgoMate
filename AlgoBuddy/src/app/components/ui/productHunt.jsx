"use client";
import React from "react";
import Image from "next/image";

const ProductHuntBadge = () => {
  return (
    <a
      className="border dark:border-white border-black rounded-xl inline-block overflow-hidden"
      href="https://www.producthunt.com/products/dsa-visualizer?embed=true&utm_source=badge-featured&utm_medium=badge&utm_source=badge-dsa&#0045;visualizer"
      target="_blank"
      rel="noopener noreferrer"
      style={{ width: 250, height: 54 }}
    >
      <Image
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=974127&theme=dark&t=1749182745821"
        alt="DSA Visualizer - Visualize & learn dsa the smart way | Product Hunt"
        width={250}
        height={54}
        priority
      />
    </a>
  );
};

export default ProductHuntBadge;
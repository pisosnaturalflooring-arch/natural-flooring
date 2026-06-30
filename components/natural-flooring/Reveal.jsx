"use client";

import { motion } from "framer-motion";

const VARIANTS = {
  up:    { hidden: { opacity: 0, y: 22 },        visible: { opacity: 1, y: 0 } },
  left:  { hidden: { opacity: 0, x: -28 },       visible: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 28 },        visible: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.94 },  visible: { opacity: 1, scale: 1 } },
  fade:  { hidden: { opacity: 0 },               visible: { opacity: 1 } },
};

const EASE = [0.25, 0.46, 0.45, 0.94];

export function Reveal({ as = "div", direction = "up", delay = 0, duration = 0.8, once = true, children, ...props }) {
  const Tag = motion[as];
  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "0px 0px -60px 0px" }}
      transition={{ type: "spring", stiffness: 70, damping: 15, delay }}
      variants={VARIANTS[direction]}
      {...props}
    >
      {children}
    </Tag>
  );
}

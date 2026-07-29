"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiStar, FiSend, FiCheckCircle, FiArrowRight } from "react-icons/fi";
import dynamic from "next/dynamic";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  .catch(err => console.error(err))
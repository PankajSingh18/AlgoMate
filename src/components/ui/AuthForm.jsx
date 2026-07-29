"use client";
import Image from "next/image";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Mail, Lock, User, LogIn, UserPlus, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useUser } from "@/features/user/UserContext";
import { api } from "@/lib/apiClient";

const Turnstile = dynamic(
  () => import("@marsidev/react-turnstile").then((mod) => mod.Turnstile),
  .catch(err => console.error(err))
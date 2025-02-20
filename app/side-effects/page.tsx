import SadeEffectSection from "@/sections/sade-effect-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Обратная связь о побочных эффектах',
  description: '',
}
export default function SideEffectsPage() {
  return (
    <div className="">
      <SadeEffectSection />
    </div>
  );
}

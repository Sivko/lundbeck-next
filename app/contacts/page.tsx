import ContactSection from "@/sections/contact-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Форма обратной связи',
  description: '',
}
export default function ContactPage() {
  return (
    <div className="">
      <ContactSection />
    </div>
  );
}

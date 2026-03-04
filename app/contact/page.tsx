import type { Metadata } from "next";
import ContactForm from "../components/contact-form";

export const metadata: Metadata = {
  title: "Contact Support | Learn Radicals",
  description: "Get in touch with the Learn Radicals team for questions, issues, or feedback.",
  robots: { index: false },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-20 bg-paper">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-ink mb-2">Contact Support</h1>
          <p className="text-sm text-gray">
            Have a question or need help? Send us a message and we&rsquo;ll get back to you.
          </p>
        </div>

        <ContactForm />

        <p className="mt-8 text-center text-xs text-gray">
          <a href="/" className="hover:text-ink transition-colors">
            &larr; Back to home
          </a>
        </p>
      </div>
    </main>
  );
}

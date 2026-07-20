import Link from "next/link";
import { Globe, Mail, ExternalLink, Share2, Brain } from "lucide-react";

export default function Footer() {
  const columns = [
    {
      title: "Product",
      links: [
        { name: "Home", href: "#home" },
        { name: "Features", href: "#features" },
        { name: "Pricing", href: "#pricing" },
        { name: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "About", href: "#about" },
        { name: "Features", href: "#features" },
        { name: "Resources", href: "#resources" },
        { name: "Glassmorphism", href: "#glass" },
      ],
    },
    {
      title: "Company",
      links: [
        { name: "About", href: "#about" },
        { name: "Privacy", href: "#privacy" },
        { name: "How It Works", href: "#how-it-works" },
        { name: "Pricing", href: "#pricing" },
      ],
    },
    {
      title: "GitHub",
      links: [
        { name: "Contact", href: "#contact" },
        { name: "Sponsor", href: "#sponsor" },
        { name: "Privacy Policy", href: "#privacy" },
      ],
    },
  ];

  return (
    <footer className="w-full border-t border-white/5 bg-zinc-950/20 pt-16 pb-8 mt-10" id="contact">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-5 gap-10">
        {/* Columns */}
        {columns.map((col, index) => (
          <div key={index} className="flex flex-col gap-4">
            <h4 className="text-sm font-bold text-white tracking-wider">{col.title}</h4>
            <div className="flex flex-col gap-2.5">
              {col.links.map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-xs text-zinc-500 hover:text-white transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Contact Column */}
        <div className="flex flex-col gap-4 col-span-2 md:col-span-1">
          <h4 className="text-sm font-bold text-white tracking-wider">Contact</h4>
          <div className="flex items-center gap-4 text-zinc-500">
            <a href="#website" className="hover:text-white transition-colors" aria-label="Website">
              <Globe className="w-4 h-4" />
            </a>
            <a href="#email" className="hover:text-white transition-colors" aria-label="Email">
              <Mail className="w-4 h-4" />
            </a>
            <a href="#share" className="hover:text-white transition-colors" aria-label="Share">
              <Share2 className="w-4 h-4" />
            </a>
            <a
              href="#external"
              className="hover:text-white transition-colors"
              aria-label="External Link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom attribution */}
      <div className="max-w-7xl mx-auto px-6 border-t border-white/5 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] md:text-xs text-zinc-600">
        <div className="flex items-center gap-1.5"></div>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-pink-500/60" />
          <span className="font-bold text-zinc-400">MindRush</span>
          <span>&copy; {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}

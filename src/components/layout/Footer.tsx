import Link from "next/link";
import {
  MapPin,
  Mail,
  Phone,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10 mb-12">
          {/* Brand & Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-teal-400">Go-Stay</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              Platform booking resort dan villa terbaik di Bali. Temukan
              pengalaman liburan mewah dengan harga terbaik.
            </p>
            {/* Social Media */}
            <div className="flex gap-3 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-teal-600 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Destinasi Populer */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white">
              Destinasi Populer
            </h4>
            <ul className="space-y-2.5">
              {[
                "Seminyak",
                "Ubud",
                "Uluwatu",
                "Canggu",
                "Nusa Dua",
                "Sanur",
              ].map((dest) => (
                <li key={dest}>
                  <Link
                    href={`/properties?location=${dest.toLowerCase()}`}
                    className="text-gray-400 text-sm hover:text-teal-400 transition-colors inline-flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" />
                    {dest}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Layanan */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white">Layanan</h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/properties"
                  className="text-gray-400 text-sm hover:text-teal-400 transition-colors"
                >
                  Resort & Villa
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="text-gray-400 text-sm hover:text-teal-400 transition-colors"
                >
                  Honeymoon Package
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="text-gray-400 text-sm hover:text-teal-400 transition-colors"
                >
                  Family Vacation
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="text-gray-400 text-sm hover:text-teal-400 transition-colors"
                >
                  Corporate Retreat
                </Link>
              </li>
              <li>
                <Link
                  href="/properties"
                  className="text-gray-400 text-sm hover:text-teal-400 transition-colors"
                >
                  Long Stay Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Kontak & Bantuan */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg text-white">Hubungi Kami</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <Mail className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
                <a
                  href="mailto:info@go-stay.com"
                  className="hover:text-teal-400 transition-colors"
                >
                  info@go-stay.com
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <Phone className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
                <a
                  href="tel:+62361234567"
                  className="hover:text-teal-400 transition-colors"
                >
                  +62 361 234 567
                </a>
              </li>
              <li className="flex items-start gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mt-0.5 text-teal-400 shrink-0" />
                <span>
                  Jl. Sunset Road No. 123
                  <br />
                  Seminyak, Bali 80361
                </span>
              </li>
            </ul>
            <div className="pt-2">
              <Link
                href="/profile"
                className="text-sm text-gray-400 hover:text-teal-400 transition-colors"
              >
                Pusat Bantuan →
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © 2026 RhinoCraft. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-gray-500 text-sm">
              <Link href="#" className="hover:text-teal-400 transition-colors">
                Syarat & Ketentuan
              </Link>
              <Link href="#" className="hover:text-teal-400 transition-colors">
                Kebijakan Privasi
              </Link>
              <Link href="#" className="hover:text-teal-400 transition-colors">
                Kebijakan Cookie
              </Link>
              <Link href="#" className="hover:text-teal-400 transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

import React from "react";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Link } from "react-router-dom";
import { Container } from "@/components/container";
import { MainRoutes } from "@/lib/helpers";

interface SocialLinkProps {
  href: string;
  icon: React.ReactNode;
  hoverColor: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, hoverColor }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`hover:${hoverColor}`}
    >
      {icon}
    </a>
  );
};

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink: React.FC<FooterLinkProps> = ({ to, children }) => {
  const isHashLink = to.startsWith("#");

  return (
    <li>
      {isHashLink ? (
        <a
          href={to}
          className="hover:underline text-gray-300 hover:text-gray-100"
        >
          {children}
        </a>
      ) : (
        <Link
          to={to}
          className="hover:underline text-gray-300 hover:text-gray-100"
        >
          {children}
        </Link>
      )}
    </li>
  );
};

export const Footer = () => {
  return (
    <div className="w-full bg-black text-gray-300 hover:text-gray-100 py-8">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {MainRoutes.map((route) => (
                <FooterLink key={route.href} to={route.href}>
                  {route.label}
                </FooterLink>
              ))}
            </ul>
          </div>

          {/* About Us */}
          <div id="about-us">
            <h3 className="font-bold text-lg mb-4">About Us</h3>
            <p>
              We are committed to helping you unlock your full potential with
              AI-powered tools. Our platform offers a wide range of resources to
              improve your interview skills and chances of success.
            </p>
          </div>

          {/* Services */}
          <div id="services">
            <h3 className="font-bold text-lg mb-4">Services</h3>
            <ul className="space-y-2">
              <li>Interview Preparation</li>
              {/* Add more services if needed */}
            </ul>
          </div>

          {/* Contact Us */}
          <div id="contact-us">
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <p className="mb-2">Naihati, Mittropara Baranch Road</p>
            <p className="mb-4">
              Email:{" "}
              <a
  href="https://mail.google.com/mail/?view=cm&fs=1&to=yosuvadip@gmail.com"
  target="_blank"
  rel="noopener noreferrer"
  className="text-blue-400 hover:underline"
>
  yosuvadip@gmail.com
</a>
            </p>
            <div className="flex gap-4">
              <SocialLink
                href="https://www.facebook.com/profile.php?id=100075792810238"
                icon={<Facebook size={24} />}
                hoverColor="text-blue-500"
              />
              <SocialLink
                href="https://x.com/suva2409"
                icon={<Twitter size={24} />}
                hoverColor="text-blue-400"
              />
              <SocialLink
                href="https://www.instagram.com/khanra.suvadip/"
                icon={<Instagram size={24} />}
                hoverColor="text-pink-500"
              />
              <SocialLink
                href="https://www.linkedin.com/in/suvadip-khanra/"
                icon={<Linkedin size={24} />}
                hoverColor="text-blue-700"
              />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

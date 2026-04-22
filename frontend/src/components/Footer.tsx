import { Diamond } from "lucide-react";
import twitterIcon from "../../assets/icons/twitter.svg";
import githubIcon from "../../assets/icons/git.svg";
import linkedinIcon from "../../assets/icons/linkedin.svg";

const LINKS = {
    Platform: ["Latest Articles", "Top Authors", "Reading List", "Categories"],
    Support: ["Help Center", "Guidelines", "Report an Issue", "Contact Us"],
    Company: ["About", "Blog", "Careers", "API Docs"],
};

export function Footer() {
    return (
        <footer className="bg-[#FCFCFC] border-t border-gray-200">
            <div className="mx-auto w-11/12 lg:w-10/12 py-12 grid grid-cols-1 md:grid-cols-4 gap-10">

                {/* Brand */}
                <div className="flex flex-col items-center md:items-start gap-4">
                    <div className="flex items-center gap-2">
                        <div className="bg-[#3899FA] p-1 rounded-lg">
                            <Diamond color="white" size={22} />
                        </div>
                        <span className="text-base font-bold text-[#3899FA]">Knowledge Base</span>
                    </div>
                    <p className="text-sm text-gray-400 text-center md:text-left">
                        The ultimate knowledge sharing platform for teams and individuals to grow together.
                    </p>
                    <div className="flex gap-4">
                        {[
                            { src: twitterIcon, alt: "Twitter" },
                            { src: githubIcon, alt: "GitHub" },
                            { src: linkedinIcon, alt: "LinkedIn" },
                        ].map(({ src, alt }) => (
                            <a key={alt} href="#" className="opacity-50 hover:opacity-100 transition-opacity">
                                <img src={src} alt={alt} className="h-5 w-5" />
                            </a>
                        ))}
                    </div>
                </div>

                {/* Link columns */}
                {Object.entries(LINKS).map(([heading, items]) => (
                    <div key={heading} className="flex flex-col items-center md:items-start gap-3">
                        <div className="font-semibold text-sm text-gray-900">{heading}</div>
                        {items.map((item) => (
                            <a
                                key={item}
                                href="#"
                                className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
                            >
                                {item}
                            </a>
                        ))}
                    </div>
                ))}
            </div>

            {/* Copyright bar */}
            <div className="border-t border-gray-100 py-4">
                <p className="text-xs text-gray-400 text-center">
                    © {new Date().getFullYear()} Knowledge Base. All rights reserved.
                </p>
            </div>
        </footer>
    );
}

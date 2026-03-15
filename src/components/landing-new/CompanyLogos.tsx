// @ts-nocheck
import { motion } from "framer-motion";

const companies = [
    { name: "Acme Corp", logo: "https://logo.clearbit.com/acme.com" },
    { name: "GlobalX", logo: "https://logo.clearbit.com/globalx.com.au" },
    { name: "TechFlow", logo: "https://logo.clearbit.com/webflow.com" },
    { name: "Nova", logo: "https://logo.clearbit.com/nova.co" },
    { name: "Skyline", logo: "https://logo.clearbit.com/skyline.ai" },
    { name: "Vortex", logo: "https://logo.clearbit.com/vortex.com" },
    { name: "Pulse", logo: "https://logo.clearbit.com/pulse.is" },
    { name: "Echo", logo: "https://logo.clearbit.com/echo.xyz" },
];

export const CompanyLogos = () => {
    return null; // Hidden as per requirements
    return (
        <section className="py-12 bg-background/50 border-y border-border/50 relative overflow-hidden">
            <div className="container mx-auto px-4 md:px-6 max-w-7xl relative z-10">
                <p className="text-center text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-12">
                    Trusted by the world's most innovative companies
                </p>

                <div className="relative flex overflow-hidden">
                    <motion.div
                        animate={{
                            x: [0, -1035],
                        }}
                        transition={{
                            x: {
                                repeat: Infinity,
                                repeatType: "loop",
                                duration: 40,
                                ease: "linear",
                            },
                        }}
                        className="flex gap-12 items-center whitespace-nowrap"
                    >
                        {[...companies, ...companies].map((company, index) => (
                            <div
                                key={`${company.name}-${index}`}
                                className="flex items-center gap-3 px-8 opacity-50 hover:opacity-100 transition-opacity grayscale hover:grayscale-0"
                            >
                                <div className="w-8 h-8 rounded bg-primary/20 flex items-center justify-center p-1">
                                    <img
                                        src={company.logo}
                                        alt={company.name}
                                        className="w-full h-full object-contain"
                                        onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'block'; }}
                                    />
                                    <div className="hidden font-bold text-primary text-xs">{company.name[0]}</div>
                                </div>
                                <span className="text-xl font-bold tracking-tight text-foreground/80">
                                    {company.name}
                                </span>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Decorative gradient masks */}
            <div className="absolute inset-y-0 left-0 w-40 bg-gradient-to-r from-background to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-40 bg-gradient-to-l from-background to-transparent z-10" />
        </section>
    );
};

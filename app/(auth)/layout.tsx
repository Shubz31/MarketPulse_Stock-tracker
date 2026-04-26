import Link from "next/link";
import Image from "next/image";
import { getAuth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const Layout = async ({ children }: { children: React.ReactNode }) => {
    const auth = await getAuth();
    const session = await auth!.api.getSession({ headers: await headers() });

    if (session?.user) redirect('/');

    return (
        <main className="auth-layout">
            <section className="auth-left-section scrollbar-hide-default">
                <Link href="/" className="auth-logo">
                    <Image
                        src="/assets/icons/logo.svg"
                        alt="MarketPulse logo"
                        width={140}
                        height={32}
                        className="h-8 w-auto"
                    />
                </Link>

                <div className="pb-6 lg:pb-8 flex-1">{children}</div>
            </section>

            <section className="auth-right-section">
                <div className="z-10 relative lg:mt-4 lg:mb-16">
                    <blockquote className="auth-blockquote">
                        Signalist turned my watchlist into a winning list. The alerts are spot-on, and I feel more confident making moves in the market
                    </blockquote>

                    <div className="flex items-center justify-between">
                        <div>
                            <cite className="auth-testimonial-author">- Ethan R.</cite>
                            <p className="max-md:text-xs text-gray-500">Retail Investor</p>
                        </div>

                        <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Image
                                    src="/assets/icons/star.svg"
                                    alt="Star"
                                    key={star}
                                    width={20}
                                    height={20}
                                    className="w-5 h-5"
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex-1 relative flex items-end justify-center">
                    <Image
                        src="/assets/images/dashboard-main.png"
                        alt="Dashboard Preview"
                        width={900}
                        height={700}
                        className="auth-dashboard-preview w-[85%] h-auto object-contain rounded-xl shadow-2xl"
                    />
                </div>
            </section>
        </main>
    );
};

export default Layout;
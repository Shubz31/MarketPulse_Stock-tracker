import Image from "next/image"
import Link from "next/link"

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='auth-layout'>
        <section className="auth-left-section scrollbar-hide-default">
            <Link href='/' className="auth-logo">
                <Image src="/assets/icons/logo.svg" alt="MarketPulse logo" width={140} height={32} className="h-12 w-auto" />
            </Link>

            <div className="pb-6 lg:pb-8 flex-1">
                {children}
            </div>
        </section>

        <section className="auth-right-section">
            <div className="z-10 relative lg:mt-4 lg:mb-16">
                  <blockquote className="auth-blockquote">
                    "MarketPulse is the best platform for tracking stock market trends. It turned my watchlist into winning list. The alerts are spot-on, and I feel more confident making moves in the market."
                  </blockquote>
                  <div className="flex items-center justify-between">
                    <cite className="auth-testimonial-author">— Warren Buffett.</cite>
                    <p className="max-md:text-xs text-gray-500">Retail Investor</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                          <Image src="/assets/icons/star.svg" alt="Star" width={20} height={20} key={star} className="h-5 w-5" />
                      ))}
                  </div>
            </div>
            <div className="flex-1 relative">
                <Image src="/assets/images/dashboard-main.png" alt="Dashboard Preview" width={1440} height={1150} className="auth-dashboard-preview absolute top-0"/>
            </div>


        </section>

    </main>
  )
}

export default layout

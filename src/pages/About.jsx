import { Link } from 'react-router-dom'
import { HiOutlineArrowRight, HiOutlineShieldCheck, HiOutlineSparkles, HiOutlineHeart, HiOutlineUsers } from 'react-icons/hi'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { SITE_NAME, SITE_TAGLINE } from '../lib/constants'

const VALUES = [
  { icon: HiOutlineShieldCheck, title: 'Modesty First', desc: 'Every piece is designed or selected with Islamic modesty at its core.' },
  { icon: HiOutlineSparkles, title: 'Quality Promise', desc: 'Premium fabrics and expert craftsmanship you can count on.' },
  { icon: HiOutlineHeart, title: 'Nigerian Pride', desc: 'Celebrating Nigerian culture and supporting local artisans.' },
  { icon: HiOutlineUsers, title: 'Community', desc: 'Building a community of confident, stylish Muslim women.' },
]

export default function About() {
  return (
    <div>
      <section className="relative h-44 lg:h-56 bg-gradient-to-r from-emerald-700 via-emerald-600 to-emerald-700 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 text-6xl">✦</div>
          <div className="absolute bottom-4 right-8 text-4xl">✦</div>
          <div className="absolute top-1/2 left-1/3 text-3xl">✦</div>
        </div>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-white relative z-10">Our Story</h1>
      </section>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'About', path: '' },
        ]} />

        <div className="space-y-8">
          <section className="text-center lg:text-left">
            <p className="text-gold-500 text-xs font-medium uppercase tracking-[0.15em] font-body">Welcome to</p>
            <h2 className="text-2xl lg:text-3xl font-display font-bold text-emerald-600 mt-1">{SITE_NAME}</h2>
            <div className="w-12 h-0.5 bg-gold-500 mx-auto lg:mx-0 mt-3 mb-4" />
            <p className="text-[#6B6B6B] dark:text-gray-400 font-body leading-relaxed">
              {SITE_TAGLINE}. At Knots by Fimihan, we believe that modesty and style are not mutually exclusive.
              Our mission is to provide Nigerian Muslim women with access to beautiful, high-quality modest fashion that
              honors their faith and celebrates their culture.
            </p>
          </section>

          <section className="card-app p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gold-100 dark:bg-gold-900/30 flex items-center justify-center">
                <span className="text-lg">👩🏾‍🦱</span>
              </div>
              <h3 className="font-display font-semibold text-xl text-emerald-600">Meet Fimihan</h3>
            </div>
            <p className="text-[#6B6B6B] dark:text-gray-400 font-body leading-relaxed text-sm lg:text-base">
              Knots by Fimihan was born from a simple observation: Nigerian Muslim women deserved better.
              After years of struggling to find elegant, affordable modest wear that didn't compromise on style,
              Fimihan decided to create the solution herself. What started as a small collection of hand-picked
              abayas has grown into a curated destination for the modern Muslim woman's wardrobe.
            </p>
            <p className="text-[#6B6B6B] dark:text-gray-400 font-body leading-relaxed mt-4 text-sm lg:text-base">
              Every piece in our collection is thoughtfully selected for quality, fit, and style. We work directly
              with trusted artisans and manufacturers to ensure that each garment meets our standards of modesty,
              comfort, and elegance.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-display font-bold text-emerald-600 mb-5 text-center lg:text-left">Our Values</h3>
            <div className="grid sm:grid-cols-2 gap-3 lg:gap-4">
              {VALUES.map((v) => {
                const Icon = v.icon
                return (
                  <div key={v.title} className="card-app p-5 flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <h4 className="font-body font-semibold text-sm text-[#1C1C1C] dark:text-gray-200 mb-0.5">{v.title}</h4>
                      <p className="text-xs text-[#6B6B6B] dark:text-gray-400 leading-relaxed">{v.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="text-center py-6">
            <h3 className="text-xl font-display font-bold text-emerald-600 mb-2">Ready to find your perfect piece?</h3>
            <p className="text-sm text-[#6B6B6B] dark:text-gray-400 mb-5 font-body">Explore our collection of modest fashion essentials.</p>
            <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
              Shop Now <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </section>
        </div>
      </div>
    </div>
  )
}

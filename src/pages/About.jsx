import { Link } from 'react-router-dom'
import { HiOutlineArrowRight } from 'react-icons/hi'
import Breadcrumbs from '../components/ui/Breadcrumbs'
import { SITE_NAME, SITE_TAGLINE } from '../lib/constants'

export default function About() {
  return (
    <div>
      <div className="relative h-48 lg:h-56 bg-gradient-to-r from-emerald-700 to-emerald-600 flex items-center justify-center">
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-white">Our Story</h1>
      </div>

      <div className="max-w-3xl mx-auto px-4 lg:px-8 py-8">
        <Breadcrumbs items={[
          { label: 'Home', path: '/' },
          { label: 'About', path: '' },
        ]} />

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-display font-semibold text-emerald-600 mb-4">Welcome to {SITE_NAME}</h2>
            <p className="text-[#6B6B6B] dark:text-gray-400 font-body leading-relaxed">
              {SITE_TAGLINE}. At Knots by Fimihan, we believe that modesty and style are not mutually exclusive.
              Our mission is to provide Nigerian Muslim women with access to beautiful, high-quality modest fashion that
              honors their faith and celebrates their culture.
            </p>
          </section>

          <section className="card p-8">
            <h3 className="font-display font-semibold text-xl text-emerald-600 mb-3">Meet Fimihan</h3>
            <p className="text-[#6B6B6B] dark:text-gray-400 font-body leading-relaxed">
              Knots by Fimihan was born from a simple observation: Nigerian Muslim women deserved better.
              After years of struggling to find elegant, affordable modest wear that didn't compromise on style,
              Fimihan decided to create the solution herself. What started as a small collection of hand-picked
              abayas has grown into a curated destination for the modern Muslim woman's wardrobe.
            </p>
            <p className="text-[#6B6B6B] dark:text-gray-400 font-body leading-relaxed mt-4">
              Every piece in our collection is thoughtfully selected for quality, fit, and style. We work directly
              with trusted artisans and manufacturers to ensure that each garment meets our standards of modesty, 
              comfort, and elegance.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-display font-semibold text-emerald-600 mb-4">Our Values</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { title: "Modesty First", desc: "Every piece is designed or selected with Islamic modesty at its core." },
                { title: "Quality Promise", desc: "Premium fabrics and expert craftsmanship you can count on." },
                { title: "Nigerian Pride", desc: "Celebrating Nigerian culture and supporting local artisans." },
                { title: "Community", desc: "Building a community of confident, stylish Muslim women." },
              ].map((v) => (
                <div key={v.title} className="card p-5">
                  <h4 className="font-body font-semibold text-[#1C1C1C] dark:text-gray-200 mb-1">{v.title}</h4>
                  <p className="text-sm text-[#6B6B6B] dark:text-gray-400 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="text-center py-8">
            <h3 className="text-xl font-display font-semibold text-emerald-600 mb-4">Ready to find your perfect piece?</h3>
            <Link to="/shop" className="btn-gold inline-flex items-center gap-2">
              Shop Now <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

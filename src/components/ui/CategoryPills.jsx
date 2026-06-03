import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../lib/constants'

export default function CategoryPills() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          to={`/category/${cat.slug}`}
          className="chip bg-white border border-cream-300 hover:border-emerald-600 hover:text-emerald-600 text-[#1C1C1C] whitespace-nowrap flex-shrink-0"
        >
          <span>{cat.icon}</span>
          <span>{cat.name}</span>
        </Link>
      ))}
    </div>
  )
}

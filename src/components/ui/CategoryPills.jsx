import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../lib/constants'

export default function CategoryPills() {
  return (
    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {CATEGORIES.map((cat) => (
        <Link
          key={cat.slug}
          to={`/category/${cat.slug}`}
          className="chip bg-white dark:bg-gray-800 border border-cream-300 dark:border-gray-600 hover:border-emerald-600 hover:text-emerald-600 text-[#1C1C1C] dark:text-gray-200 dark:hover:text-emerald-400 whitespace-nowrap flex-shrink-0"
        >
          <span>{cat.icon}</span>
          <span>{cat.name}</span>
        </Link>
      ))}
    </div>
  )
}

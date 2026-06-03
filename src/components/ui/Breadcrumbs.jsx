import { Link } from 'react-router-dom'
import { HiOutlineChevronRight } from 'react-icons/hi'

export default function Breadcrumbs({ items }) {
  return (
    <nav className="flex items-center gap-1 text-sm font-body text-[#6B6B6B] mb-6">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <HiOutlineChevronRight className="w-3 h-3" />}
          {item.path ? (
            <Link to={item.path} className="hover:text-emerald-600 transition-colors">
              {item.label}
            </Link>
          ) : (
            <span className="text-[#1C1C1C]">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  )
}

export default function StickyMenu({ menuItems, activeMenu, onMenuClick }) {
  return (
    <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-12 py-6">
        <div className="flex items-center justify-center gap-12">
          {menuItems.map((item) => (
            <button
              key={item}
              onClick={() => onMenuClick(item)}
              className={`text-sm font-medium transition-all duration-200 pb-2 border-b-2 ${
                activeMenu === item
                  ? 'text-primary border-primary'
                  : 'text-textdark border-transparent hover:text-primary hover:border-primary'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
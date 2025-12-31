const Footer = () => {
  return (
    <footer className="mt-16 bg-charcoal text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 bg-mesh" />
      <div className="relative max-w-7xl mx-auto px-4 py-14 grid md:grid-cols-4 gap-10 text-sm">
        <div>
          <div className="gradient-pill w-max mb-4">AgroConnect</div>
          <h3 className="text-2xl font-display font-semibold mb-3">
            Digitizing every farm-to-market journey.
          </h3>
          <p className="text-gray-300">
            Bridging technology and agriculture to empower buyers and sellers,
            communities with transparent commerce.
          </p>
        </div>
        <div>
          <p className="text-gray-400 uppercase text-xs tracking-[0.25em] mb-3">Platform</p>
          <ul className="space-y-2 text-gray-200">
            <li>Marketplace</li>
            <li>Seller Hub</li>
            <li>Logistics</li>
            <li>Learning Center</li>
          </ul>
        </div>
        <div>
          <p className="text-gray-400 uppercase text-xs tracking-[0.25em] mb-3">Resources</p>
          <ul className="space-y-2 text-gray-200">
            <li>Knowledge Base</li>
            <li>Price Trends</li>
            <li>Agro News</li>
            <li>Support</li>
          </ul>
        </div>
        <div>
          <p className="text-gray-400 uppercase text-xs tracking-[0.25em] mb-3">Contact</p>
          <ul className="space-y-2 text-gray-200">
            <li>+91 98765 43210</li>
            <li>support@agroconnect.com</li>
            <li>Mon - Sat, 9 AM to 7 PM</li>
          </ul>
          <div className="mt-4 flex gap-3">
            {['Twitter', 'LinkedIn', 'YouTube'].map((network) => (
              <span
                key={network}
                className="text-xs uppercase tracking-[0.25em] text-primary-light bg-white/5 px-3 py-1 rounded-full"
              >
                {network}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-4 text-center text-xs text-gray-400">
        © {new Date().getFullYear()} AgroConnect. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer



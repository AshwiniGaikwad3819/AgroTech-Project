import { Link } from 'react-router-dom'

const modules = [
  {
    title: 'Seller Module',
    points: [
      'Register & verify identity',
      'List products and manage pricing',
      'Manage stock availability',
      'Track orders and payments',
      'Generate sales analytics',
    ],
  },
  {
    title: 'Admin Module',
    points: [
      'Manage users and roles',
      'Moderate listings',
      'Generate KPI dashboards',
      'Configure payment partners',
    ],
  },
]

const Sell = () => (
  <div className="space-y-10">
    <div className="glass-card border border-white/50 p-8 space-y-3">
      <p className="gradient-pill w-max">Grow with us</p>
      <h1 className="text-3xl font-display text-charcoal">Sell smarter with AgroConnect</h1>
      <p className="text-gray-600 max-w-3xl">
        List your agri-products, inputs, services and connect directly with verified buyers. Our
        workflow digitizes onboarding, contracts, logistics, payments and analytics for every
        stakeholder in the agriculture ecosystem.
      </p>
      <Link
        to="/register"
        className="inline-flex items-center rounded-2xl bg-primary text-white font-semibold px-6 py-3 shadow-card"
      >
        Get started
      </Link>
    </div>
    <div className="grid md:grid-cols-3 gap-6">
      {modules.map((module) => (
        <div key={module.title} className="glass-card border border-white/50 p-6 space-y-3">
          <h3 className="text-xl font-semibold text-charcoal">{module.title}</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {module.points.map((point) => (
              <li key={point} className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary"></span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  </div>
)

export default Sell



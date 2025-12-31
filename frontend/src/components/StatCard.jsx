import PropTypes from 'prop-types'

const StatCard = ({ label, value, trend, icon: Icon, accent }) => (
  <div className="stat-card p-6 flex flex-col gap-4">
    <div className="flex items-center gap-3">
      {Icon && (
        <div className="h-10 w-10 rounded-2xl bg-primary-muted text-primary flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <p className="text-sm text-gray-500">{label}</p>
    </div>
    <div>
      <p className="text-3xl font-display font-semibold text-charcoal">{value}</p>
      {trend && (
        <p className="text-xs text-primary mt-1">
          <span className="font-semibold">{trend}</span> in last 7 days
        </p>
      )}
    </div>
    {accent && <div className="gradient-pill w-max">{accent}</div>}
  </div>
)

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  trend: PropTypes.string,
  icon: PropTypes.elementType,
  accent: PropTypes.string,
}

export default StatCard






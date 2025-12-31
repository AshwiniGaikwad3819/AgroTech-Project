import PropTypes from 'prop-types'

const SectionHeader = ({ eyebrow, title, description, actions }) => (
  <div className="flex flex-wrap gap-4 items-center justify-between mb-8">
    <div>
      {eyebrow && (
        <span className="uppercase tracking-[0.3em] text-xs font-semibold text-primary-dark">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl font-display font-semibold text-charcoal mt-2">
        {title}
      </h2>
      {description && <p className="text-base text-gray-600 mt-3 max-w-3xl">{description}</p>}
    </div>
    {actions && <div className="flex flex-wrap gap-3">{actions}</div>}
  </div>
)

SectionHeader.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  actions: PropTypes.node,
}

export default SectionHeader






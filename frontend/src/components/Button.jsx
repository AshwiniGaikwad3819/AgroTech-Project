import PropTypes from 'prop-types'
import clsx from 'clsx'

const base =
  'inline-flex items-center justify-center rounded-2xl font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2'

const VARIANTS = {
  primary:
    'bg-primary text-white shadow-card hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-primary',
  ghost:
    'bg-white/80 border border-gray-200 text-gray-800 hover:bg-white focus-visible:outline-gray-300',
  outline:
    'border border-primary text-primary hover:bg-primary hover:text-white focus-visible:outline-primary',
  subtle:
    'bg-primary-muted text-primary-dark hover:bg-primary/10 focus-visible:outline-primary-muted',
}

const SIZES = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-5 py-3 text-base',
  lg: 'px-6 py-3.5 text-base',
}

const Button = ({ children, variant = 'primary', size = 'md', className, ...props }) => (
  <button className={clsx(base, VARIANTS[variant], SIZES[size], className)} {...props}>
    {children}
  </button>
)

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(Object.keys(VARIANTS)),
  size: PropTypes.oneOf(Object.keys(SIZES)),
  className: PropTypes.string,
}

export default Button


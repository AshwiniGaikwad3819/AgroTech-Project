import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="text-center py-20">
    <h1 className="text-5xl font-bold text-gray-900 mb-4">404</h1>
    <p className="text-gray-500 mb-6">The page you are looking for does not exist.</p>
    <Link
      to="/"
      className="inline-flex items-center rounded-full bg-primary text-white font-semibold px-6 py-3"
    >
      Go home
    </Link>
  </div>
)

export default NotFound







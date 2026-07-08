import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold text-[#1b1b1d] mb-4">Page Not Found</h2>
      <p className="text-[#43474e] max-w-md mb-8">
        The page you are looking for doesn't exist or has been moved. 
        Let's get you back on track.
      </p>
      <Link to="/" className="btn-primary flex items-center justify-center gap-2 px-6 py-3">
        <Home className="w-5 h-5" />
        Return to Home
      </Link>
    </div>
  );
};

export default NotFoundPage;

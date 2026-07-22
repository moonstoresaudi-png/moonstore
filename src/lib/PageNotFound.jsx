import { Link, useLocation } from 'react-router-dom';
import { Home } from 'lucide-react';

export default function PageNotFound() {
  const location = useLocation();
  const pageName = location.pathname.substring(1);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-secondary/30">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-7xl font-light text-foreground/20">404</h1>
          <div className="h-0.5 w-16 bg-border mx-auto"></div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-heading font-bold text-foreground">الصفحة غير موجودة</h2>
          <p className="text-foreground/60 leading-relaxed">
            الصفحة <span className="font-medium text-foreground/80">"{pageName}"</span> غير موجودة في الموقع.
          </p>
        </div>

        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium btn-primary"
        >
          <Home className="w-4 h-4" /> العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}

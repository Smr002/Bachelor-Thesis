
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Code, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
    setIsLoaded(true);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-leetcode-bg-dark p-4">
      <div 
        className={`text-center max-w-md transition-all duration-700 ${
          isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}
      >
        <div className="mb-6 relative">
          <div className="absolute inset-0 bg-leetcode-blue/20 blur-xl rounded-full"></div>
          <Code className={`h-20 w-20 text-leetcode-blue mx-auto relative z-10 transition-transform duration-500 ${
            isLoaded ? 'rotate-0' : 'rotate-180'
          }`} />
        </div>
        <h1 className="text-7xl font-bold mb-4 text-leetcode-blue">404</h1>
        <p className="text-xl text-leetcode-text-secondary mb-8">
          The problem you're looking for doesn't exist in our database.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/">
            <Button className="bg-leetcode-blue hover:bg-leetcode-blue/90 transition-transform hover:scale-105">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return Home
            </Button>
          </Link>
          <Link to="/problems">
            <Button variant="outline" className="border-leetcode-blue text-leetcode-blue hover:bg-leetcode-blue/10 transition-transform hover:scale-105">
              Browse Problems
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

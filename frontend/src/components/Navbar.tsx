import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Code, List, Trophy, Search, Menu, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-leetcode-bg-dark shadow-md" : "bg-leetcode-bg-medium"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4">
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-leetcode-blue animate-pulse" />
          <Link
            to="/"
            className="text-xl font-bold transition-colors hover:text-leetcode-blue"
          >
            AlgoStruct
          </Link>
        </div>

        {!isHomePage && (
          <div className="hidden md:flex items-center gap-6 ml-8">
            <Link
              to="/problems"
              className={`flex items-center gap-1 relative transition-colors duration-300 ${
                isActive("/problems")
                  ? "text-leetcode-text-primary"
                  : "text-leetcode-text-secondary hover:text-leetcode-text-primary"
              }`}
            >
              <List className="h-4 w-4" />
              <span>Problems</span>
              {isActive("/problems") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-leetcode-blue rounded-full" />
              )}
            </Link>

            <Link
              to="/quiz"
              className={`flex items-center gap-1 relative transition-colors duration-300 ${
                isActive("/quiz")
                  ? "text-leetcode-text-primary"
                  : "text-leetcode-text-secondary hover:text-leetcode-text-primary"
              }`}
            >
              <Trophy className="h-4 w-4" />
              <span>Quiz</span>
              {isActive("/quiz") && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-leetcode-blue rounded-full" />
              )}
            </Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          {!isHomePage && (
            <div
              className={`relative transition-all duration-300 ${
                isSearchFocused ? "w-64" : "w-48"
              }`}
            >
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-leetcode-text-secondary" />
              <Input
                placeholder="Search problems..."
                className="pl-8 bg-leetcode-bg-dark border-leetcode-bg-light focus:border-leetcode-blue transition-all"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          )}
          {isHomePage && (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-leetcode-text-secondary hover:text-leetcode-text-primary hover:bg-leetcode-bg-light transition-colors"
                >
                  <LogIn className="h-4 w-4 mr-1" />
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="default"
                  className="bg-leetcode-blue hover:bg-leetcode-blue/90"
                >
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
      {isHomePage && (
        <Button
          variant="ghost"
          className="md:hidden text-leetcode-text-secondary hover:text-leetcode-text-primary "
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}
      {/* Mobile Menu */}

      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 bg-leetcode-bg-dark flex flex-col gap-4">
          {/* Problems & Quiz - Only show when not on homepage */}
          {!isHomePage && (
            <>
              <Link
                to="/problems"
                className={`flex items-center gap-2 p-2 rounded-md ${
                  isActive("/problems")
                    ? "bg-leetcode-bg-light text-leetcode-text-primary"
                    : "text-leetcode-text-secondary"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <List className="h-4 w-4" />
                <span>Problems</span>
              </Link>

              <Link
                to="/quiz"
                className={`flex items-center gap-2 p-2 rounded-md ${
                  isActive("/quiz")
                    ? "bg-leetcode-bg-light text-leetcode-text-primary"
                    : "text-leetcode-text-secondary"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Trophy className="h-4 w-4" />
                <span>Quiz</span>
              </Link>
            </>
          )}

          {/* Login & Sign Up - Always shown */}
          <div className="flex flex-col gap-2 pt-2 border-t border-leetcode-bg-light">
            <Link
              to="/login"
              className="w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button
                variant="outline"
                className="w-full justify-center border-leetcode-bg-light text-leetcode-text-primary"
              >
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Button>
            </Link>
            <Link
              to="/signup"
              className="w-full"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Button
                variant="default"
                className="w-full justify-center bg-leetcode-blue hover:bg-leetcode-blue/90"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

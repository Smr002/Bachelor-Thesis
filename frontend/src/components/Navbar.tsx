import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Code, List, Trophy, Search, Menu, LogIn, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp: number;
  role?: string; // Add role to the decoded token interface
  [key: string]: any;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [navLink, setNavLink] = useState("/"); // State for the logo link

  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === "/";

  const isActive = (path: string) => location.pathname === path;

  // Handle scroll effect for navbar background
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check token and role to set the logo link
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        const userRole = decoded.role;

        console.log("Decoded user role:", userRole);

        if (userRole === "student") {
          setNavLink("/home");
        } else {
          setNavLink("/");
        }
      } catch (err) {
        console.error("Error decoding token:", err);
        setNavLink("/"); // Fallback to "/" if token is invalid
      }
    } else {
      console.log("No token found, defaulting to /");
      setNavLink("/"); // No token, default to "/"
    }
  }, []); // Run once on mount

  const handleLogout = () => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          console.log("Token expired.");
        } else {
          console.log("Logging out manually.");
        }
      } catch (error) {
        console.error("Invalid token.");
      }
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setNavLink("/"); // Update logo link after logout
    navigate("/");
  };

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-leetcode-bg-dark shadow-md" : "bg-leetcode-bg-medium"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between h-14 px-4">
        {/* Left side: Logo/Brand */}
        <div className="flex items-center gap-2">
          <Code className="h-6 w-6 text-leetcode-blue animate-pulse" />
          <Link
            to={navLink} // Use dynamic navLink based on token and role
            className="text-xl font-bold transition-colors hover:text-leetcode-blue"
          >
            AlgoStruct
          </Link>
        </div>

        {/* Center Nav Links (only if not on home) */}
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

          {isHomePage ? (
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
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                className="p-2 hover:bg-leetcode-bg-light rounded focus:outline-none
                           text-leetcode-text-secondary hover:text-leetcode-text-primary
                           transition-colors"
              >
                <User className="h-5 w-5" />
              </button>

              {showProfileDropdown && (
                <div
                  className="absolute right-0 mt-2 w-32 bg-leetcode-bg-light
                             rounded shadow-md overflow-hidden z-50"
                >
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm hover:bg-leetcode-bg-medium
                               text-leetcode-text-primary"
                    onClick={() => setShowProfileDropdown(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setShowProfileDropdown(false);
                      handleLogout();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-leetcode-bg-medium
                               text-leetcode-text-primary"
                  >
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {isHomePage && (
        <Button
          variant="ghost"
          className="md:hidden text-leetcode-text-secondary hover:text-leetcode-text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <div
        className={`md:hidden transition-all duration-300 overflow-hidden ${
          isMobileMenuOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-3 bg-leetcode-bg-dark flex flex-col gap-4">
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

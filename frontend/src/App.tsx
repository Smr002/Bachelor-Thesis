import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import HomePage from "./pages/HomePage";
import ProblemsPage from "./pages/ProblemsPage";
import ProblemPage from "./pages/ProblemPage";
import NotFound from "./pages/NotFound";
import CodeSnippetsPage from "./pages/CodeSnippetsPage";
import PopQuizPage from "./pages/PopQuizPage";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import SignUpPage from "./pages/SignUpPage";
import Home from "./pages/Home";
import PrivateRoute from "@/components/PrivateRoute";
import { jwtDecode } from "jwt-decode";
import { useEffect } from "react";

const queryClient = new QueryClient();

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<DecodedToken>(token);
        const now = Date.now() / 1000;

        if (decoded.exp < now) {
          console.log("Auto-logging out due to token expiration.");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }
    }
  }, [navigate]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageWrapper>
              <HomePage />
            </PageWrapper>
          }
        />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <PageWrapper>
                <Home />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/problems"
          element={
            <PrivateRoute>
              <PageWrapper>
                <ProblemsPage />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/problem/:id"
          element={
            <PrivateRoute>
              <PageWrapper>
                <ProblemPage />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/snippets"
          element={
            <PrivateRoute>
              <PageWrapper>
                <CodeSnippetsPage />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/quiz"
          element={
            <PrivateRoute>
              <PageWrapper>
                <PopQuizPage />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <PageWrapper>
                <AdminDashboard />
              </PageWrapper>
            </PrivateRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PageWrapper>
              <LoginPage />
            </PageWrapper>
          }
        />
        <Route
          path="/signup"
          element={
            <PageWrapper>
              <SignUpPage />
            </PageWrapper>
          }
        />
        <Route
          path="*"
          element={
            <PageWrapper>
              <NotFound />
            </PageWrapper>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

// Reusable animation wrapper
const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    transition={{ duration: 0.4, ease: "easeInOut" }}
  >
    {children}
  </motion.div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

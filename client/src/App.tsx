import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import College from "./pages/College";
import House from "./pages/House";
import Menu from "./pages/Menu";
import Movies from "./pages/Movies";
import Studies from "./pages/Studies";
import Goals from "./pages/Goals";
import Ideas from "./pages/Ideas";
import Library from "./pages/Library";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/college"} component={College} />
      <Route path={"/house"} component={House} />
      <Route path={"/menu"} component={Menu} />
      <Route path={"/movies"} component={Movies} />
      <Route path={"/studies"} component={Studies} />
      <Route path={"/goals"} component={Goals} />
      <Route path={"/ideas"} component={Ideas} />
      <Route path={"/library"} component={Library} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

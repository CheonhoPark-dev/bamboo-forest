import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import InfoForm from "./pages/InfoForm";
import Complete from "./pages/Complete";
import Result from "./pages/Result";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/info"} component={InfoForm} />
      <Route path={"/complete"} component={Complete} />
      <Route path={"/result"} component={Result} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

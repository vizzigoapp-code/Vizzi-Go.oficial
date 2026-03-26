import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./hooks/use-auth";

import Home from "./pages/home";
import Login from "./pages/login";
import Register from "./pages/register";
import MapPage from "./pages/map";
import Dashboard from "./pages/dashboard";
import Promocoes from "./pages/promocoes";
import Perfil from "./pages/perfil";
import Admin from "./pages/admin";
import NotFound from "./pages/not-found";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/entrar" component={Login} />
      <Route path="/cadastro" component={Register} />
      <Route path="/mapa" component={MapPage} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/promocoes" component={Promocoes} />
      <Route path="/perfil" component={Perfil} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </WouterRouter>
    </QueryClientProvider>
  );
}

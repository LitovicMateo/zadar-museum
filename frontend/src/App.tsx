import { Toaster } from "react-hot-toast";

import { LogOut } from "lucide-react";

import GlobalSearch from "./components/global-search/global-search";
import Header from "./components/header/header";
import AppRoutes from "./components/routes/app-routes";
import { useAuth } from "./context/auth-context";

// import './App.css';

function App() {
  const { logout, isAuthenticated } = useAuth();
  return (
    <div>
      {isAuthenticated && (
        <>
          <div className="w-full px-6 h-[80px] flex justify-between items-center">
            <h1 className="font-abel uppercase text-2xl">
              Muzej Zadarske Košarke
            </h1>
            <div className="flex justify-center items-center gap-4">
              <GlobalSearch />
              <LogOut
                size={24}
                onClick={logout}
                color="#364153"
                className="cursor-pointer"
              />
            </div>
          </div>
          <Header />
        </>
      )}
      <AppRoutes />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;

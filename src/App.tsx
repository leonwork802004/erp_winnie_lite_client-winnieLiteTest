import { AppProvider } from "@routes/appProvider";
import { AppRoutes } from "@routes/appRoutes";

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;

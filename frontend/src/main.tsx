import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createRouter, RouterProvider } from "@tanstack/react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "./contexts/AuthContext";
import queryClient from "./lib/queryClient";
import "./index.css";

// Route tree imports
import { rootRoute } from "./routes/__root";
import { Route as indexRoute } from "./routes/index";
import { Route as appRoute } from "./routes/app";
import { Route as loginRoute } from "./routes/login";
import { Route as signupRoute } from "./routes/signup";
import { Route as profileSetupRoute } from "./routes/profile-setup";
import { Route as waitingForVerificationRoute } from "./routes/waiting-for-verification";
import { Route as profileRoute } from "./routes/profile";
import { Route as forgotPasswordRoute } from "./routes/forgot-password";
import { Route as adminRoute } from "./routes/admin";
import { Route as verifyEmailRoute } from "./routes/verify-email";
import { Route as notFoundRoute } from "./routes/not-found";
import { Route as maintenanceRoute } from "./routes/maintenance";

const routeTree = rootRoute.addChildren([
  indexRoute,
  appRoute,
  loginRoute,
  signupRoute,
  profileSetupRoute,
  waitingForVerificationRoute,
  profileRoute,
  forgotPasswordRoute,
  adminRoute,
  verifyEmailRoute,
  maintenanceRoute,
  notFoundRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>
  </StrictMode>
);

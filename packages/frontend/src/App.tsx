import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./pages/Root";
import { LandingPage } from "./pages/Landing";
import "./App.css";
import { DashboardPage } from "./pages/Dashboard";
import { ExperimentSetupPage } from "./pages/ExperimentSetup";
import { SummaryReviewPage } from "./pages/SummaryReview";
import { ResultsPage } from "./pages/Results";
import { ExperimentSubmittedPage } from "./pages/ExperimentSubmitted";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    children: [],
  },
  {
    element: <RootLayout />,
    children: [
      {
        path: "/dashboard",
        element: <DashboardPage />,
      },
      {
        path: "/experimentSetup",
        element: <ExperimentSetupPage />,
        children: [],
      },
      {
        path: "/summaryReview",
        element: <SummaryReviewPage />
      },
      {
        path: "/experimentSubmitted",
        element: <ExperimentSubmittedPage />
      },
      {
        path: "/results/:id",
        element: <ResultsPage />
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;

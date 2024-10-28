import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { RootLayout } from "./pages/Root";
import { LandingPage } from "./pages/Landing";
import "./App.css";
import { DashboardPage } from "./pages/Dashboard";
import { SummaryReviewPage } from "./pages/SummaryReview";
import { ResultsPage } from "./pages/Results";
import { ExperimentSubmittedPage } from "./pages/ExperimentSubmitted";
import { ExperimentForm } from "./pages/ExperimentForm";
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from "@apollo/client";

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
        element: <ExperimentForm />,
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
  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({ uri: import.meta.env.VITE_COMETS_BACKEND })
  });

  return (
    <ApolloProvider client={apolloClient}>
      <RouterProvider router={router} />;
    </ApolloProvider>
  )
}

export default App;

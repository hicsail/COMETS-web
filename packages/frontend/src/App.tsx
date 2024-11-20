import { Route, Routes, BrowserRouter } from 'react-router-dom';
import { LandingPage } from './pages/Landing';
import './App.css';
import { SummaryReviewPage } from './pages/SummaryReview';
import { Results } from './pages/Results';
import { ExperimentSubmittedPage } from './pages/ExperimentSubmitted';
import { ExperimentForm } from './pages/ExperimentForm';
import { ApolloClient, ApolloProvider, InMemoryCache, createHttpLink } from '@apollo/client';
import { CometsThemeProvider } from './contexts/Theme.context';
import { Box, styled } from '@mui/material';
import { DashboardPage } from './pages/Dashboard';
import { NavbarComponent } from './components/Navbar';
import { useState } from 'react';
import { Sidebar } from './components/Sidebar';

const drawerWidth = 256;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })<{
  open?: boolean;
}>(({ theme }) => ({
  flexGrow: 1,
  padding: theme.spacing(3),
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  marginLeft: `-${drawerWidth}px`,
  variants: [
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen
        }),
        marginLeft: 0
      }
    }
  ]
}));

function App() {
  const apolloClient = new ApolloClient({
    cache: new InMemoryCache(),
    link: createHttpLink({ uri: import.meta.env.VITE_COMETS_BACKEND })
  });

  const [drawerOpen, setDrawerOpen] = useState<boolean>(true);

  return (
    <ApolloProvider client={apolloClient}>
      <CometsThemeProvider>
        <BrowserRouter>
          <NavbarComponent drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
          <Main open={drawerOpen}>
            <Box sx={{ display: 'flex' }}>
              <Sidebar open={drawerOpen} drawerWidth={drawerWidth} />
              <Box sx={{ flexGrow: 1, width: '100%' }}>
                <Routes>
                  <Route path={'/'} element={<LandingPage />} />
                  <Route path={'/dashboard'} element={<DashboardPage />} />
                  <Route path={'/experimentSetup'} element={<ExperimentForm />} />
                  <Route path={'/summaryReview'} element={<SummaryReviewPage />} />
                  <Route path={'/experimentSubmitted'} element={<ExperimentSubmittedPage />} />
                  <Route path={'/results/:id'} element={<Results />} />
                </Routes>
              </Box>
            </Box>
          </Main>
        </BrowserRouter>
      </CometsThemeProvider>
    </ApolloProvider>
  );
}

export default App;

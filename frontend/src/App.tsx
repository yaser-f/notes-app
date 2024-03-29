import { Routes, Route, useLocation, Outlet, Link } from 'react-router-dom';
import HomePage from './pages/home';
import NotePage from './pages/note';
import NoMatch from './pages/404';
import styled from 'styled-components';
import LandingPage from './pages/landing/landing';
import LoginPage from './pages/login';
import SignUpPage from './pages/signup';
import { AuthProvider, RequireAuth, RequireNoAuth } from './@hooks/useAuth';

const LayoutContainer = styled.div`
  height: 100%;
  width: 100%;
  overflow: auto;
  padding: 0 30px;
`;

const HeaderContainer = styled.div`
  width: 100%;
  height: 90px;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
`;

const LogoContainer = styled(Link)`
  font-size: ${({ theme }) => theme.font.size.lg};
  font-weight: ${({ theme }) => theme.font.weight.bold};
  text-decoration: none;
  padding: 16px;
  display: block;
`;

const Layout = () => {
  return (
    <LayoutContainer>
      <HeaderContainer>
        <LogoContainer to='/'>:)</LogoContainer>
      </HeaderContainer>
      <Outlet />
    </LayoutContainer>
  );
};

function App() {
  let location = useLocation();

  // The `backgroundLocation` state is the location that we were at when one of
  // the gallery links was clicked. If it's there, use it as the location for
  // the <Routes> so we show the gallery in the background, behind the modal.
  let state = location.state as { backgroundLocation?: Location };

  return (
    <AuthProvider>
      <Routes location={state?.backgroundLocation || location}>
        <Route path='/' element={<Layout />}>
          <Route
            index
            element={
              <RequireNoAuth>
                <LandingPage />
              </RequireNoAuth>
            }
          />
          <Route
            path='login'
            element={
              <RequireNoAuth>
                <LoginPage />
              </RequireNoAuth>
            }
          />
          <Route
            path='signup'
            element={
              <RequireNoAuth>
                <SignUpPage />
              </RequireNoAuth>
            }
          />
          {/* require auth */}
          <Route
            path='notes'
            element={
              <RequireAuth>
                <HomePage />
              </RequireAuth>
            }
          />
          <Route
            path='/note/:id'
            element={
              <RequireAuth>
                <NotePage />
              </RequireAuth>
            }
          />
          <Route path='*' element={<NoMatch />} />
        </Route>
      </Routes>

      {/* Show the modal when a `backgroundLocation` is set */}
      {state?.backgroundLocation && (
        <Routes>
          <Route
            path='login'
            element={
              <RequireNoAuth>
                <LoginPage />
              </RequireNoAuth>
            }
          />
          <Route
            path='signup'
            element={
              <RequireNoAuth>
                <SignUpPage />
              </RequireNoAuth>
            }
          />
          <Route
            path='/note/:id'
            element={
              <RequireAuth>
                <NotePage />
              </RequireAuth>
            }
          />
        </Routes>
      )}
    </AuthProvider>
  );
}

export default App;

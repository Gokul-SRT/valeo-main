import React, { lazy, Suspense, useRef } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { connect } from "react-redux";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import ProtectedRoute from "../component/ProtectedRoute";


const Login = lazy(() => import("../pages/Login"));
const Onboard = lazy(() => import("../pages/Onboard"));
const Auth404 = lazy(() => import("../pages/Errors/404"));
const Auth500 = lazy(() => import("../pages/Errors/500"));

const routes = [
 
  { path: "/", Component: Login, exact: true, public: true },
  { path: "/login", Component: Login, exact: true, public: true },
 
  { path: "/auth/404", Component: Auth404, exact: true, public: true },
  { path: "/auth/500", Component: Auth500, exact: true, public: true },
 
  { path: "/onboard", Component: Onboard, exact: true, protected: true },
];

const mapStateToProps = ({ settings }) => ({
  routerAnimation: settings?.routerAnimation || "fade",
});

const AnimatedRoutes = ({ routerAnimation }) => {
  const location = useLocation();
  const nodeRef = useRef(null); 

  return (
    <SwitchTransition>
      <CSSTransition
        key={location.pathname}
        appear
        classNames={routerAnimation}
        timeout={routerAnimation === "none" ? 0 : 300}
        nodeRef={nodeRef}
      >
        
        <div ref={nodeRef}>
          <Routes location={location}>
          
            {routes.map(
              ({ path, Component,protected: isProtected }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <div className={routerAnimation}>
                      <Suspense>
                        {isProtected ? (
                          <ProtectedRoute>
                            <Component />
                          </ProtectedRoute>
                        ) : (
                          <Component />
                        )}
                      </Suspense>
                    </div>
                  }
                />
              )
            )}

           
            <Route path="*" element={<Navigate to="/auth/404" replace />} />
          </Routes>
        </div>
      </CSSTransition>
    </SwitchTransition>
  );
};

const AppRouter = ({ routerAnimation }) => (
  <BrowserRouter>
    <AnimatedRoutes routerAnimation={routerAnimation} />
  </BrowserRouter>
);

export default connect(mapStateToProps)(AppRouter);

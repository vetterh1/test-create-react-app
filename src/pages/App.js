/* eslint-disable react-hooks/rules-of-hooks */ 

// React
import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Redirect } from 'react-router'
// Redux
import { connect, useDispatch } from 'react-redux';
import { userActions } from '_actions/userActions';
// HOC
import { IntlProvider } from "react-intl";
import { withStyles } from "@material-ui/core/styles";
import withMyTheme from 'theme/withMyTheme';
// MUI
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
// Components
import { NavigationStyle } from 'navigation/configNavigation'
import { SnackbarProvider } from 'notistack';
import Notifier from 'pages/utils/Notifier';
// Utilities
import clsx from "clsx";
import DateFnsUtils from '@date-io/date-fns'; // Date util library (moment like) & date picker
// Configuration
import translations from 'i18n/locales';



// ------------ Navigation -----------

// const Header = lazy(() => import('navigation/Header'));
import Header from 'navigation/Header';
// const Footer = lazy(() => import('navigation/Footer'));
import Footer from 'navigation/Footer';
// const BottomNav = lazy(() => import('navigation/BottomNav'));
import BottomNav from 'navigation/BottomNav';
// const Logout = lazy(() => import('navigation/Logout'));
import Logout from 'navigation/Logout';
// const FloatingNav = lazy(() => import('navigation/FloatingNav'));
import FloatingNav from 'navigation/FloatingNav';


// ------------ Main Pages -----------

// const Details = lazy(() => import('pages/Details'));
import Details from 'pages/Details';
// const LoadingUserInfo = lazy(() => import('pages/LoadingUserInfo'));
import LoadingUserInfo from 'pages/LoadingUserInfo';
// const MainPageContent = lazy(() => import('pages/MainPageContent'));
import MainPageContent from 'pages/MainPageContent';
// const Dashboard = lazy(() => import('pages/Dashboard'));
import Dashboard from 'pages/Dashboard';



import Typography from 'pages/utils/Typography';


// ------------ Main Pages - Lazy loading -----------

const AddWizard = lazy(() => import('pages/addWizard/AddWizard'));
// import AddWizard from 'pages/addWizard/AddWizard';
const AddFromBarcode = lazy(() => import('pages/AddFromBarcode'));
// import AddFromBarcode from 'pages/AddFromBarcode';


// ------------ Login / Register Pages - Lazy loading -----------

const LoginForm = lazy(() => import('pages/LoginForm'));
// import LoginForm from 'pages/LoginForm';
const ChooseHome = lazy(() => import('pages/ChooseHome'));
// import ChooseHome from 'pages/ChooseHome';
const RegisterWizard = lazy(() => import('pages/registerWizard/RegisterWizard'));
// import RegisterWizard from 'pages/registerWizard/RegisterWizard';


// ------------ Misc Pages - Lazy loading -----------

const About = lazy(() => import('pages/About'));
// import About from 'pages/About';



//
// ------------------------  404 minimal page  -------------------------
//

const NotFound = () => <h2>404 error - This page has not been found!</h2>;




const styles = () => ({
  divStyle: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  containerStyle: {
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    paddingBottom: 0,
  },
  stickToBottom: {
  },
});







const App = ({
  // From Redux:
  autologin,
  name,
  language,
  home,
  loggedIn,
  density,
  navigationStyle,

  // From other HOC
  classes,
}) => {



  //
  // -------------------- Init -------------------- 
  //

  // Run only once
  // Try to auto-login
  const dispatch = useDispatch();
  useEffect(
    () => dispatch(autologin()),
    [dispatch, autologin] // ==> generates a warning on the console, but only way found to have it executed only once!
  );
  
  if(!language){ console.log('[App] No language!');  return null; }

  console.debug("[App] 0: loggedIn:", loggedIn, ", home: ", home, ", language: ", language);

  return (
    <SnackbarProvider 
      maxSnack={3}
      hideIconVariant
    >
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <IntlProvider
            locale={language}
            defaultLocale="en"
            key={language}
            messages={translations[language]}
          >     
            <> 
              <Notifier />

              {/* process.env.PUBLIC_URL is defined in package.json / homepage.
                  here, it's either "" (dev) or "." (prod)
               */}
              <Router basename={process.env.PUBLIC_URL}>
              <Suspense fallback={<div>Loading...</div>}>

                <div className={classes.divStyle}>

                  <Header />
                  <div className={clsx(
                    classes.containerStyle, 
                    density === 1 && classes.containerStyleDensity1,
                    density === 2 && classes.containerStyleDensity2,
                    density === 3 && classes.containerStyleDensity3,
                  )}>
                    <Switch>
                      <Route
                        exact path="/dashboard"
                        component={Dashboard}
                      />
                      <Route
                        exact path="/details/:id"
                        component={Details}
                      />
                      <Route
                        exact path="/new/:id"
                        component={Details}
                      />
                      <Route
                        exact path="/add"
                        component={AddWizard}
                      />
                      <Route
                        exact path="/addFromBarcode"
                        component={AddFromBarcode}
                      />
                      <Route
                        exact path="/typography"
                        component={Typography}
                      />                      
                      <Route
                        exact path="/register"
                        component={RegisterWizard}
                      />
                      <Route
                        exact path="/choosehome"
                        component={ChooseHome}
                      />                      
                      <Route
                        exact path="/login"
                        component={LoginForm}
                      />
                      <Route
                        exact path="/logout"
                        component={Logout}
                      />
                      <Route
                        exact path="/about"
                        component={About}
                      />
                      <Route
                        exact path="/"
                        render={() => { 
                          console.debug("[App] Route / - loggedIn:", loggedIn, ", home: ", home, ", language: ", language);
                          if(loggedIn) {

                            // User exists but has not chosen his home yet: ask him to choose!
                            // if(!home) return <Container><ChooseHome /></Container>;
                            if(!home){
                              console.debug('[>>> App ------>>>----- choosehome >>>] Reason: no home defined');
                              return <Redirect to='/choosehome'/>
                            }

                            // Token exists, but no name --> in userinfo loading process:
                            if(!name) return <LoadingUserInfo /> ;
                            
                            // Authenticated users see their dashboard:
                            // return <Dashboard />;
                            console.debug('[>>> App ------>>>----- dashboard >>>] Reason: Authenticated user');
                            return <Redirect to='/dashboard'/>


                          } else {
                            // Non logged users see generic page:
                            return <MainPageContent />;
                          }
                        }}
                      />
                      <Route
                        exact path="*"
                        component={NotFound}
                      
                      />
                    </Switch>          
                  {/* </Container> */}
                  </div>

                  { !loggedIn && <Footer />}
                  { loggedIn && navigationStyle === NavigationStyle.NAVIGATION_BOTTOMNAV && 
                    <BottomNav density={density} className={classes.stickToBottom} /> }
                  { loggedIn && navigationStyle === NavigationStyle.NAVIGATION_FLOATING && 
                    <FloatingNav /> }                              

                </div>
              </Suspense>
              </Router>
            </>
          </IntlProvider>              
        </MuiPickersUtilsProvider>
      </SnackbarProvider>
  );
}

function mapStateToProps(state) {
  // console.debug("mapStateToProps: ", state);
  if(!state.user)
    return {
      loggedIn: false,
      language: "en",
      name: null,
      home: null,
      navigationStyle: null,
      density: 2,
    };
  return {
    loggedIn: state.user.loggedIn,
    language: state.user.language,
    name: state.user.name,
    home: state.user.home,
    navigationStyle: state.user.navigationStyle,
    density: state.user.density,
  };
}

function mapDispatchToProps() {
  return {
    autologin: userActions.autologin
  }
}

const connectedApp = connect(mapStateToProps, mapDispatchToProps)(App);

export default withMyTheme(withStyles(styles)(connectedApp));
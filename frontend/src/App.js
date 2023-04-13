import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import { Route } from "react-router-dom";
import GetAllGroups from "./components/SeeAllGroupsPage";
import GetAllGroupDetails from "./components/GetAllGroupDetailsPage";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import CreateGroup from "./components/Forms/CreateGroup/CreateGroup";


function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user)
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  console.log("SESSION USER IS...", sessionUser)

  return (
    <>
      <Navigation isLoaded={isLoaded} />

      {isLoaded && <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/groups">
          <GetAllGroups />
        </Route>
        <Route exact path="/groups/new">
          < CreateGroup sessionUser={sessionUser}></CreateGroup>
        </Route>
        <Route exact path="/groups/:groupId">
          <GetAllGroupDetails sessionUser={sessionUser}></GetAllGroupDetails>
        </Route>
        
      </Switch>}
    </>
  );
}

export default App;

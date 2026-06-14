import React from "react";
import { Route, Switch } from "react-router-dom";

function NoAuth(props) {
  return (
    <Switch>
      {props.routes.map((prop, key) => (
          <Route
            path={prop.path}
            component={prop.component}
            key={key}
          />
        ))}
    </Switch>
  );
}

export default NoAuth;

import React from "react";
import { Router } from "@reach/router";
import Error from "app/pages/Error";
import { useUsers } from "contexts/UsersContext";
import Surveys from "app/pages/Surveys";
import Editor from "app/pages/Editor";
import Preview from "app/pages/Preview";

const Admin = () => {
  const { user } = useUsers();

  if (!user.roles.admin) return <Error message="401: Unauthorised" />;

  return (
    <Router>
      <Surveys path="/" />
      <Editor path="/survey/:id" />
      <Preview path="/survey/:id/preview" />
      <Error message="404: Not Found" default />
    </Router>
  );
};

export default Admin;
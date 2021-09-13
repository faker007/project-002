import { useEffect } from "react";
import { useState } from "react";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { Campus } from "../pages/Campus";
import { Message } from "../pages/Message";
import { CampusAbout } from "../pages/CampusAbout";
import { CampusDetail } from "../pages/CampusDetail";
import { CampusMedia } from "../pages/CampusMedia";
import { CampusMembers } from "../pages/CampusMembers";
import { Forum } from "../pages/Forum";
import { ForumCreatePost } from "../pages/ForumCreatePost";
import { ForumDetail } from "../pages/ForumDetail";
import { ForumPostDetail } from "../pages/ForumPostDetail";
import { Home } from "../pages/Home";
import { UserObjTypes } from "../types/UserObj.types";
import { routes } from "../utils/constants";
import { authService } from "../utils/firebase";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { LogIn } from "./LogIn";

export const Router: React.FC = () => {
  const [loginMode, setLoginMode] = useState(false);
  const [userObj, setUserObj] = useState<UserObjTypes>({
    email: "",
    name: "",
    uid: "",
  });

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj({
          uid: user.uid,
          email: user.email,
          name: user.displayName,
        });
      } else {
        setUserObj({ uid: "", name: "", email: "" });
      }
    });
  }, []);

  return (
    <BrowserRouter>
      <Header loginModeType={{ loginMode, setLoginMode }} userObj={userObj} />
      <Switch>
        <Route path={routes.home} exact>
          <Home />
        </Route>
        <Route path={routes.campus}>
          <Campus />
        </Route>
        <Route path={routes.forum} exact>
          <Forum />
        </Route>
        <Route path={routes.campusDetail()}>
          <CampusDetail />
        </Route>
        <Route path={routes.campusMembers()}>
          <CampusMembers />
        </Route>
        <Route path={routes.campusMedia()}>
          <CampusMedia />
        </Route>
        <Route path={routes.campusAbout()}>
          <CampusAbout />
        </Route>
        <Route path={routes.forumDetail()} exact>
          <ForumDetail />
        </Route>
        <Route path={routes.forumCreatePost()} exact>
          <ForumCreatePost />
        </Route>
        <Route path={routes.forumCreateQuestion()} exact>
          <ForumCreatePost />
        </Route>
        <Route path={routes.forumPostDetail()} exact>
          <ForumPostDetail />
        </Route>
        <Route path={routes.forumPostDetail()} exact>
          <ForumPostDetail />
        </Route>
        <Route path={routes.message} exact>
          <Message />
        </Route>
      </Switch>
      {loginMode && <LogIn loginMode={loginMode} setLoginMode={setLoginMode} />}
      <Footer />
    </BrowserRouter>
  );
};

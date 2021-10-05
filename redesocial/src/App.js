import { Route, Switch } from "react-router";
import { Row, Col, Container } from 'react-bootstrap';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PerfilPage from "./pages/PerfilPage";
import Header from "./components/Header";
import Layout from "./components/Layout";
import Contas from "./pages/Contas";
import Conta from "./pages/Conta";
import PostPage from "./pages/PostPage";
import NotificationPage from "./pages/NotificationPage";
import { UserContextProvider } from "./store/user-context";
import { CommentContextProvider } from "./store/comment-context";

function App() {
  return (
    <Layout>
      <Row>
        <Col xs={2} sm={1}><Header /></Col>
        <UserContextProvider><CommentContextProvider>
        <Switch>
          <Col xs={10} sm={11}>
            <Container>
              <Route exact path="/">
                <HomePage />
              </Route>
              <Route path="/perfil">
                <PerfilPage />
              </Route>
              <Route path="/login">
                <LoginPage />
              </Route>
              <Route exact path="/contas">
                <Contas />
              </Route>
              <Route exact path="/conta">
                <Conta />
              </Route>
              <Route exact path="/post">
                <PostPage />
              </Route>
              <Route exact path="/notification">
                <NotificationPage />
              </Route>
            </Container>
          </Col>
        </Switch>
        </CommentContextProvider></UserContextProvider>
      </Row>
    </Layout>
  );
}

export default App;

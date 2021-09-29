import { Route, Switch } from "react-router";
import { Row, Col, Container } from 'react-bootstrap';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import PerfilPage from "./pages/PerfilPage";
import Header from "./components/Header";
import Layout from "./components/Layout";
import Contas from "./pages/Contas";
import Conta from "./pages/Conta";
import { UserContextProvider } from "./store/user-context";

function App() {
  return (
    <Layout>
      <Row>
        <Col xs={2} sm={1}><Header /></Col>
        <UserContextProvider>
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
            </Container>
          </Col>
        </Switch>
        </UserContextProvider>
      </Row>
    </Layout>
  );
}

export default App;

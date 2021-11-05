import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import Store from './store';
import { Login, Signup, Wall, Manage } from './pages';
import { Header } from './components';
import './App.scss';

function App() {

  return (
    <Provider store={Store}>
      <div className="App">
        <Router>
          <Header />
          <Switch>
            <Route path="/wall" >
              <Wall />
            </Route>
            <Route path="/signup" >
              <Signup />
            </Route>
            <Route path="/manage">
              <Manage />
            </Route>
            <Route path="/">
              <Login />
            </Route>
          </Switch>
        </Router>
      </div>
    </Provider>
  );
}

export default App;

// import './App.css';
import {BrowserRouter, Switch, Route } from 'react-router-dom';
import ListAssignment from './ListAssignment';
import GradeAssignment from './GradeAssignment';
import AddAssignment from './AddAssignment';
import EditAssignment from './EditAssignment';

function Gradebook() {
  return (
    <div className="App">
      <h2>Gradebook</h2>
      <BrowserRouter>
          <div>
            <Switch>
              <Route exact path="/" component={ListAssignment} />
              <Route path="/gradeAssignment" component={GradeAssignment} />
              <Route path="/addAssignment" component={AddAssignment} />
              <Route path="/editAssignment" component={EditAssignment} />
              <Route render={ () => <h1>Page not found</h1>} />
            </Switch>
          </div>
        </BrowserRouter>
    </div>
  );
}

export default Gradebook;

import { createContext } from 'react'
import { Switch, Route } from 'react-router'
import { BrowserRouter as Router } from 'react-router-dom'
import './App.css';
import Layout from './component/Layout';
import Login from './component/Login';
import Main from './component/pages/main';
import NotFound from './component/pages/errors/notFound';
import Profile from './component/pages/Profile';
import ChangePassword from './component/pages/Profile/changePassword';
import authStore from './store/authStore';
import StudentList from './component/pages/admin/studentList';
import TeacherList from './component/pages/admin/teacherList';
import CourseList from './component/pages/admin/courseList';
import DepartmentList from './component/pages/admin/departmentList';
import SemesterList from './component/pages/admin/semesterList';
import OpenCourse from './component/pages/teacher/openCourse';
import OpenedCourses from './component/pages/teacher/openedCourses';
import AdminOpenedCourses from './component/pages/admin/adminOpenedCourses';
import SelectCourse from './component/pages/student/selectCourse';
import SelectedCourse from './component/pages/student/selectedCourse';
import EnrolledCourse from './component/pages/student/enrolledCourse';


const AuthContext = createContext()

function App() {
  return (
    <AuthContext.Provider value={new authStore()}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Layout>
              <Main />
            </Layout>
          </Route>
          <Route path={["/teacher", "/student", "/admin", "/profile"]}>
            <Layout>
              <Switch>
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/profile/changePassword" component={ChangePassword} />
                <Route exact path="/admin/students" component={StudentList} />
                <Route exact path="/admin/teachers" component={TeacherList} />
                <Route exact path="/admin/courses" component={CourseList} />
                <Route exact path="/admin/departments" component={DepartmentList} />
                <Route exact path="/admin/semesters" component={SemesterList} />
                <Route exact path="/admin/opens" component={AdminOpenedCourses} />
                <Route exact path="/teacher/openCourse" component={OpenCourse} />
                <Route exact path="/teacher/courses" component={OpenedCourses} />
                <Route exact path="/student/selectCourse" component={SelectCourse} />
                <Route exact path="/student/selectedCourses" component={SelectedCourse} />
                <Route exact path="/student/currentCourses" component={EnrolledCourse} />
              </Switch>
            </Layout>
          </Route>
          <Route exact path="/login" component={Login} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </AuthContext.Provider>
  );
}

export default App;
export { AuthContext };

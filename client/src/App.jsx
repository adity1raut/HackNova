import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from "../src/context/AuthContext";
import PrivateRoute from '../src/utils/PrivateRoute'
import ProfilePage from './pages/Main/ProfilePagesss'
import Navbar from './pages/Navbar/Navbar'
import Dhasboard from './pages/Main/Dhasboard';
import ForgetPassFrom from './pages/Forms/ForgetPassFrom';
import ComplaintsForm from "./components/Forms/ComplaintsForm";
import LeaveApplicationForm from './components/Forms/LeaveApplicationForm';
import FacultyAvailabilityForm from './components/Other/FacultyAvailabilityForm';
import StudentSignUp from "./pages/Forms/StudentSignUp"
import GroundBooking from './components/Forms/GroundBooking';
import VenueDetails from './components/Details/VenueDetails';
import FacultySignup from "./pages/Forms/FacultySignForm"
import LoginPage from './pages/Main/LoginPage';
import SignUpPage from './pages/Main/SignUpPage';
import AdmiLogin from './pages/Forms/AdmiLogin';
import LoginForm from './pages/Forms/StudentLogin';
import FacultyLogin from './pages/Forms/FacultyLogin';
import AdminBookingDashboard from './components/Admin/AdminBookingDashboard';
import AdminComplaintsDashboard from './components/Admin/AdminComplaintsDashboard';
import AdminLeaveDashboard from './components/Admin/AdminLeaveDashboard';
import FacultyProfile from "./pages/Main/FalcultyProfile"
import Footer from './pages/Main/Footer';
import LeaveApplication from './StudentDashBord/LeavApllication';
import ComplaintPage from './StudentDashBord/ComplaintsPage';
import BookingCard from './StudentDashBord/VenueBooking';
import FacultyBook from './StudentDashBord/FacultyBook'; 
import AdmiDhashbordPage from "./AdminDhasBord/AdmiDhashbordPage"
import MakingAttendance from "./components/MakingAttendance"
import AttendanceVisualise from "./components/AttendanceVisualise"
import SecetrySingin from './pages/Forms/SecetrySingin';
import AdminProfileCard from './pages/Profile/AdminProfileCard';
import NoticeBord  from "./components/Forms/NoticeBord"
import NoticeList from './components/Forms/NoticeList';
import HomePage from './pages/Main/Home';
import StudentAssignments from "./ClassRoom/pages/StudentAssignments"
import StudentDashboard from './pages/student/StudentDashboard';
import FacultyDashboard from './pages/Main/FacultyDashbord';
import AssignmentPage from './ClassRoom/pages/CreateAssignment';
import AdminDashboard from './ClassRoom/pages/AdminAssignments';
import AdminManageTimeTable from "./components/Admin/AdminAddTimeTable"
import AdminAcademicTerm from "./components/Admin/AdminAcademicTerm"
import AcademicCalendar from './AdminDhasBord/AcademicCalendar';
import TimeScheduler from './AdminDhasBord/TimeScheduler';

function App() {
  return (
    <div>
      <AuthProvider>
        <BrowserRouter>
          <div className='min-h-screen'>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/signin" element={<SignUpPage />} />
              <Route path="/signin/student" element={<StudentSignUp />} />
              <Route path="/signin/faculty" element={<FacultySignup />} />
              <Route path="/signin/secetry" element={<SecetrySingin/>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/login/faculty" element={<FacultyLogin />} />
              <Route path="/login/student" element={<LoginForm />} />
              <Route path="/login/admin" element={<AdmiLogin />} />
              <Route path="/forgot-password" element={<ForgetPassFrom />} />
              <Route element={<PrivateRoute />}>

                <Route path="/dashboard" element={<Dhasboard />} />
                <Route path='/dashboard/booking-details' element={<BookingCard />} />
                <Route path='/dashboard/leave-details' element={<LeaveApplication />} />
                <Route path='/dashboard/complaint-details' element={<ComplaintPage />} />
                <Route path='/dashboard/faculty-details' element={<FacultyBook/>} />
                <Route path='/dashboard/notice' element={<NoticeBord />} />
                <Route path='/dashboard/assignment' element={ <StudentAssignments />} />
                <Route path="/student/profile" element={<ProfilePage />} />
                <Route path="/student/complaints" element={<ComplaintsForm />} />
                <Route path="/student/leave-application" element={<LeaveApplicationForm />} />
                <Route path='/student/attendence' element={<AttendanceVisualise />} />
                <Route path="/bookings" element={<GroundBooking />} />


                <Route path='/faculty/dashboard' element={<FacultyDashboard/>} />
                <Route path="/faculty/dashboard/assignment" element={<AssignmentPage />} />
                <Route path='/faculty/dashboard/grade' element={<AdminDashboard/>} />
                <Route path='/faculty/dashboard/booking-details' element={<BookingCard />} />
                <Route path='/faculty/dashboard/leave-details' element={<LeaveApplication />} />
                <Route path='/faculty/dashboard/complaint-details' element={<ComplaintPage />} />
                <Route path='/faculty/dashboard/faculty-details' element={<FacultyBook/>} />
                <Route path='/faculty/profile' element={<FacultyProfile />} />
                <Route path="/faculty/availability" element={<FacultyAvailabilityForm />} />
                <Route path='/faculty/make-attendece' element={<MakingAttendance/>} />


                <Route path="/bookings/details/:name" element={<VenueDetails />} />
                <Route path='/calender' element={<AcademicCalendar />} />
                <Route path='/time-schedule' element={<TimeScheduler />} />


                <Route path='/admin-dashboard/' element={<AdmiDhashbordPage />} />
                <Route path='/admin/dashboard/complaints' element={<AdminComplaintsDashboard />} />
                <Route path='/admin/dashboard/leaves' element={<AdminLeaveDashboard />} />
                <Route path='/admin/dashboard/booking' element={<AdminBookingDashboard />} />
                <Route path='/admin/profile' element={<AdminProfileCard />} />
                <Route path='/admin/dashboard/timetable' element={<AdminManageTimeTable />} />
                <Route path='/admin/dashboard/term' element={<AdminAcademicTerm />} />

                <Route path='/admin/dashboard/notices' element={<NoticeList />} />
              </Route>

              <Route path="/event/student" element={<StudentDashboard />} />
              <Route path='/event/faculty' element={<FacultyDashboard />} />
            </Routes>
          </div>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </div>
  )
}

export default App

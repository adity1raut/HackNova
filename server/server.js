import express from 'express';
import bodyParser from 'body-parser';
import ConnectDB from "./db/ConnectDB.js";
import userLogin from "./routes/LoginRoute.js";
import useSignin from "./routes/SignUpRoute.js";
import useForgetPass from "./routes/ForgetPassRoute.js";
import useElection from "./routes/ElectionRoute.js"
import useComplaint from "./routes/CompleteRoute.js"
import useBooking from "./routes/BookingRoute.js"
import useFacultySignup from "./routes/Faculty/FacultySignRoute.js"
import useFacultyLogin from "./routes/Faculty/FacultyLogin.js"
import usefacultyAvaibility from "./routes/Faculty/FacultyRoute.js"
import useLeave from "./routes/LeavRoute.js"
import useEvent from "./routes/EventRoute.js"
import useCheating from "./routes/CheatingRoute/CheatingRoute.js"
import useAssignment from "./routes/Assigment/Assigment.js"
import useUpdateAssigment from "./routes/Assigment/AdminRoute.js"
import useStudent from "./routes/Assigment/StudentSub.js"
import useNoticeBord from "./routes/CheatingRoute/NoticeBord.js"
import AccseToFaculty from "./routes/TimeTable/AccessToFacultyForAttendance.js"
import Addacadamic from "./routes/TimeTable/AddAcademicCalendor.js"
import AddTime from "./routes/TimeTable/AddTimeTable.js"
import Edittime from "./routes/TimeTable/EditTimeTable.js"
import GetAttendence from "./routes/TimeTable/GetAttendanceForVisualisation.js"
import Getcurrent from "./routes/TimeTable/GetCurrentLectureOfFaculty.js"
import GetTimetable from "./routes/TimeTable/GetTimeTable.js"
import MakeStudent from "./routes/TimeTable/MakeStudentAbsentOrPresent.js"
// import Onend from "./routes/TimeTable/OnEndOfSemester.js"
import ShowAcadamic from "./routes/TimeTable/ShowAcademicCalendor.js"
import Showtimetbale from "./routes/TimeTable/ShowTimeTable.js"
import env from 'dotenv';
import cors from "cors";



env.config();

const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(cors());

ConnectDB();
app.use(AccseToFaculty)
app.use(Addacadamic)
app.use(AddTime)
app.use(Edittime)
app.use(GetAttendence)
app.use(Getcurrent)
app.use(GetTimetable)
app.use(MakeStudent)
// app.use(Onend)
app.use(ShowAcadamic)
app.use(Showtimetbale)
app.use(userLogin);
app.use(useSignin);
app.use(useForgetPass);
app.use(useComplaint);
app.use(useElection);
app.use(useBooking)
app.use(useFacultySignup)
app.use(useLeave)
app.use(useEvent)
app.use(useFacultyLogin)
app.use(usefacultyAvaibility)
app.use(useCheating)
app.use(useAssignment)
app.use(useUpdateAssigment)
app.use(useStudent)
app.use(useNoticeBord)


const PORT = 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
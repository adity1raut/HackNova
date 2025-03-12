import express from 'express';
import bodyParser from 'body-parser';
import ConnectDB from "./db/ConnectDB.js";
import userLogin from "./routes/LoginRoute.js";
import useSignin from "./routes/SignUpRoute.js";
import useForgetPass from "./routes/ForgetPassRoute.js";
import useElection from "./routes/ElectionRoute.js"
import useComplaint from "./routes/CompleteRoute.js"
import useBooking  from "./routes/BookingRoute.js"
import useFacultySignup from "./routes/Faculty/FacultySignRoute.js"
import useFacultyLogin from "./routes/Faculty/FacultyLogin.js"
import usefacultyAvaibility from "./routes/Faculty/FacultyRoute.js"
import useLeave from "./routes/LeavRoute.js"
import useCheating from "./routes/CheatingRoute/CheatingRoute.js"
import useAssignment from "./routes/Assigment/Assigment.js"
import useUpdateAssigment from "./routes/Assigment/AdminRoute.js"
import useStudent from "./routes/Assigment/StudentSub.js"
import useNoticeBord from "./routes/CheatingRoute/NoticeBord.js"
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

app.use(userLogin);
app.use(useSignin);
app.use(useForgetPass);
app.use(useComplaint);
app.use(useElection);
app.use(useBooking)
app.use(useFacultySignup)
app.use(useLeave)
app.use(useFacultyLogin)
app.use(usefacultyAvaibility)
app.use(useCheating)
app.use(useAssignment)
app.use(useUpdateAssigment)
app.use(useStudent)
app.use(useNoticeBord)


const PORT = 4000 ;
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
# College Management Website

## Overview
The College Management Website is a comprehensive web-based solution designed to digitize and streamline academic and administrative operations within a college. This system provides role-based access for students, faculty, and administrators, ensuring efficient management of attendance, assignments, event scheduling, and more.

## Problem Statement
Managing college activities such as student records, faculty details, event scheduling, and fee payments is often done manually or through disconnected systems. This leads to inefficiency, miscommunication, and administrative burdens. The proposed system centralizes all these tasks into a single platform for improved efficiency and communication.

## Features
### Core Features
- **User Authentication & Role-Based Access**
  - Separate logins for Students, Faculty, and Admins
  - Secure JWT-based authentication
  - Profile management for all users

- **Attendance Tracking System**
  - Mark attendance digitally
  - View attendance records
  - Generate attendance reports

- **Assignment & Grade Management**
  - Upload and submit assignments
  - Auto or manual grading by faculty
  - Grade report generation

- **Digital Notice Board**
  - Admins can post important announcements
  - Students and faculty can view updates in real time

### Additional Features
- **Event Scheduling & Academic Calendar**
  - View upcoming events and important dates
  - Admins can add and modify schedules

- **Facility Booking System**
  - Book classrooms, labs, and auditoriums
  - Admin approval required for reservations

- **Leave Application & Approval System**
  - Students and faculty can request leaves
  - Admin can approve or reject leave requests

- **Complaint Management System**
  - Submit complaints regarding facilities or academics
  - Admins can track and resolve complaints

- **Timetable & Class Scheduling**
  - Students can view their class schedule
  - Faculty can update lecture timings

- **Real-Time Notifications**
  - Get instant updates on assignments, attendance, and notices
  - Email and in-app notifications supported


## Tech Stack
| Technology    | Stack                  |
|--------------|------------------------|
| Frontend     | React.js, Tailwind CSS  |
| Backend      | Node.js, Express.js     |
| Database     | MongoDB                 |
| Authentication | JWT-based authentication |

## Getting Started
### Prerequisites
Ensure you have the following installed:
- Node.js and npm
- MongoDB

### Installation & Setup
1. **Clone the repository**:
   ```sh
   git clone https://github.com/adity1raut/HackNova/tree/master
   ```
2. **Navigate to the project directory**:
   ```sh
   cd hacknova
   ```
3. **Setup frontend**:
   ```sh
   cd client
   npm install
   npm run dev
   ```
4. **Setup backend**:
   ```sh
   cd server
   npm install
   npm start
   ```
5. **Configure the database**:
   - Ensure MongoDB is running.
   - Update the `.env` file with your database credentials.



.

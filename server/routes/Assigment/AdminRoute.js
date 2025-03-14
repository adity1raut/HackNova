import express from 'express';
import Assignment from '../../models/Create-assignment.js';
import StudentAssignment from '../../models/StudentAssignment.model.js';
import User from "../../models/User.models.js";

const router = express.Router();

// Admin route to fetch all student submissions
router.get('/api/admin/submissions', async (req, res) => {
  try {
    // Optionally filter by status, assignment, or date range
    const { status, assignmentId, startDate, endDate } = req.query;
    
    let query = {};
    
    // Apply filters if provided
    if (status) {
      query.status = status;
    }
    
    if (assignmentId) {
      query.assignment = assignmentId;
    }
    
    if (startDate || endDate) {
      query.submissionDate = {};
      if (startDate) {
        query.submissionDate.$gte = new Date(startDate);
      }
      if (endDate) {
        query.submissionDate.$lte = new Date(endDate);
      }
    }
    
    const submissions = await StudentAssignment.find(query)
      .populate('assignment')
      .sort({ submissionDate: -1 });
      
    res.status(200).json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    res.status(500).json({
      message: 'Failed to fetch submissions',
      error: error.message
    });
  }
});

// Admin route to get a specific submission by ID
router.get('/api/admin/submissions/:id', async (req, res) => {
  try {
    const submission = await StudentAssignment.findById(req.params.id)
      .populate('assignment');
      
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    res.status(200).json(submission);
  } catch (error) {
    console.error('Error fetching submission:', error);
    res.status(500).json({
      message: 'Failed to fetch submission',
      error: error.message
    });
  }
});

// Admin route to update submission (grade and feedback)
router.put('/api/admin/submissions/:id', async (req, res) => {
  try {
    const { grade, feedback, status } = req.body;
    
    // Find the submission
    const submission = await StudentAssignment.findById(req.params.id);
    
    if (!submission) {
      return res.status(404).json({ message: 'Submission not found' });
    }
    
    // Update the submission
    if (grade !== undefined) submission.grade = grade;
    if (feedback !== undefined) submission.feedback = feedback;
    if (status !== undefined) submission.status = status;
    
    // Save the updated submission
    await submission.save();
    
    res.status(200).json({
      message: 'Submission updated successfully',
      submission
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    res.status(500).json({
      message: 'Failed to update submission',
      error: error.message
    });
  }
});

// Admin route to get assignment statistics
router.get('/api/admin/statistics', async (req, res) => {
  try {
    // Get total assignments
    const totalAssignments = await Assignment.countDocuments();
    
    // Get total submissions
    const totalSubmissions = await StudentAssignment.countDocuments();
    
    // Get submissions by status
    const submittedCount = await StudentAssignment.countDocuments({ status: 'submitted' });
    const gradedCount = await StudentAssignment.countDocuments({ status: 'graded' });
    const inProgressCount = await StudentAssignment.countDocuments({ status: 'in-progress' });
    
    // Get recent submissions (last 7 days)
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    
    const recentSubmissions = await StudentAssignment.countDocuments({
      submissionDate: { $gte: lastWeek }
    });
    
    // Get assignments by due date status
    const now = new Date();
    const upcomingAssignments = await Assignment.countDocuments({
      dueDate: { $gt: now }
    });
    
    const overdueAssignments = await Assignment.countDocuments({
      dueDate: { $lt: now }
    });
    
    // Get submission rate - how many students have submitted vs total students
    const totalStudents = await User.countDocuments({ role: 'student' });
    const submittedStudents = await StudentAssignment.distinct('email').length;
    const submissionRate = totalStudents > 0 ? Math.round((submittedStudents / totalStudents) * 100) : 0;
    
    res.status(200).json({
      totalAssignments,
      totalSubmissions,
      submissionsByStatus: {
        submitted: submittedCount,
        graded: gradedCount,
        inProgress: inProgressCount
      },
      recentSubmissions,
      upcomingAssignments,
      overdueAssignments,
      submissionRate
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
});

// Admin route to download submissions report
router.get('/api/admin/submissions/export', async (req, res) => {
  try {
    const submissions = await StudentAssignment.find()
      .populate('assignment')
      .sort({ submissionDate: -1 });

    // Format data for CSV export
    const csvData = [
      // CSV Header
      ['ID', 'Student Email', 'Assignment', 'Submission Date', 'Status', 'Grade', 'Feedback', 'File URL']
    ];

    // Add submission data rows
    submissions.forEach(sub => {
      csvData.push([
        sub._id.toString(),
        sub.email,
        sub.assignment ? sub.assignment.title : 'Unknown Assignment',
        new Date(sub.submissionDate).toISOString(),
        sub.status,
        sub.grade || 'Not graded',
        sub.feedback || '',
        sub.file.url
      ]);
    });

    // Convert to CSV format
    const csvContent = csvData.map(row => row.join(',')).join('\n');
    
    // Set headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=submissions-report.csv');
    
    res.status(200).send(csvContent);
  } catch (error) {
    console.error('Error exporting submissions:', error);
    res.status(500).json({
      message: 'Failed to export submissions',
      error: error.message
    });
  }
});

export default router;
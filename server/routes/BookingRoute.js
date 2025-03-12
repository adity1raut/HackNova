import express from "express";
import Booking from "../models/Booking.models.js";
import { body, param, validationResult } from "express-validator";

const router = express.Router();

// Enhanced validation middleware
const validateBooking = [
  body("name")
    .notEmpty()
    .trim()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 100 })
    .withMessage("Name must be between 2 and 100 characters"),

  body("email")
    .isEmail()
    .trim()
    .normalizeEmail()
    .withMessage("Valid email is required"),

  body("phone")
    .matches(/^[\d-+() ]{10,15}$/)
    .withMessage("Please enter a valid phone number")
    .trim(),

  body("date")
    .notEmpty()
    .withMessage("Start date is required")
    .custom((value) => {
      const startDate = new Date(value);
      const today = new Date();
      if (startDate < today) {
        throw new Error("Start date cannot be in the past");
      }
      return true;
    }),

  body("lastdate")
    .optional()
    .custom((value, { req }) => {
      if (!value) return true;
      const startDate = new Date(req.body.date);
      const endDate = new Date(value);
      if (endDate < startDate) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),

  body("time")
    .notEmpty()
    .withMessage("Time is required")
    .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Please enter a valid time in HH:MM format"),

  body("message")
    .notEmpty()
    .trim()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Message must be between 10 and 500 characters"),

  body("venue")
    .notEmpty()
    .trim()
    .withMessage("Venue is required")
    .isIn(["Auditorium", "Classrooms", "Ground"])
    .withMessage("Invalid venue selection"),

  body("status")
    .optional()
    .isIn(["pending", "approved", "rejected", "cancelled"])
    .withMessage("Invalid status")
];

// Create new booking with enhanced error handling and validation
router.post("/api/booking", validateBooking, async (req, res) => {
  try {
    // Validation check
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }

    // Check for booking conflicts
    const existingBooking = await Booking.findOne({
      venue: req.body.venue,
      $or: [
        // Check if new booking overlaps with existing booking
        {
          date: req.body.date,
          time: req.body.time
        },
        // If lastdate is provided, check for date range overlap
        {
          $and: [
            { date: { $lte: req.body.lastdate || req.body.date } },
            { lastdate: { $gte: req.body.date } }
          ]
        }
      ],
      status: { $nin: ["cancelled", "rejected"] }
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "This venue is already booked for the selected date and time range"
      });
    }

    // Create and save new booking
    const newBooking = new Booking({
      ...req.body,
      status: "pending" // Ensure default status
    });

    await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({
      message: "Error creating booking",
      error: error.message
    });
  }
});


// Validation middleware for status update
const validateStatusUpdate = [
  param("id")
    .isMongoId()
    .withMessage("Invalid booking ID"),

  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["approved", "rejected"])
    .withMessage("Status must be either 'approved' or 'rejected'"),

  body("adminMessage")
    .optional()
    .isString()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Admin message must not exceed 500 characters")
];

// Get all bookings
router.get("/api/bookings/data", async (req, res) => {
  try {
    const bookings = await Booking.find(); // Fetch all bookings
    if (bookings.length === 0) {
      return res.status(404).json({ message: "No bookings found" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ message: "Failed to fetch bookings" });
  }
});

// Update booking status route
router.patch("/api/admin/booking/:id/status", validateStatusUpdate, async (req, res) => {
  try {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        message: "Validation failed",
        errors: errors.array()
      });
    }

    const { id } = req.params;
    const { status, adminMessage } = req.body;

    // Find the booking
    const booking = await Booking.findById(id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found"
      });
    }

    // Check if booking is already in a final state
    if (booking.status === "approved" || booking.status === "rejected") {
      return res.status(400).json({
        message: `Cannot update: Booking is already ${booking.status}`
      });
    }

    // If approving, check for conflicts again
    if (status === "approved") {
      const conflictingBooking = await Booking.findOne({
        _id: { $ne: id }, // Exclude current booking
        venue: booking.venue,
        status: "approved",
        $or: [
          {
            date: booking.date,
            time: booking.time
          },
          {
            $and: [
              { date: { $lte: booking.lastdate || booking.date } },
              { lastdate: { $gte: booking.date } }
            ]
          }
        ]
      });

      if (conflictingBooking) {
        return res.status(409).json({
          message: "Cannot approve: Time slot conflict with another approved booking"
        });
      }
    }

    // Update the booking
    const updatedBooking = await Booking.findByIdAndUpdate(
      id,
      {
        status,
        adminMessage: adminMessage || undefined,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.json({
      message: `Booking ${status} successfully`,
      booking: updatedBooking
    });

  } catch (error) {
    console.error("Booking status update error:", error);
    res.status(500).json({
      message: "Error updating booking status",
      error: error.message
    });
  }
});

// Get all bookings with optional filters route
router.get("/api/admin/bookings", async (req, res) => {
  try {
    const { status, venue, date, search } = req.query;

    // Build filter object
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (venue) {
      filter.venue = venue;
    }

    if (date) {
      filter.date = date;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    // Get bookings with filters
    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 }); // Most recent first

    res.json({
      bookings,
      count: bookings.length
    });

  } catch (error) {
    console.error("Fetch bookings error:", error);
    res.status(500).json({
      message: "Error fetching bookings",
      error: error.message
    });
  }
});

export default router;
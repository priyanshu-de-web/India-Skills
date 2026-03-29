const Submission = require("../model/Submission");

const submitContact = async (req, res) => {
  try {
    const { name, email, country, interests, message } = req.body;

    // Validate required fields
    if (!name || !name.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter your name",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid email",
      });
    }

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Tell us a bit about your plans",
      });
    }

    // Sanitize inputs - strip HTML tags
    const sanitize = (str) => (str ? str.replace(/<[^>]*>/g, "").trim() : "");

    const submission = await Submission.create({
      name: sanitize(name),
      email: sanitize(email),
      country: sanitize(country),
      interests: sanitize(interests),
      message: sanitize(message),
      submitted_at: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Thanks! We've received your request.",
      data: submission,
    });
  } catch (error) {
    console.log("Submit Contact Error: ", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = { submitContact };

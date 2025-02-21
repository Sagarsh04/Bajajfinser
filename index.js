const path = require("path")
const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const USER_ID = "sagar_sh_2005";
const EMAIL = "sharmasagar8407@gmail.com";
const ROLL_NUMBER = "22BCS17062";


const __dirname = path.resolve();
// Validation middleware
const validateRequest = (req, res, next) => {
  const { data } = req.body;
  
  if (!data || !Array.isArray(data)) {
    return res.status(400).json({
      is_success: false,
      message: "Invalid request: 'data' must be an array"
    });
  }

  // Validate that all items are either numbers or single letters
  const invalidItems = data.filter(item => {
    const isNumber = /^\d+$/.test(item);
    const isSingleLetter = /^[A-Za-z]$/.test(item);
    return !isNumber && !isSingleLetter;
  });

  if (invalidItems.length > 0) {
    return res.status(400).json({
      is_success: false,
      message: "All items must be either numbers or single letters"
    });
  }

  next();
};

app.post("/bfhl", validateRequest, (req, res) => {
  try {
    const { data } = req.body;

    // Process numbers (only string numbers)
    const numbers = data.filter(item => /^\d+$/.test(item));

    // Process alphabets (single letters only)
    const alphabets = data.filter(item => /^[A-Za-z]$/.test(item));

    // Find highest alphabet (case insensitive)
    const highestAlphabet = alphabets.length > 0 
      ? [alphabets.reduce((highest, current) => {
          return current.toUpperCase() > highest.toUpperCase() ? current : highest;
        })]
      : [];

    res.status(200).json({
      is_success: true,
      user_id: USER_ID,
      email: EMAIL,
      roll_number: ROLL_NUMBER,
      numbers,
      alphabets,
      highest_alphabet: highestAlphabet
    });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({
      is_success: false,
      message: "Internal server error"
    });
  }
});

app.get("/bfhl", (req, res) => {
  res.status(200).json({ operation_code: 1 });
});

app.use(express.static(path.join(__dirname, "/vite-project/dist")));

app.get("*", (req, res) => {
	res.sendFile(path.join(__dirname, "vite-project", "dist", "index.html"));
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
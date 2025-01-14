const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const PORT = 4000;

const app = express();
app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));


mongoose.connect("mongodb://127.0.0.1:27017/offlinedb")
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const userSchema = new mongoose.Schema({
    name: String,
    roll: String,
    cls: String,
})

const Users = mongoose.model("students", userSchema);

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "one.html"));
});

app.get("/two.html", (req, res) => {
  res.sendFile(path.join(__dirname, "two.html"));
});

app.post("/post", async (req, res) => {
    const {name, roll, cls} = req.body;
    const user = new Users({
        name,
        roll,
        cls
    })
    await user.save();
    console.log("Student added:", user);
    res.redirect("/two.html");
});

app.get("/studentsDetails", async (req, res) => {
  try {
      const students = await Users.find({}, { name: 1, roll: 1, cls: 1, _id: 0 });
      res.status(200).json(students);
  } catch (err) {
      res.status(500).json({ message: "Failed to fetch students", error: err });
  }
});

// Delete student record by ID
app.delete("/deleteStudent/:roll", async (req, res) => {
  try {
      const { roll } = req.params;
      await Users.findByIdAndDelete(roll);
      res.status(200).send("Student deleted successfully");
  } catch (err) {
      res.status(500).send("Failed to delete student");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
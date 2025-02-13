const Library = require("../models/libraryModel");
exports.addLibrary = async (req, res) => {
  const { name, location, description, openingHours, fees, totalSeats, lockersAvailable } = req.body;

  try {
    const library = new Library({
      name,
      location,
      description,
      openingHours,
      fees,
      totalSeats,
      availableSeats: totalSeats, // Available seats ko total seats ke barabar rakhenge initially
      lockersAvailable,
      availability: totalSeats > 0, // Agar total seats > 0 hai to available
      shifts: ["Morning", "Afternoon", "Evening"], // Default shifts add ki
    });

    await library.save();
    res.status(201).json({ message: "Library added successfully", library });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Get all libraries
exports.getLibraries = async (req, res) => {
  try {
    const libraries = await Library.find();
    res.json(libraries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 📌 Update library details
exports.updateLibrary = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const library = await Library.findByIdAndUpdate(id, updates, { new: true });
    if (!library) return res.status(404).json({ message: "Library not found" });

    res.json({ message: "Library updated successfully", library });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

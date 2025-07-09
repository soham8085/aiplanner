import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/genai"; // 👈 different import path

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

app.post("/generate-trip", async (req, res) => {
  try {
    const { city, totalHours, budget, foodPreference, activityPreference } = req.body;

    const prompt = `Generate Travel Plan for Location: ${city}, for ${totalHours} Hours with a ${budget} budget, food preference is ${foodPreference} and activity is ${activityPreference}. Give me restaurant options with restaurantName, restaurantAddress, priceRange, restaurantImageUrl, geoCoordinates, rating, description and suggest itinerary with placeName, placeDetails, placeImageUrl, geoCoordinates, ticketPricing, estimatedTravelTime, bestTimeToVisit in JSON format.`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    res.json({ output: text });
  } catch (error) {
    console.error("Generation error:", error);
    res.status(500).json({ error: "Failed to generate travel plan." });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

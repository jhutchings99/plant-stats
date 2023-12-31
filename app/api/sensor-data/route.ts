import mongoDbClient from "@/app/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await mongoDbClient();
    const db = client.db("plant-stats");
    const collection = db.collection("stats");

    const data = await collection.find({}).toArray();

    return Response.json(data, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Error connecting to database" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = await mongoDbClient();
    const db = client.db("plant-stats");
    const collection = db.collection("stats");

    console.log("Received data:", req.body); // Log the received data

    const newStat = await req.json();
    console.log("Inserting data:", newStat); // Log the data before insertion

    const result = await collection.insertOne(newStat);
    console.log("Insertion result:", result); // Log the result of the insertion

    return Response.json({ insertedId: result.insertedId, status: 201 });
  } catch (error) {
    console.error("Database error:", error); // Log any errors
    return Response.json({ message: "Error connecting to database", status: 500 });
  }
}



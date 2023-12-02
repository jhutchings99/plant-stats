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

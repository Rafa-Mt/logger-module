import { Router } from "express";
import { getSnapshots } from "@/services/db";

const router = Router();

router.get("/", async (req, res) => {
    const snapshots = await getSnapshots()
    res.json({ snapshots });
})
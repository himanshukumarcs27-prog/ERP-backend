import express from "express";
import {
  generateClassResult,
  getMyResult,getLeaderboard,getSubjectGraph ,
} from "../../backend/controllers/resultController.js";

import { getClassAnalytics } from "../../backend/controllers/resultController.js";



const router = express.Router();

router.post("/generate-class", generateClassResult);

router.get("/leaderboard", getLeaderboard);
router.get("/subject-graph", getSubjectGraph);

router.get("/:student_id", getMyResult); 
router.get("/analytics", getClassAnalytics);


export default router;
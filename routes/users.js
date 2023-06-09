import express from "express";
import { updateUser,deleteUser,getUser,getUsers } from "../controllers/user.js";

import { verifyToken, verifyUser, verifyAdmin } from "../utils/verifyToken.js";

const router = express.Router();

router.get("/checkauthentication",verifyToken,(req,res,next)=>{
    res.send("hello user, you are logged in")
})
//update
router.put("/:id",verifyUser, updateUser)

//delete
router.delete("/:id", verifyUser, deleteUser)

//get
router.get("/:id",verifyUser, getUser)

//getall
router.get("/",verifyAdmin, getUsers)

export default router
import express from "express";
import { get } from "mongoose";
import { createproduct, deleteproduct, getallproducts, getproductbyid, updateproduct } from "../controllers/productcontroller.js";

const productrouter = express.Router();

productrouter.get("/" , getallproducts);
productrouter.post("/" , createproduct);
productrouter.delete("/:productid" , deleteproduct);
productrouter.put("/:productid" , updateproduct);
productrouter.get("/:productid" , getproductbyid);


export default productrouter;
import Product from "../models/Product.js";
import { isadmin } from "./UserControllers.js";

export function createproduct(req,res){

if(! isadmin(req)){
    res.status(403).json({
            message:"forbidden"
        })
        return
} 

const product = new Product(req.body)

product.save().then(
    ()=>{
        res.json({
            message : "product cretaed successfully"
        })
    }
)
.catch(
    (error)=>{
        res.status(500).json({
            message : "Errro creting product",
            error :error.message
        })
    }
)
}

export function getallproducts(req,res){
    if(isadmin(req)){
       Product.find()
            .then((products) => {
                res.json(products);
            })
            .catch((error) => {
                res.status(500).json({
                    message:"error  fetching data"
                })
            })
           }
    else{
        Product.find({isavailable:true})
            .then((products) => {
                res.json(products)
            })
            .catch((error) => {
                res.status(500).json({
                    message:"error  fetching data"
                })
            })
    }    
}

export function deleteproduct(req, res){

    if(! isadmin(req)){
        res.status(403).json({
            message : "forbidden"
        })
        return
    }
    const prodid=req.params.productid;
    Product.deleteOne({productid:prodid}).then(
        () => {
    res.json({
        message: "product deleted successfully"
    })
    console.log({Product})
        
    })

}

export function updateproduct(req , res ){
    if (! isadmin(req)){
        res.status(403).json({
                message :"forbidden"
        })
        return
    }

    const prodid = req.params.productid
    Product.updateOne({productid:prodid}, req.body).then(
        () => {
            res.json({
                message: "user update succesfully"
            })
            
            })
        }

export function getproductbyid(req, res){
    

    const prodid = req.params.productid
    Product.findOne({productid:prodid}).then(
        (product) => {
            if (product == null){
                res.status(404).json({
                    message :"product not found"
                })
            }
            else {
                if (product.isavailable){
                    res.json(product)}
                else{
                        res.status(404).json({
                            message :"product not found"
                        })
                    }

                }
            }
            )
            
        
    .catch(
        (error) => {
            res.status(500).json({
                message : "error fetching product",
                error : error.message
            })
        }
    )

}
 

export async function searchProducts(req,res){
	const query = req.params.query

	try {

		const products = await Product.find(
			{
				$or : [
					{ name : { $regex : query , $options : "i" } },
					{ altnames : { $elemMatch : { $regex : query , $options : "i" } } }
				],
				isavailable : true
			}
		)

		return res.json(products)
	}catch(error){
		res.status(500).json({
			message : "Error searching products",
			error : error.message
		})
	}

}




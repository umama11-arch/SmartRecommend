import express from "express";
import pool from "./dbs.js";
const app = express();
import cors from "cors";

app.use(cors({
  origin: "https://umama11-arch.github.io"
}));


app.use(express.json());
app.use(express.static("public"));

app.get("/api/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      connected: true,
      databaseTime: result.rows[0].now,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      connected: false,
      error: error.message,
    });
  }
});
app.get("/api/fetchproducts",async(req,res)=>{
    const result = await pool.query("SELECT * FROM products");
    res.json(result.rows)
})

app.post("/api/buyproducts",async(req,res)=>{

  try {
    
    const {userid,productID}=req.body;
    
    const result=await pool.query("SELECT product_id,user_id FROM purchases WHERE product_id=$1 AND user_id=$2",
      [userid,productID]
    )

    if(result.rows.length===0){
      const add=await pool .query("INSERT INTO purchases(user_id,product_id) VALUES ($1, $2)",[userid,productID])
      res.send("Purchase Successful")
    }
    else{
      res.send("Already Purchased")
    }
  } catch (error) {
    res.send(error)
  }
  })

app.get("/api/fetchgraph",async(req,res)=>{
    try {
        const result=await pool.query("SELECT * FROM purchases")
        res.json(result.rows)
    } catch (error) {
      console.log(error)
    }
})

app.get("/api/purchases",async(req,res)=>{
  try {
    const {userid}=req.query;
   const purchases = await pool.query(
  `SELECT products.*
   FROM purchases
   JOIN products
   ON purchases.product_id = products.id
   WHERE purchases.user_id = $1`,
  [userid]
);
res.json(purchases.rows)
  } catch (error) {
    console.log(error);
  }
})
app.post("/api/signup", async (req, res) => {
    const { name, password } = req.body;

    const result = await pool.query(
        "INSERT INTO users(name, password) VALUES($1, $2)",
        [name, password]
    );

    res.send("hi i am back");
});

app.post("/api/login",async(req,res)=>{
  try {
    
    const {username,password}=req.body;
    
   const result = await pool.query(
  "SELECT id, name, purchasedproducts, likedproducts FROM users WHERE name = $1 AND password = $2",
  [username, password]
);

if (result.rows.length === 0) {
  res.send("Invalid");
} else {
  res.json(result.rows[0]);
}
   
  } catch (error) {
    res.send(error)
  }

})
app.listen(4000, () => {
  console.log("Server: http://localhost:4000");
});
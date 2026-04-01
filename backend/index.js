require("dotenv").config();

const express = require("express");
const cors  = require("cors");
const app = express();
const mongoose = require("mongoose");
const PORT = process.env.PORT||3500;
const dbUrl = process.env.DBURL;
const Item = require('./models/Item');
const User = require('./models/User.js');
const Order = require('./models/Order');
const stripe = require('stripe')(process.env.STRIPE_SK);

// app.use(cors())
app.use(cors({
  origin: "https://flowershop-azsd.onrender.com", 
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));
app.use(express.json());

app.use(express.urlencoded({extended:true}));
app.get("/", (req, res) => {
  res.send("API is running");
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

mongoose.connect(dbUrl)
.then(() => console.log("MongoDB connected"))
.catch(err => console.log("NO cnnection to MongoDB",err));

mongoose.connection.once("open", () => {
    console.log("Database is ready!");
}
)

// ADDING NEW ITEMS IN THE STORE 
app.post("/items", async (req, res) => {
  try {
    const { name } = req.body;

    const existingItem = await Item.findOne({ name });

    if (existingItem) {
      await Item.findByIdAndUpdate(existingItem._id, req.body);

      return res.json({
        message: "Item already exists. Updated successfully!"
      });
    }

    const newItem = new Item(req.body);
    await newItem.save();

    res.status(201).json({
      message: "Item added successfully!"
    });

  } catch (err) {
    console.error(err);  
    res.status(500).json({ error: err.message });
  }
});


//CHECK IF THE ITEM EXIST IN THE DATABASE
app.get("/items/check/:name", async (req, res) => {
  try {
    const item = await Item.findOne({ name: req.params.name });

    if (item) {
      return res.json({ exists: true });
    }

    res.json({ exists: false });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GETTING ALL THE ITEMS 

app.get("/items", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE IETM BY ID
app.delete("/items/:id", async (req, res) => {
  try{
    const deletedItem = await Item.findByIdAndDelete(req.params.id);

    if(!deletedItem){
      return res.status(404).json({error: "Item not found"});
    }
    res.json({message: "Item delted successfully"});
  }catch(err){
    console.error(err);
    res.status(500).json({error: err.message});
  }
});

// UPDATE ITEM
app.put("/items/:id", async(req, res) => {
  try{
    await Item.findByIdAndUpdate(req.params.id, req.body);
    res.json({message: "Item updated successfully!"});
  }catch(err) {
    res.status(500).json({error: err.message});
  }
});

// ADDING ITEM TO FEATURED 

app.put("/items/featured/:id", async(req, res) => {
  try{
    const item = await Item.findById(req.params.id);
    item.isFeatured = !item.isFeatured;
    await item.save(); 
    res.json({message: "Featured status updated"});
  }catch(err) {
    res.status(500).json({error: err.message});
  }
});

//SIGN UP ROUTE
app.post("/signup", async(req, res) => {
  try{
    const payload = {
      email: req.body.email.trim().toLowerCase(),
      username: req.body.username.trim(),
      password: req.body.password.trim(),
    }
    const newUser = new User(payload);
    await newUser.save();
    const response = {
      username: newUser.username, 
      email: newUser.email,
      role: newUser.role,
      login: true,
    }
    res.status(201).json(response)
  }catch(error){
    res.status(500).json({message: error.message});
  }
});


app.post("/login", async(req, res)=>{
  try{
    const email = req.body.email.trim().toLowerCase();
    const password = req.body.password;
    const user = await User.findOne({email, password});
    if(!user){
      return res.status(404).json({error: "Invalid credentials, check your email and password"})
    }
    const response = {
      email: user.email, 
      username: user.username, 
      role: user.role,
      login: true,
    }
    res.status(200).json(response);
  }catch(error){
    res.status(500).json({message:error.message});
  }
});

app.post("/admin", async (req, res) => {
  const user = await User.findById(req.body.userId);
  if(user.role !== "admin"){
    return res.status(401).json({error: "Unauthorized request for this endpont"});
  }
});

app.post("/checkout-session", async (req, res) => {

try {
  const {cartItems} = req.body;
  const line_items = cartItems.map((item) => ({
    price_data: {
      currency: "USD",
      product_data: {
        name: item.name,
      },
      unit_amount: Math.round(item.price * 100)
    },
    quantity: item.quantity,
  }));
const session = await stripe.checkout.sessions.create({    payment_method_types: ["card"],
    line_items, mode: "payment",
    billing_address_collection: "required", 
    shipping_address_collection: {
    allowed_countries: ["US"],
  }, 
      success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`, 
      cancel_url: `${process.env.FRONTEND_URL}/canceld`,
});
  res.send({url: session.url});
} catch (error) {
  res.status(500).json({message:error.message});
}
});


app.post("/order", async (req, res) => {
  try {
    const sessionId = req.query.sessionId;
    if (!sessionId) return res.status(400).json({ message: "No sessionId" });

    const existingOrder = await Order.findOne({ stripeSessionId: sessionId });
    if (existingOrder) return res.status(200).json(existingOrder);

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    const lineItems = await stripe.checkout.sessions.listLineItems(sessionId);
    const address = session.shipping_details?.address || session.customer_details?.address || {};

    const items = lineItems.data.map((item) => ({
      name: item.description,
      price: item.price.unit_amount / 100,
      quantity: item.quantity,
    }));

    const newOrder = new Order({
      orderItems: items,
      shippingAddress: [{
        address: address.line1 || "N/A",
        city: address.city || "N/A",
        postalCode: address.postal_code || "00000",
        country: address.country || "US",
      }],
      paymentMethod: "stripe",
      itemPrice: session.amount_subtotal / 100,
      taxPrice: 0,
      totalPrice: session.amount_total / 100,
      isPaid: session.payment_status === "paid",
      paidAt: new Date(),
      stripeSessionId: sessionId, 
      stripePaymentIntentId: session.payment_intent,
    });

    const savedOrder = await newOrder.save();
    console.log("Order saved to MongoDB:", savedOrder._id);
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("BACKEND ERROR:", error.message);
    res.status(500).json({ message: error.message });
  }
});
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

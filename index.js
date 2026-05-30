// Imports
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");

const Chat = require("./models/chat");
const ExpressError = require("./ExpressError");

// Database Connection
main()
.then(() => {
    console.log("Connected to DB");
})
.catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

// Utility Function
function asyncWrap(fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);
    };
}

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to WhatsApp Chat App");
});

// Index Route
app.get("/chats", asyncWrap(async (req, res) => {
    let chats = await Chat.find();
    res.render("index.ejs", { chats });
}));

// New Route
app.get("/chats/new", (req, res) => {
    res.render("new.ejs");
});

// Create Route
app.post("/chats", asyncWrap(async (req, res) => {

    let { from, to, message } = req.body;

    let newChat = new Chat({
        from,
        to,
        message,
        created_at: new Date(),
    });

    await newChat.save();

    res.redirect("/chats");
}));

// Show Route
app.get("/chats/:id", asyncWrap(async (req, res, next) => {

    let { id } = req.params;
    let chat = await Chat.findById(id);

    if(!chat){
        return next(new ExpressError(404,"Chat not found"));
    }

    res.render("show.ejs",{chat});
}));

// Edit Route
app.get("/chats/:id/edit", asyncWrap(async (req, res) => {

    let { id } = req.params;
    let chat = await Chat.findById(id);

    res.render("edit.ejs", { chat });
}));

// Update Route
app.put("/chats/:id", asyncWrap(async (req, res) => {

    let { id } = req.params;
    let { message } = req.body;

    await Chat.findByIdAndUpdate(id, { message });

    res.redirect("/chats");
}));

// Delete Route
app.delete("/chats/:id", asyncWrap(async (req, res) => {

    let { id } = req.params;

    await Chat.findByIdAndDelete(id);

    res.redirect("/chats");
}));

const handleValidationErr = (err)=>{
    console.log("this was a validation error");
    console.dir(err);
    return err;

}

// Error Logger Middleware
app.use((err, req, res, next) => {
    console.log("---------- ERROR ----------");
    console.log(err.name);
    if(err.name==="ValidationError"){
        err = handleValidationErr(err);
    }
    next(err);
});

// Final Error Handler
app.use((err, req, res, next) => {
    let { status = 500, message = "Some Error Occurred" } = err;
    res.status(status).send(message);
});

// Server
app.listen(8080, () => {
    console.log("Server is listening on port 8080");
});
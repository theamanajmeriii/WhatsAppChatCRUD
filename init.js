const mongoose = require("mongoose");
const Chat = require("./models/chat");

main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

let allChats = [
    {
        from:"Aman",
        to:"Umair",
        message:"Hello Bro",
        created_at:new Date()
    },

    {
        from:"Umair",
        to:"Aman",
        message:"Kaise ho?",
        created_at:new Date()
    },

    {
        from:"Rohan",
        to:"Aman",
        message:"Assignment complete?",
        created_at:new Date()
    }
];

Chat.insertMany(allChats);
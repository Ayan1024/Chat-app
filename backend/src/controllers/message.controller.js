import User from "../models/user.model.js";
import Message from "../models/message.model.js"
import cloudinary from "../lib/cloudinary.js";
import { getReciverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const fillteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(fillteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ message: "Internal server Error" });
  }
};



export const getMessages = async(req, res)=>{
    try {
        const {id:userToChatId} = req.params
        const myId = req.user._id;

        const messages = await Message.find({
            $or:[
                {senderId:myId, receiverId:userToChatId},
                {senderId:userToChatId, receiverId:myId}
            ]
        })

        res.status(200).json(messages)
    } catch (error) {
        console.log("Error in the getMessage from messageController:", error.message)
        res.status(500).json({message: " Internal server ERror"})
    }
}


export const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user._id;


        let imageUrl;
        if(image){
            // upload base64 image to cloudinary

            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }


const newMessage = new Message({
    senderId,
    receiverId,
    text,
    image: imageUrl
})

await newMessage.save()


const reciverSocketId = getReciverSocketId(receiverId);

if(reciverSocketId){
    io.to(reciverSocketId).emit("newMessage", newMessage)
}

res.status(201).json(newMessage)
        
    } catch (error) {
        console.log("Error in newMessage from sendMessage in messageController", error.message)
        res.status(500).json({message: "Internal Server Error"})
    }
}
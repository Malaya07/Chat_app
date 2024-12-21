const { AuthenticationError } = require("apollo-server");
const User = require("./model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Message = require("./model/message");
const mongoose = require("mongoose");
const ChatRoom = require("./model/chatRoom");
const { PubSub } = require("graphql-subscriptions");


const pubsub = new PubSub();
const CHAT_ROOM_CREATED = "CHAT_ROOM_CREATED";

const resolvers = {
  Query: {
    users: async (_, __, context) => {
      if (!context.user) {
        throw new AuthenticationError("You must be logged in to access this resource");
      }
      return await User.find();
    },
    user: async (_, { id }, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in to access this resource");
      return await User.findById(id);
    },
    userByEmail: async (_, { email }, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in to access this resource");
      const user = await User.findOne({ email });
      if (!user) throw new Error("User not found");
      return user;
    },
    getChatRooms: async (_, __, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in to access this resource");

      const participant = await User.findById(context.user.userId);
      if (!participant) throw new Error("User not found");

      const chatRooms = await ChatRoom.find({ participants: participant.username });
      return chatRooms;
    },
    messageByRoom: async (_, { Chatroomname }, context) => {
      if (!context.user) throw new AuthenticationError("You must be logged in to access this resource");

      const messages = await Message.find({ ChatRoomname: Chatroomname }).sort({ timestamp: 1 });
      const sanitizedMessages = messages
      .filter(msg => msg.ChatRoomname) // Filter out messages missing ChatRoomname
      .map(msg => ({
        id: msg.id,
        message: msg.message,
        sendername: msg.sendername,
        createdAt: msg.timestamp,
        ChatRoomname: msg.ChatRoomname,
        Date: msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }));
      return sanitizedMessages;
    },
  },

  Mutation: {
    signup: async (_, { userNew }) => {
      const userExists = await User.findOne({ email: userNew.email });
      if (userExists) throw new Error("Email already exists");

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userNew.password, salt);

      const newUser = new User({
        ...userNew,
        password: hashedPassword,
      });
      await newUser.save();
      return newUser;
    },

    signin: async (_, { userNew }) => {
      const user = await User.findOne({ email: userNew.email });
      //console.log(user)
      if (!user) throw new AuthenticationError("User does not exist with that email");

      const doMatch = await bcrypt.compare(userNew.password, user.password);
      if (!doMatch) throw new AuthenticationError("Password is incorrect");

      const token = jwt.sign({ userId: user.id, email:userNew.email }, process.env.SECRET_KEY,
        {expiresIn: '7d'}
      );
     // console.log(token)
      return { token };
    },
    createMessage: async (_, { sendername, Chatroomname, text }, { user }) => {
      if (!user) throw new AuthenticationError("You must be logged in");
    
      const chatRoom = await ChatRoom.findOne({ name: Chatroomname });
      if (!chatRoom) throw new Error("Chatroom does not exist");
    
      if (!chatRoom.participants.includes(sendername)) {
        throw new Error("You are not a participant in this chatroom");
      }
    
      const message = new Message({
        message: text,
        sendername: sendername,
        ChatRoomname: Chatroomname,
        timestamp: new Date(),
      });
      await message.save();
    
      console.log("Publishing message to channel:", `NEW_MESSAGE_${Chatroomname}`);
      pubsub.publish(`NEW_MESSAGE_${Chatroomname}`, { newMessage: message });
    
      return message;
    },    

    createChatRoom: async (_, { id, name }, { user }) => {
      try {
        if (!user) throw new AuthenticationError("You must be logged in to create a chat room");
    
        const creator = await User.findById(user.userId);
        if (!creator) throw new Error("User not found");
    
        const existingChatRoom = await ChatRoom.findOne({ id });
        if (existingChatRoom) {
          throw new Error("Chat room with this ID already exists");
        }
    
        const newChatRoom = new ChatRoom({
          id,
          name,
          participants: [creator.username],
          messages: [],
        });
        await newChatRoom.save();
    
        console.log(`Chat room ${name} created successfully by ${creator.username}`);
        pubsub.publish(CHAT_ROOM_CREATED, { chatRoomCreated: newChatRoom });
        return newChatRoom;
      } catch (error) {
        console.error("Error creating chat room:", error);
        throw new Error("Failed to create chat room");
      }
    },
    

    joinChatRoom: async (_, { chatroomname, participantname }) => {
      const chatRoom = await ChatRoom.findOne({ name: chatroomname });
      if (!chatRoom) throw new Error("Chatroom does not exist");

      if (!chatRoom.participants.includes(participantname)) {
        chatRoom.participants.push(participantname);
        await chatRoom.save();
      }
    console.log("hello")
      return chatRoom;
    },
  },
  Subscription: {
    newMessage: {
      subscribe: (_, { Chatroomname }) => {
        if (!Chatroomname) throw new Error("Chatroomname is required for subscription");
  
        //console.log(Subscribing to chatroom: NEW_MESSAGE_${Chatroomname});
        return pubsub.asyncIterator(`NEW_MESSAGE_${Chatroomname}`);
      },
      resolve: (payload) => {
        console.log("Resolving payload for subscription:", payload.newMessage);
        return payload.newMessage;
      },
    },
    chatRoomCreated: {
      subscribe: () => pubsub.asyncIterator([CHAT_ROOM_CREATED]),
    },
  },
  
};

module.exports = resolvers;

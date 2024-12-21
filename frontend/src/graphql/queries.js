import {gql} from '@apollo/client'

export const GET_MSG= gql`
query GetMessagesByUser($receivername: String!, $sendername: String!){
  messageByUser(receivername: $receivername , sendername:$sendername) {
     id
    message
    sendername
    receivername
    createdAt
    
  }
}
 ` 
 export const GET_USER = gql`
  query($userId: ID!){
  user(id: $userId) {
    username
    email
  }
}

 `
 export const GET_ALL_ROOMS= gql`
    query{
      getChatRooms{
      id
       name
       participants
      }
    }
 `

 export const GET_ROOM_MSG= gql`
 query MessageByRoom($chatroomname: String!) {
  messageByRoom(Chatroomname: $chatroomname) {
   message  
   sendername
   createdAt
   Date
  }
}
 `

 
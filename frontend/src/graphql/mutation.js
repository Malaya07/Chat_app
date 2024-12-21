import { gql } from "@apollo/client";

export const SIGNUP_USER = gql`
    mutation SignUp($userNew: UserInput!) {
        signup(userNew: $userNew) {
            id
            email
        }
    }
`;

export const LOGIN_USER = gql`
    mutation SignIn($userNew: UserSigninInput!) {
    signin(userNew: $userNew) {
        token
    }
}

`;

export const SEND_MSG = gql`
mutation CreateMessage($sendername: String!, $chatroomname: String!, $text: String!) {
  createMessage(sendername: $sendername, Chatroomname: $chatroomname, text: $text) {
   message 
   ChatRoomname
   sendername
   createdAt
  }
}
` 
export const JOIN_ROOM = gql`
  mutation JoinChatRoom($chatroomname: String!, $participantname: String!) {
    joinChatRoom(chatroomname: $chatroomname, participantname: $participantname) {
      participants
      name
      messages {
        id
        sendername
        message
      }
    }
  }
`;


export const CREATE_ROOM = gql`
mutation CreateChatRoom($id: String!, $name: String!) {
  createChatRoom(id: $id, name: $name) {
    id
    name
    participants
    messages {
      id
      sendername
      message
      createdAt
    }
  }
}

`


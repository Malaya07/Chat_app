import {gql} from '@apollo/client'

export const NEW_MESSAGE_SUBSCRIPTION = gql`
  subscription Subscription($chatroomname: String!) {
    newMessage(Chatroomname: $chatroomname) {
      message
      sendername
      createdAt
      ChatRoomname
    }
  }
`;

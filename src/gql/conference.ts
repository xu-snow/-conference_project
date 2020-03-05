import { gql } from 'apollo-boost'

export const GET_ALL_CONFERENCE= ()=>gql`
{
  conferences{
    edges {
      node {
        id
        name
        description
        holdingTime
      }
    }
  }
}`


export const GET_ALL_CONFERENCES_TOPIC=()=>gql`
{
  conferencesTopic {
    pageInfo {
      hasNextPage
      hasPreviousPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        name
        description
        createTime
      }
      cursor
    }
  }
}
`

export const  ADD_CONFERENCES_TOPIC = gql`
  mutation MutationConferencesTopic($name: String!,$description:String!) {
    conferenceTopic(input:{name: $name,description:$description}) {
      conferenceTopic {
        id
        name
        description
        createTime
      }
      errors {
        field
        messages
      }
      clientMutationId
    }
  }
`
export const UPDATE_CONFERENCES_TOPIC = gql`
mutation MutationConferencesTopic($name: String!,$description:String!,$id:ID!) {
  conferenceTopic(input:{id:$id,name: $name,description:$description}) {
    conferenceTopic {
      id
      name
      description
      createTime
    }
    errors {
      field
      messages
    }
    clientMutationId
  }
}
`

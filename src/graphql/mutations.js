import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { FEED_QUERY } from "./query";

const Create_Link_Mutation = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
        id
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;

const withVote = graphql(VOTE_MUTATION, {
  props: ({ mutate, ...rest }) => {
    return {
      ...rest,
      voteLink: linkId =>
        mutate({
          variables: {
            linkId
          }
        })
    };
  },
  options: {
    update: (store, { data: { vote, ...rest } }) => {
      const votedLinkId = vote.link.id;
      const data = store.readQuery({ query: FEED_QUERY });
      const votedLink = data.feed.links.find(link => link.id === votedLinkId);
      votedLink.votes = vote.link.votes;
      store.writeQuery({ query: FEED_QUERY, data });
    }
  }
});

const withCreateLink = graphql(Create_Link_Mutation, {
  props: ({ mutate }) => ({
    createLink: ({ url, description }) =>
      mutate({
        variables: {
          url,
          description
        }
      })
  }),
  options: props => ({
    update: (store, { data: { post } }) => {
      const data = store.readQuery({ query: FEED_QUERY });
      data.feed.links.push(post);
      store.writeQuery({ query: FEED_QUERY, data });
    },
    onCompleted: () => props.history.push("/")
  })
});
export {
  Create_Link_Mutation,
  SIGNUP_MUTATION,
  LOGIN_MUTATION,
  VOTE_MUTATION,
  withVote,
  withCreateLink
};

import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from "./subscription";
const FEED_QUERY = gql`
  {
    feed {
      links {
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
  }
`;
const FEED_SEARCH_QUERY = gql`
  query feedSearch($filter: String) {
    feed(filter: $filter) {
      links {
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
  }
`;
const withFeed = graphql(FEED_QUERY, {
  props: ({ ownProps, data: { subscribeToMore, ...restData } }) => ({
    data: {
      ...restData,
      subscribeNewData: () => {
        const unSubscribeVotes = subscribeToMore({
          document: NEW_VOTES_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const { link: votedLink } = subscriptionData.data.newVote;
            console.log(prev,'prevFromVotes')
            const oldLink = prev.feed.links.find(
              ({ id }) => id === votedLink.id
            );
            oldLink.votes = votedLink.votes;
            return Object.assign({}, prev, {
              feed: {
                links: [...prev.feed.links],
                ...prev.feed
              }
            });
          }
        });
        const unSubscribeLinks = subscribeToMore({
          document: NEW_LINKS_SUBSCRIPTION,
          updateQuery: (prev, { subscriptionData }) => {
            if (!subscriptionData.data) return prev;
            const newLink = subscriptionData.data.newLink;
            const exists = prev.feed.links.find(({ id }) => id === newLink.id);
            if (exists) return prev;
            return Object.assign({}, prev, {
              feed: {
                links: [...prev.feed.links, newLink],
                count: prev.feed.links.length + 1,
                __typename: prev.feed.__typename
              }
            });
          }
        });
        return () => {
          unSubscribeLinks();
          unSubscribeVotes();
        };
      }
    },
    ...ownProps
  })
});

export { FEED_QUERY, FEED_SEARCH_QUERY, withFeed };

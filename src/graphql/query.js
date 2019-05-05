import gql from "graphql-tag";
import { graphql } from "react-apollo";
import { LINKS_PER_PAGE } from "../constants";
import { NEW_LINKS_SUBSCRIPTION, NEW_VOTES_SUBSCRIPTION } from "./subscription";
const FEED_QUERY = gql`
  query FEED_QUERY($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      count
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
    ...ownProps,
    isNewPage: ownProps.location.pathname.includes("new"),
    pageIndex: ownProps.match.params.page
      ? (ownProps.match.params.page - 1) * LINKS_PER_PAGE
      : 0,
    nextPage: () => {
      const currentPage = parseInt(ownProps.match.params.page);
      if (currentPage <= restData.feed.count / LINKS_PER_PAGE) {
        const _nextPage = currentPage + 1;
        ownProps.history.push(`/new/${_nextPage}`);
      }
    },
    previousPage: () => {
      const currentPage = parseInt(ownProps.match.params.page);
      if (currentPage > 1) {
        const _previouspage = currentPage - 1;
        ownProps.history.push(`/new/${_previouspage}`);
      }
    }
  }),
  options: props => {
    const isNewPage = props.location.pathname.includes("new");
    const page = parseInt(props.match.params.page, 10);
    const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
    const first = isNewPage ? LINKS_PER_PAGE : 100;
    const orderBy = isNewPage ? "createdAt_DESC" : null;
    return {
      variables: {
        skip,
        first,
        orderBy
      }
    };
  }
});

export { FEED_QUERY, FEED_SEARCH_QUERY, withFeed };

import React from "react";
import Link from "./Link";
import { Query } from "react-apollo";
import { FEED_QUERY } from "../graphql/query";


export default function LinkList() {
  return (
    <Query query={FEED_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <div>loading...</div>;
        if (error) return <div>Error:{error}</div>;
        const linksToRender=data.feed.links
        return (
          <div>
            {linksToRender.map(link => (
              <Link key={link.id} link={link} />
            ))}
          </div>
        );
      }}
    </Query>
  );
}

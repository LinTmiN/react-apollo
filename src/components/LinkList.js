import React, { useEffect } from "react";
import Link from "./Link";
import { withFeed } from "../graphql/query";

function LinkList({ data: { loading, error, feed, subscribeNewData } }) {
  useEffect(() => {
    const unSubscrib=subscribeNewData()
    return unSubscrib
  }, [subscribeNewData]);

  if (loading) return <div>loading...</div>;
  if (error) return <div>Error:{error}</div>;
  const linksToRender = feed ? feed.links : [];
  return (
    <div>
      {linksToRender.map((link, i) => (
        <Link key={link.id} index={i} link={link} />
      ))}
    </div>
  );
}

export default withFeed(LinkList);

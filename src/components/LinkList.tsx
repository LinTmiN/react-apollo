import React, { useEffect, useMemo } from "react";
import Link from "./Link";
import { compose } from "react-apollo";
import { withFeed } from "../graphql/query";
import { linkType } from "../types";

export interface LinkListProps {
  data: {
    loading: boolean;
    error: Error;
    feed: {
      links: Array<linkType>;
    };
    subscribeNewData: () => void;
  };
  isNewPage: boolean;
  pageIndex: number;
  nextPage: () => void;
  previousPage: () => void;
}

function LinkList({
  data: { loading, error, feed, subscribeNewData },
  isNewPage,
  pageIndex,
  nextPage,
  previousPage
}: LinkListProps) {
  useEffect(() => {
    const unSubscrib = subscribeNewData();
    return unSubscrib;
  }, [subscribeNewData]);
  const linksToRender = useMemo(() => {
    const dataLink = feed ? feed.links : [];
    if (isNewPage) return dataLink;
    const rankedLinks = dataLink.slice();
    rankedLinks.sort((a1, a2) => a2.votes.length - a1.votes.length);
    return rankedLinks;
  }, [feed, isNewPage]);
  if (loading) return <div>loading...</div>;
  if (error) return <div>Error:{error}</div>;
  return (
    <div>
      {linksToRender.map((link, i) => (
        <Link key={link.id} index={i + pageIndex} link={link} />
      ))}
      {isNewPage && (
        <div className="flex ml4 mv3 gray">
          <div className="pointer mr2" onClick={previousPage}>
            Previous
          </div>
          <div className="pointer" onClick={nextPage}>
            Next
          </div>
        </div>
      )}
    </div>
  );
}

export default compose(withFeed)(LinkList);

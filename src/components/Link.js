import React from "react";
import { compose } from "react-apollo";
import { AUTH_TOKEN } from "../constants";
import { withVote } from "../graphql/mutations";
import { withRouter } from "react-router";
import { timeDifferenceForDate } from "../utils";
function Link({ link, index, voteLink }) {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{index + 1}.</span>
        {authToken && (
          <div className="ml1 gray f11" onClick={() => voteLink(link.id)}>
            ▲
          </div>
        )}
      </div>
      <div className="ml1">
        <div>
          {link.description} ({link.url})
        </div>
        <div className="f6 lh-copy gray">
          {link.votes.length} votes | by{" "}
          {link.postedBy ? link.postedBy.name : "Unknown"}
          {timeDifferenceForDate(link.createdAt)}
        </div>
      </div>
    </div>
  );
}

export default compose(
  withRouter,
  withVote
)(Link);

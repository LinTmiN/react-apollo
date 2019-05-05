import React, { Component } from "react";
import { withApollo, compose } from "react-apollo";
import { FEED_SEARCH_QUERY } from "../graphql/query";
import Link from "./Link";

export interface SearchProps {
  client:any
}

class Search extends Component<SearchProps, any> {
  state = {
    links: [],
    filter: ""
  };

  render() {
    return (
      <div>
        <div>
          Search
          <input
            type="text"
            onChange={e => this.setState({ filter: e.target.value })}
          />
          <button onClick={() => this._executeSearch()}>OK</button>
        </div>
        {this.state.links.map((link: { id: string }, index) => (
          <Link key={link.id} link={link} index={index} />
        ))}
      </div>
    );
  }

  _executeSearch = async () => {
    const { filter } = this.state;
    const result = await this.props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter }
    });
    const links = result.data.feed.links;
    this.setState({ links });
  };
}

export default compose(withApollo)(Search);

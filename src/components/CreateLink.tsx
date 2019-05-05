import React, { Component } from "react";
import { withCreateLink } from "../graphql/mutations";
import {History} from 'history'
interface linArgs{
  url:string,
  description:string
}

export interface CreateLinkProps {
  createLink: (args:linArgs)=>void;
  history:History
}

export interface CreateLinkStates {
  description: string;
  url: string;
}
class CreateLink extends Component<CreateLinkProps, CreateLinkStates> {
  state = {
    description: "",
    url: ""
  };

  render() {
    const { description, url } = this.state;
    return (
      <div>
        <div className="flex flex-column mt3">
          <input
            className="mb2"
            value={description}
            onChange={e => this.setState({ description: e.target.value })}
            type="text"
            placeholder="A description for the link"
          />
          <input
            className="mb2"
            value={url}
            onChange={e => this.setState({ url: e.target.value })}
            type="text"
            placeholder="The URL for the link"
          />
        </div>
        <button
          onClick={() => {
            this.props.createLink({
              url,
              description
            });
          }}
        >
          Submit
        </button>
        ;
      </div>
    );
  }
}

export default withCreateLink(CreateLink);

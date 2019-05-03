import React, { Component } from "react";
import { Mutation } from "react-apollo";
import { Create_Link_Mutation } from "../graphql/mutations";
import history from "../history";
class CreateLink extends Component {
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
        <Mutation
          onCompleted={() => this.props.history.replace("/")}
          mutation={Create_Link_Mutation}
          variables={{ description, url }}
        >
          {(createLink, ...rest) => {
            console.log(rest, "rst");
            return <button onClick={createLink}>Submit</button>;
          }}
        </Mutation>
      </div>
    );
  }
}

export default CreateLink;

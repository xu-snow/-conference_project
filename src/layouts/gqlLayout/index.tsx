import React, { PureComponent } from 'react';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import cookie from 'cookie'

// type IProps = RouteComponentProps & {}
interface IProps{

}

interface IStates {
  client: any
}

class GqlLayout extends PureComponent<IProps, IStates> {
  constructor(props: IProps) {
    super(props)

    const client = new ApolloClient({
      uri: `${GQL_ENV}/graphql/`,
      headers: {
        'X-CSRFToken':cookie.parse(document.cookie).csrftoken
        // Authorization: `bearer ${props.location.query.token}`
      }
    });
    this.state = {
      client,
    }
  }

  render() {
    const {client} = this.state
    return (
      <ApolloProvider client={client}>
        {this.props.children}
      </ApolloProvider>
    );
  }
}

export default GqlLayout;

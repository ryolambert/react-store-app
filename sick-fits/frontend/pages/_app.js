// This file is setup to create the actual apollo client
import App, { Container } from 'next/app';
import Page from '../components/Page';
import { ApolloProvider } from 'react-apollo';
import withData from '../lib/withData';

class MyApp extends App {
  // this special next.js setup will run first
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};
    // crawls all the pages and fetches data for return
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }
    // this exposes the query to the user
    pageProps.query = ctx.query;
    // by returning pageProps here it's exposed for access within render
    return { pageProps };
  }

  render() {
    // little bit of destructering here
    const { Component, apollo, pageProps } = this.props;

    return (
    <Container>
        <ApolloProvider client={apollo}>
          <Page>
            <Component {...pageProps}/>
          </Page>
        </ApolloProvider>
      </Container>
    );
  }
}

export default withData(MyApp);
  // this setup is unecessary for a client side rendered app, but is needed for server-side rendering
  // FOR MORE EXAMPLES: read the next.js or apollo documentation

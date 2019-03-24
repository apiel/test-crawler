import gql from 'graphql-tag';

const fragment = gql`
  fragment SelectCrawler on Crawler {
    url
    timestamp
  }
`;

export default fragment;
import {SecureGet} from './index';

export const queryLocation = async (id: string) => {
  if (id) {
    const locationResponse = await fetch(
      `https://connect.squareup.com/v2/locations/${id}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${await SecureGet('squareAccessToken')}`,
        },
      },
    );
    const {location} = await locationResponse.json();
    return location;
  }
};

export const queryLocations = async () => {
  const locationResponse = await fetch(
    'https://connect.squareup.com/v2/locations',
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${await SecureGet('squareAccessToken')}`,
      },
    },
  );
  const {locations} = await locationResponse.json();
  return locations;
};

export const queryTeamMemebers = async (id: string) => {
  if (id) {
    const teamMemberResponse = await fetch(
      'https://connect.squareup.com/v2/team-members/search',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${await SecureGet('squareAccessToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: {
            filter: {
              location_ids: [id],
              is_owner: false,
            },
          },
        }),
      },
    );
    const {team_members} = await teamMemberResponse.json();
    return team_members;
  }
};

const graphqlRequest = async (query: string) => {
  try {
    const response = await fetch('https://connect.squareup.com/alpha/graphql', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${await SecureGet('squareAccessToken')}`,
      },
      body: JSON.stringify({query}),
    });
    const ret = await response.json();
    if (ret.errors) {
      ret.errors.forEach((error: string) => {
        console.error(error);
      });
    }
    return ret.data;
  } catch (e) {
    console.error('GraphQl request error: ', e);
  }
};

export const graphqlListLocations = async (merchantId: string) => {
  const query = `
  {
    merchants(
      filter: {
        id: { 
          equalToAnyOf: ["${merchantId}"]
        }
      }
     ) {
        nodes {
          id
          locations {
            nodes {
              id
              name
            }
          }
        }
      }
    }
`;
  const {merchants} = await graphqlRequest(query);
  return merchants.nodes[0].locations.nodes;
};

export const graphqlListOrders = async ({
  locationId,
  merchantId,
}: {
  locationId: string;
  merchantId: string;
}) => {
  const query = `
    {
      orders(filter: {
        merchantId: { equalToAnyOf: ["${merchantId}"] }
        location: { equalToAnyOf: ["${locationId}"] }
      }) {
        nodes {
          id
          lineItems {
            uid
            name
            quantity
          }
          customer {
            givenName
          }
        }
      }
    }
  `;
  const {orders} = await graphqlRequest(query);
  return orders;
};

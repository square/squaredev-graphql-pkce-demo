/*
Copyright 2021 Square Inc.
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
    http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

const sampleData = require('./seed-data.json');
const {Client, Environment} = require('square');
const readline = require('readline');
const {v4: uuidv4} = require('uuid');
const {program} = require('commander');
require('dotenv').config();

if (!process.env.SQUARE_ACCESS_TOKEN) {
  console.error('.env file missing required field "SQUARE_ACCESS_TOKEN"');
  process.exit(1);
}

const config = {
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
  userAgentDetail: 'sample_app_graphql-sample-app', // Remove or replace this detail when building your own app
};

const {catalogApi, customersApi, ordersApi, locationsApi, teamApi} = new Client(
  config,
);

// assign a reference id to customers so we can search & delete them later on
const GRAPHQL_SAMPLE_APP_REFERENCE_ID = 'GRAPHQL-SAMPLE-APP';

// sku for catalog items so we can search & delete them later on
const GRAPHQL_SAMPLE_APP_SKU = 'GraphQLSampleAppSku';

// number of orders to create
const NUMBER_OF_ORDERS = 10;

// Name of Locations
// NOTE: IF you change these values make sure to change them in seed-data.json as well
// These are the `name` fields
const LOCATION_NAMES = [
  'Ferry Building',
  'Berkeley',
  'Downtown Oakland',
  'Jack London Square',
];

/** Create test Locations
 * @returns {String[]}
 */
async function createTestLocations() {
  const locationIds = [];
  for (const locationData of sampleData.locations) {
    try {
      const {
        result: {location},
      } = await locationsApi.createLocation(locationData);
      locationIds.push(location.id);
    } catch (error) {
      console.error(
        `Error when creating location ${locationData.business_name}`,
        error,
      );
    }
  }
  console.log('Successfully created locations', locationIds);
  return locationIds;
}

/** Create Team Members
 * @param {String[]} locationIds
 * @returns {String[]}
 */
async function createTeamMembers(locationIds) {
  let teamCounter = 0;
  const teamMembers = [];
  for (const teamData of sampleData.team) {
    teamData.teamMember.assignedLocations.locationIds.push(
      locationIds[teamCounter % 4],
    );
    teamData.teamMember.referenceId = GRAPHQL_SAMPLE_APP_REFERENCE_ID;
    try {
      const {
        result: {teamMember},
      } = await teamApi.createTeamMember(teamData);
      teamMembers.push(`${teamMember.givenName} ${teamMember.familyName}`);
    } catch (error) {
      console.error(
        `Error when creating location ${teamData.teamMember.givenName} ${teamData.teamMember.familyName}`,
        error,
      );
    }
    ++teamCounter;
  }
  console.log('Successfully created Team Members', teamMembers);
  return teamMembers;
}

/**
 * Create test customers
 * @returns {String[]} customer ids
 */
async function createTestCustomers() {
  const customerIds = [];
  for (const customerData of sampleData.customers) {
    try {
      customerData.referenceId = GRAPHQL_SAMPLE_APP_REFERENCE_ID;
      const {
        result: {customer},
      } = await customersApi.createCustomer(customerData);
      customerIds.push(customer.id);
    } catch (error) {
      console.error(
        `Error when creating customer ${customerData.givenName}`,
        error,
      );
    }
  }
  console.log('Successfully created customers', customerIds);
  return customerIds;
}

/**
 * Create test catalog objects
 * @returns {CatalogObject[]}
 */
async function createCatalogObjects() {
  const items = [];
  for (const catalogData of sampleData.catalog) {
    const item = catalogData;
    // set the SKU for each item variation so we can search and delete them later
    if (item.itemData && item.itemData.variations) {
      for (const variation of item.itemData.variations) {
        variation.itemVariationData.sku = GRAPHQL_SAMPLE_APP_SKU;
      }
    }
    items.push(item);
  }
  try {
    const {
      result: {objects},
    } = await catalogApi.batchUpsertCatalogObjects({
      batches: [
        {
          objects: items,
        },
      ],
      idempotencyKey: uuidv4(),
    });
    console.log(
      'Successfully created catalog objects',
      objects.map(obj => obj.id),
    );
    return objects;
  } catch (error) {
    console.error('Creating catalog objects failed', error);
    return [];
  }
}

/**
 * Create orders for the customers and catalog item variations
 * @param {String[]} customerIds
 * @param {CatalogItemVariation[]} variations
 * @returns {Order[]} orders created
 */
async function createOrders(customerIds, locationIds, variations) {
  let customerNum = 0;
  let variationNum = 0;
  const orders = [];
  const taxUid = 'sales_tax';
  const maxQuantity = 5; // max quantity we are allowing of an item in an order
  await Promise.all(
    locationIds.map(async locationId => {
      for (let i = 0; i < NUMBER_OF_ORDERS; i++) {
        const customerId = customerIds[customerNum % customerIds.length];
        const variation = variations[variationNum % variations.length];
        const quantity = (i % maxQuantity) + 1;
        try {
          const {
            result: {order},
          } = await ordersApi.createOrder({
            order: {
              customerId,
              lineItems: [
                {
                  appliedTaxes: [
                    {
                      taxUid,
                    },
                  ],
                  catalogObjectId: variation.id,
                  catalogVersion: variation.version,
                  itemType: 'ITEM',
                  quantity: quantity.toString(),
                },
              ],
              locationId,
              referenceId: GRAPHQL_SAMPLE_APP_REFERENCE_ID,
              source: {
                name: GRAPHQL_SAMPLE_APP_REFERENCE_ID,
              },
              taxes: [
                {
                  catalogObjectId: variation.tax,
                  scope: 'ORDER',
                  uid: taxUid,
                },
              ],
            },
          });
          orders.push(order);
        } catch (error) {
          console.error('Creating order failed', error);
        }
        ++customerNum;
        ++variationNum;
      }
    }),
  );
  console.log(
    'Successfully created orders',
    orders.map(o => o.id),
  );
  return orders;
}

/**
 * Search for catalog items created by the seeding script
 * @returns {CatalogItems[]}
 */
async function searchCatalogItems() {
  try {
    const {
      result: {items},
    } = await catalogApi.searchCatalogItems({
      textFilter: GRAPHQL_SAMPLE_APP_SKU,
    });
    return items;
  } catch (error) {
    console.error('Error occurred when searching catalog items', error);
    return [];
  }
}

/**
 * Search for orders created by the seeding script
 * @returns {Order[]}
 */
async function searchOrders() {
  const {
    result: {locations},
  } = await locationsApi.listLocations();
  const locationIds = locations
    .filter(location => {
      if (location.status === 'ACTIVE') {
        if (LOCATION_NAMES.includes(location.name)) {
          return true;
        }
      }
    })
    .map(location => location.id);
  const {
    result: {orders},
  } = await ordersApi.searchOrders({
    locationIds,
    query: {
      filter: {
        sourceFilter: {
          sourceNames: [GRAPHQL_SAMPLE_APP_REFERENCE_ID],
        },
        stateFilter: {
          states: ['OPEN'],
        },
      },
    },
  });
  return orders;
}

/**
 * Filter catalog objects for variations
 * @param {CatalogObject[]} catalogObjects
 * @returns {CatalogItemVariation[]}
 */
function filterItemVariations(catalogObjects) {
  const catalogItems = catalogObjects.filter(obj => obj.type === 'ITEM');
  const variations = [];
  for (const item of catalogItems) {
    for (const variation of item.itemData.variations) {
      // set the tax for the variation so we can apply it when we create orders
      if (item.itemData.taxIds) {
        variation.tax = item.itemData.taxIds[0];
      }
      variations.push(variation);
    }
  }
  return variations;
}

/**
 * Cancel all open orders created by the seeding script
 * WARNING: This is permanent and irreversable
 */
async function cancelOrders() {
  try {
    const orders = await searchOrders();
    if (!orders) {
      console.log('No orders to cancel');
      return;
    }
    for (const order of orders) {
      await ordersApi.updateOrder(order.id, {
        idempotencyKey: uuidv4(),
        order: {
          locationId: order.locationId,
          state: 'CANCELED',
          version: order.version,
        },
      });
    }
    console.log(
      'Successfully canceled orders',
      orders.map(o => o.id),
    );
  } catch (error) {
    console.error('Error occurred when canceling orders', error);
  }
}

/**
 * Delete all catalog items created by the seeding script
 * WARNING: This is permanent and irreversable
 */
async function deleteCatalogItems() {
  try {
    const items = await searchCatalogItems();
    if (!items) {
      console.log('No catalog items to delete');
      return;
    }
    const objectIds = new Set();
    for (const item of items) {
      objectIds.add(item.id);
      // add the category ids & tax ids of items since we want to delete those too
      if (item.itemData && item.itemData.categoryId) {
        objectIds.add(item.itemData.categoryId);
      }
      if (item.itemData && item.itemData.taxIds) {
        objectIds.add(item.itemData.taxIds[0]);
      }
    }
    if (items && items.length > 0) {
      const {
        result: {deletedObjectIds},
      } = await catalogApi.batchDeleteCatalogObjects({
        objectIds: Array.from(objectIds),
      });
      console.log('Successfully deleted catalog items', deletedObjectIds);
    }
  } catch (error) {
    console.error('Failed to clear catalog items', error);
  }
}

/**
 * Delete all customers created by the seeding script
 * WARNING: This is permanent and irreversable
 */
async function deleteTestCustomers() {
  try {
    const {
      result: {customers},
    } = await customersApi.searchCustomers({
      query: {
        filter: {
          referenceId: {
            exact: GRAPHQL_SAMPLE_APP_REFERENCE_ID,
          },
        },
      },
    });
    if (!customers) {
      console.log('No customers to delete');
      return;
    }
    const customerIds = customers.map(customer => customer.id);
    const deleteCustomerPromises = customerIds.map(customerId =>
      customersApi.deleteCustomer(customerId),
    );
    await Promise.all(deleteCustomerPromises);
    console.log('Successfully deleted customers', customerIds);
  } catch (error) {
    console.error('Failed to delete customers', error);
  }
}

/**
 * Deactivate Team Members created by the seeding script
 */
async function deactivateTeamMembers() {
  try {
    let {
      result: {teamMembers},
    } = await teamApi.searchTeamMembers({
      query: {
        filter: {
          isOwner: false,
          status: 'ACTIVE',
        },
      },
    });
    if (!teamMembers.length) {
      console.log('No team members to deactivate');
      return;
    }
    const inactiveTeamMembers = {teamMembers: {}};
    const teamIds = [];
    teamMembers.forEach(teamMember => {
      if (teamMember.referenceId === GRAPHQL_SAMPLE_APP_REFERENCE_ID) {
        inactiveTeamMembers.teamMembers[teamMember.id] = {
          id: teamMember.id,
          status: 'INACTIVE',
        };
        teamIds.push(teamMember.id);
      }
    });
    if (!Object.keys(inactiveTeamMembers.teamMembers).length) {
      console.log('no team members to deactivate');
      return;
    }
    await teamApi.bulkUpdateTeamMembers(inactiveTeamMembers);
    console.log('successfully deactivated team members', teamIds);
  } catch (error) {
    console.error('Failed to deactivate teamMembers', error);
  }
}

/** Deactivate created locations
 * Locations cannot be deleted, so we deactivate the ones created here
 * And we change the names to something random.
 * You can view your active and inactive locations here
 * https://squareup.com/dashboard/locations
 *
 */

async function deactivateLocations() {
  try {
    const {
      result: {locations},
    } = await locationsApi.listLocations();
    const locationData = locations.filter(location => {
      if (location.status === 'ACTIVE') {
        if (LOCATION_NAMES.includes(location.name)) {
          return true;
        }
      }
    });
    if (locationData.length === 0) {
      console.log('No locations to deactivate');
      return;
    }
    const locationPromises = locationData.map(location => {
      return locationsApi.updateLocation(location.id, {
        location: {
          status: 'INACTIVE',
          name: location.name + uuidv4(),
        },
      });
    });
    await Promise.all(locationPromises);
    console.log(
      'successfully deactivated locations',
      locationData.map(location => location.id),
    );
  } catch (error) {
    console.error('Failed to deactivate locations', error);
  }
}

/*
 * Main driver for the script.
 */
program
  .command('generate')
  .description('creates test data for customers, catalog items and orders')
  .action(async () => {
    const locationIds = await createTestLocations();
    await createTeamMembers(locationIds);
    const customerIds = await createTestCustomers();
    const objects = await createCatalogObjects();
    const variations = filterItemVariations(objects);
    if (!customerIds.length || !variations.length) {
      console.error(
        'No customers or item variations to create orders for. Exiting script',
      );
      return;
    }
    await createOrders(customerIds, locationIds, variations);
  });

program
  .command('clear')
  .description('clears test data for customers, catalog items and orders')
  .action(async () => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(
      'Are you sure you want to clear all test data created by the seeding script? (y/n) ',
      async ans => {
        if (ans.toUpperCase() === 'Y') {
          await deactivateTeamMembers();
          await deleteTestCustomers();
          await deleteCatalogItems();
          await cancelOrders();
          await deactivateLocations();
        }
        rl.close();
      },
    );
  });

program.parse(process.argv);

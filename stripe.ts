// const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
import * as dotenv from 'dotenv';
dotenv.config();


import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2020-08-27', // Use an appropriate API version for your use case.
});


/**
 * Check if a customer with the given email has an active subscription.
 * 
 * @param email The email of the customer.
 * @returns Promise<boolean> Returns true if the customer has an active subscription, false otherwise.
 */
async function hasActiveSubscription(email: string): Promise<boolean> {
    try {
        // Fetch customers with the given email
        const customers = await stripe.customers.list({ email });

        // If no customer found with the given email
        if (customers.data.length === 0) {
            return false;
        }

        // Assuming a customer can have multiple subscriptions, check each one
        for (const customer of customers.data) {
            const subscriptions = await stripe.subscriptions.list({ customer: customer.id });

            for (const subscription of subscriptions.data) {
                if (subscription.status === 'active') {
                    return true;
                }
            }
        }

        return false;
    } catch (error) {
        console.error('Error checking subscription:', error);
        throw error;
    }
}

/**
 * Fetches customer IDs by email.
 * @param {string} email - The email address.
 * @returns {Promise<string[]>} - A promise that resolves to a list of customer IDs.
 * @example
 * const ids = await getCustomerIdsByEmail('example@example.com');
 */
const getCustomerIdsByEmail = async (email: string): Promise<string[]> => {
    try {
        const { data } = await stripe.customers.list({
            limit: 10,
            email,
        });
        return data.map(customer => customer.id);
    } catch (error) {
        console.error('Error fetching customer IDs:', error);
        throw error;
    }
};

/**
 * Fetches the first subscription of a customer by email.
 * @param {string} email - The email address.
 * @returns {Promise<object|null>} - A promise that resolves to the first subscription or null.
 */
export const getCustomerSubscriptionById = async (email: string) => {
    const customerIDsList = await getCustomerIdsByEmail(email);
    for (const customerID of customerIDsList) {
        const { data } = await stripe.subscriptions.list({
            limit: 10,
            customer: customerID,
            status: 'all'
        });
        if (data.length > 0) {
            return data[0];
        }
    }
    return null;
};

/**
 * Fetches all subscriptions of a customer by customer ID.
 * @param {string} cusID - The customer ID.
 * @returns {Promise<object[]>} - A promise that resolves to a list of subscriptions.
 */
const getCustomerSubscriptionBycusID = async (cusID: string) => {
    const { data } = await stripe.subscriptions.list({
        customer: cusID,
        status: 'all'
    });
    return data;
};

/**
 * Fetches all subscriptions of a customer by email.
 * @param {string} email - The email address.
 * @returns {Promise<object[]>} - A promise that resolves to a list of subscriptions.
 */
export const getCustomerSubByEmail = async (email: string) => {
    const customerIDsList = await getCustomerIdsByEmail(email);
    const subscriptions = [];

    for (const customerID of customerIDsList) {
        const customerSubscriptions = await getCustomerSubscriptionBycusID(customerID);
        subscriptions.push(...customerSubscriptions);
    }

    return subscriptions;
};

/**
 * Checks if a customer has an active subscription by email.
 * @param {string} email - The email address.
 * @returns {Promise<boolean>} - A promise that resolves to true if the customer has an active subscription, otherwise false.
 */
export const checkSubscription = async (email: string) => {
    const customerIDsList = await getCustomerIdsByEmail(email);
    console.log("checking strip")

    for (const customerID of customerIDsList) {
        const { data } = await stripe.subscriptions.list({
            limit: 10,
            customer: customerID,
            status: 'all'
        });

        const hasActiveSubscription = data.some(subscription => subscription.status === "active");
        if (hasActiveSubscription) {
            return true;
        }
    }

    return false;
};

/**
 * Fetches all subscription data of a customer by email.
 * @param {string} email - The email address.
 * @returns {Promise<object[]|false>} - A promise that resolves to a list of subscription data or false.
 */
export const subscriptionData = async (email: string) => {
    const customerIDsList = await getCustomerIdsByEmail(email);

    for (const customerID of customerIDsList) {
        const { data } = await stripe.subscriptions.list({
            limit: 10,
            customer: customerID,
            status: 'all'
        });

        if (data.length > 0) {
            return data;
        }
    }

    return false;
};






interface SubscriptionDetails {
    productId: string;
    productName: string;
    startDate: Date;
    currentPeriodEnd: Date;
    amount: number;
    currency: string;
}

/**
 * Get details about a customer's active subscription.
 * 
 * @param email The email of the customer.
 * @returns Promise<SubscriptionDetails[]> Returns an array of details about the customer's active subscriptions.
 */

const subscriptions = [
    { id: 'prod_ORVVQvf4NNIrHM', name: 'TTS-500k', chars: 500000 },
    { id: 'prod_ORVTaqllmu66Sh', name: 'TTS-250k', chars: 250000 },
    { id: 'prod_ORVRHvcGGnacnS', name: 'TTS-100k', chars: 100000 },
    { id: 'prod_ORHkZD7RnyjpJt', name: 'TTS-50k', chars: 50000 },
    { id: 'prod_L5FdspKcIm93KY', name: 'Premium Subscription', chars: 50000 },
    { id: 'prod_MSKBmbdLqGnUgQ', name: 'Premium Plan - Autumn 2022', chars: 50000 }]

async function getActiveSubscriptionDetails(email: string): Promise<SubscriptionDetails[]> {
    try {
        const result: SubscriptionDetails[] = [];

        // Fetch customers with the given email
        const customers = await stripe.customers.list({ email });

        // If no customer found with the given email
        if (customers.data.length === 0) {
            return [];
        }

        // Loop through each customer (though typically there might be just one customer with a unique email)
        for (const customer of customers.data) {
            const subscriptions = await stripe.subscriptions.list({ customer: customer.id });

            for (const subscription of subscriptions.data) {
                if (subscription.status === 'active') {
                    const product = await stripe.products.retrieve(subscription.items.data[0].price.product as string);

                    result.push({
                        productId: product.id,
                        productName: product.name || 'N/A',
                        startDate: new Date(subscription.start_date * 1000), // Convert from UNIX timestamp to Date
                        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
                        amount: subscription.items.data[0].price.unit_amount || 0,
                        currency: subscription.items.data[0].price.currency,
                    });
                }
            }
        }

        return result;
    } catch (error) {
        console.error('Error fetching subscription details:', error);
        throw error;
    }
}


async function getAllSubscriptions(): Promise<Array<{ id: string, plan: string }>> {
    const subscriptions = await stripe.subscriptions.list();
    return subscriptions.data.map(sub => ({
        id: sub.id,
        plan: sub.items.data[0]?.plan.id || 'N/A',
    }));
}


async function getAllProducts(): Promise<Array<{ id: string, name: string }>> {
    const products = await stripe.products.list();
    return products.data.map(product => ({
        id: product.id,
        name: product.name,
    }));
}




export async function getTotalCharsForActiveSubscriptions(email: string): Promise<number> {
    try {
        const activeSubscriptions = await getActiveSubscriptionDetails(email);
        let totalChars = 0;

        for (const subscription of activeSubscriptions) {
            const productChars = subscriptions.find(sub => sub.id === subscription.productId)?.chars || 0;
            totalChars += productChars;
        }

        return totalChars;
    } catch (error) {
        console.error('Error fetching total chars for active subscriptions:', error);
        throw error;
    }
}

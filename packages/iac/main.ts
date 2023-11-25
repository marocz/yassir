
import { OrderItems } from '@cdktf/provider-hashicups/lib/order';
import { App } from 'cdktf';
import { HashiCupsStack } from './services/HashiCupStack';
import { getCoffeeId } from './util/getCoffeeById';

const app = new App();
const hashiCupsStack = new HashiCupsStack(app, 'yassir-challenge');
app.synth();
// Create a new order
hashiCupsStack.createOrder("firstorder",3,["Espresso", "Coffee"]);

// Prepare updated items for an existing order
const updatedItems: OrderItems[] = [
  { quantity: 1, coffee: { id: getCoffeeId('Espresso') } },
  { quantity: 1, coffee: { id: getCoffeeId('Latte') } }
];

// Update an existing order (assuming you have an existing order ID)
const existingOrderId = 123; // Replace with the actual existing order ID
hashiCupsStack.updateOrder(existingOrderId, updatedItems);
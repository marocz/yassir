// Copyright (c) HashiCorp, Inc
// SPDX-License-Identifier: MPL-2.0
import { OrderItems } from "@cdktf/provider-hashicups/lib/order";
import { Testing } from 'cdktf';
import "cdktf/lib/testing/adapters/jest"; // Load types for expect matchers
import { Construct } from 'constructs';
import { promises as fs } from 'fs';
import * as path from 'path';
import { MyCoffeeStand, OrderManager } from '../main';



interface Coffee {
  id: string;
  name: string;
  description: string;
  price: number;
  ingredients: Ingredient[];
}
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
}
describe("My CDKTF Application", () => {
  // The tests below are example tests, you can find more information at
  // https://cdk.tf/testing
 

  let orderManager: OrderManager;
  const app = Testing.app();
  const mockScope = new Construct(app, "testorder");
  let orderCounter = 0; // A counter to ensure unique IDs for each test

  beforeEach(() => {
    const mockCoffees: Coffee[] = [
      { id: '1', name: 'Espresso', description: 'Strong coffee', price: 3, ingredients: [] },
      { id: '2', name: 'Latte', description: 'Milk coffee', price: 4, ingredients: [] }
      // Add more mock coffees as needed
    ];
    orderCounter++; 
    orderManager = new OrderManager(mockScope, `testOrder${orderCounter}`, 2, mockCoffees);
  });

  test('getCoffeeByName returns null if coffee not found', () => {
  
    const myCoffeeStand = new MyCoffeeStand(mockScope, `Coffee`);
    const coffee = myCoffeeStand.getCoffeeByName('NonExistentCoffee');
    expect(coffee).toBeNull();
  });

  test('should create order correctly', () => {
    const order = orderManager.getorderCreated();
    expect(order).toBeDefined();
    expect(order.items.get.length).toBeGreaterThan(0);
  });

  test('should update order correctly', async () => {
    const newItems: OrderItems[] = [
      { quantity: 4, coffee: { id: 1 } },
      { quantity: 5, coffee: { id: 2 } }
    ];
    await orderManager.updateOrder(1, newItems);
  
  });
  test('should create order folder with files', async () => {
    const orderId = 'testOrder01';
    const mockOrderItems: OrderItems[] = [
      { quantity: 2, coffee: { id: 1 } },
      { quantity: 3, coffee: { id: 2 } }
    ];
    await orderManager.createOrderFolder(orderId, mockOrderItems);
    const orderPath = path.join(__dirname,'..', 'orders', orderId);
    console.log('Order path:', orderPath); 

  let exists2;
  try {
    await fs.stat(orderPath);
    exists2 = true;
  } catch (error) {
    exists2 = false;
  }
 //   const exists = await fs.stat(orderPath).then(() => true).catch(() => false);
    expect(exists2).toBe(true);
  });
  test('should read order items correctly', async () => {
    const mockOrderItems: OrderItems[] = [
      { quantity: 2, coffee: { id: 1 } },
      { quantity: 3, coffee: { id: 2 } }
    ];
    const orderId = 'testOrder02';
    await orderManager.createOrderFolder(orderId, mockOrderItems);
    const items = await orderManager.readOrderItems(orderId);
    const expectedItems = {
      '1': 2, // Quantity for coffee with ID '1'
      '2': 3  // Quantity for coffee with ID '2'
    };
    expect(items).toEqual(expectedItems);
  });
});

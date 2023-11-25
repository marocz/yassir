import { DataHashicupsOrder } from '@cdktf/provider-hashicups/lib/data-hashicups-order';
import { Order, OrderConfig, OrderItems } from '@cdktf/provider-hashicups/lib/order';
import { Construct } from 'constructs';
import { promises as fs } from 'fs';
import { Coffee } from '../shared/interfaces/coffee.interface';
import { OrderItemsDetails } from '../shared/interfaces/orderitemsdetails.interface';
import path = require('path');

export class OrderManager extends Construct {
    private order: Order;
    constructor(scope: Construct, id: string, count: number, coffees: Coffee[]) {
      super(scope, id);
  
      // Convert Coffee array to OrderItems array
      const items: OrderItems[] = coffees.map(coffee => ({
        quantity: count, // Set the desired quantity for each coffee
        coffee: {
          id: parseInt(coffee.id) // Convert coffee ID to number as required by the API
        },
      }));
  
      // Create Order configuration
      const orderConfig: OrderConfig = {
        items: items
      };
  
      // Create the order
      this.order = new Order(this, `Order_${id}`, orderConfig);
    
            // Immediately invoked async function to handle the creation of the order folder
            (async () => {
                try {
                    await this.createOrderFolder(`Order_${id}`, items);
                } catch (error) {
                    console.error("Error creating order folder:", error);
                }
            })();
        }
    
 
    getorderCreated(){
        return this.order;
    }
    updateOrder(orderId: number, newItems: OrderItems[]) {
        try {
        const existingOrder = new DataHashicupsOrder(this, 'ExistingOrder', { id: orderId });
        
     
        // Update the order with new items
        existingOrder.overrideLogicalId('Order');
        existingOrder.addOverride('items', newItems);
      } catch (error) {
        console.error(`Failed to update order ${orderId}:`, error);
        // Optionally, rethrow the error or handle it as per your application's error handling strategy
      }
      }
        // New Methods for file operations
  async createOrderFolder(orderId: string, items: OrderItems[]) {
    const orderPath = path.join(__dirname,'..' ,'orders', orderId);
    try{
    await fs.mkdir(orderPath, { recursive: true });

    for (const item of items) {
      const filePath = path.join(orderPath, `${item.coffee.id}.txt`);
      await fs.writeFile(filePath, item.quantity.toString());
    }
    } catch (error) {
    console.error(`Failed to create order folder for order ${orderId}:`, error);
    // Handle the error as required
  }
  }

  async readOrderItems(orderId: string) {
    const orderPath = path.join(__dirname, '..' ,'orders', orderId);
    try {
    const files = await fs.readdir(orderPath);
    const items: OrderItemsDetails = {}; 
    

    for (const file of files) {
      const filePath = path.join(orderPath, file);
      const content = await fs.readFile(filePath, 'utf8');
      items[file.replace('.txt', '')] = parseInt(content);
    }

    return items;
    } catch (error) {
    console.error(`Failed to read order items for order ${orderId}:`, error);
    throw error; 
  }
  }

  }
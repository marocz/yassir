
import { dataHashicupsCoffees, dataHashicupsIngredients, provider } from '@cdktf/provider-hashicups';
import { DataHashicupsOrder } from '@cdktf/provider-hashicups/lib/data-hashicups-order';
import { Order, OrderConfig, OrderItems } from '@cdktf/provider-hashicups/lib/order';
import { App, TerraformDataSource, TerraformStack } from 'cdktf';
import { Construct } from 'constructs';
import { promises as fs } from 'fs';
import path = require('path');



export interface Ingredient {
    id: string;
    name: string;
    quantity: number;
  }
  //const coffeeTypes = ["espresso","cappucino"];
  interface Coffee {
    id: string;
    name: string;
    description: string;
    price: number;
    ingredients: Ingredient[];
  }
  interface RawCoffee {
    id: string;
    name: string;
    description: string;
    price: number;
    ingredients: any[]; 
  }
  interface OrderItemsDetails {
    [key: string]: number;
  }
  
  function getCoffeeId(coffeeName: string): number {
    const coffeeMap: { [key: string]: number } = { 'Espresso': 101, 'Cappuccino': 102, 'Latte': 103 };
    return coffeeMap[coffeeName] || 0;
  }
  
export class MyCoffeeStand extends TerraformDataSource {

    private dataHashicupsCoffees: dataHashicupsCoffees.DataHashicupsCoffees;
    public coffees: Coffee[]=[];
    constructor(scope: Construct, name: string ){
      super(scope, name,  {
        terraformResourceType: 'hashicups_coffees',
      });
   
      this.dataHashicupsCoffees = new dataHashicupsCoffees.DataHashicupsCoffees(this, `HashicupsCoffee_${name}`);
  
      this.coffees = this.processCoffees();
    }

    public getCoffeeByName(coffeeName: string): Coffee | null {
        console.log("Available coffees:", this.coffees); // Debugging: Log available coffees

        const foundCoffee = this.coffees.find(coffee => coffee.name.toLowerCase() === coffeeName.toLowerCase());
      
        if (!foundCoffee) {
          console.error(`Coffee type '${coffeeName}' not found in available coffees`); // Debugging: Log error if not found
        }
      
        return foundCoffee || null;
      }
  
    private processCoffees(): Coffee[] {
 
          // Fetch coffees from data source
    try {
        
        
        for (let i = 0; i < 3; i++) {
        const coffeeRef = this.dataHashicupsCoffees.coffees.get(i);
        if (coffeeRef) {
            const ingredientIds: number[] = [];

            for (let j = 0; j < coffeeRef.ingredients.get.length; j++) {
                const ingredientRef = coffeeRef.ingredients.get(j);
                if (ingredientRef && ingredientRef.ingredientId) {
                  // Add the ingredient ID to the array
                  ingredientIds.push(ingredientRef.ingredientId);
                }
              }
          const rawCoffee: RawCoffee = {
            id: coffeeRef.id.toString(),
            name: coffeeRef.name,
            description: coffeeRef.description,
            price: coffeeRef.price,
            ingredients: this.processIngredients(ingredientIds)
          };
  
          this.coffees.push(rawCoffee);

        }
    }
    } catch (error) {
      // Reached the end of the list or encountered an error
      console.log('Sorry, Error processing your Coffeee');
    }
    // Process raw data into Coffee array
    return this.coffees;
   
    }
    private processIngredients(ingredientIds: number[]): Ingredient[] {
        const ingredients: Ingredient[] = [];
      
        ingredientIds.forEach(ingredientId => {
          const ingredientDataSource = new dataHashicupsIngredients.DataHashicupsIngredients(this, `ingredient_${ingredientId}`, {
            coffeeId: ingredientId
          });
      
          // Iterate over the ingredients list and extract details
          for (let i = 0; i < ingredientDataSource.ingredients.get.length; i++) {
            const ingredientRef = ingredientDataSource.ingredients.get(i);
      
            if (ingredientRef) {
              ingredients.push({
                id: ingredientRef.id.toString(),
                name: ingredientRef.name,
                quantity: ingredientRef.quantity
              });
            }
          }
        });
      
        return ingredients;
      }  
    
  }

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
    const orderPath = path.join(__dirname, 'orders', orderId);
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
    const orderPath = path.join(__dirname, 'orders', orderId);
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

class HashiCupsStack extends TerraformStack {
    private coffeeStand: MyCoffeeStand;
    private espressoStand: MyCoffeeStand;
    private orderManager: OrderManager | null = null; 
   constructor(scope: Construct, name: string) {
     super(scope, name);

    // Initialize HashiCups provider
    new provider.HashicupsProvider(this, 'hashicups', {
      host: 'http://localhost:19090'

    });
    

    // Create Coffee Stands
    this.coffeeStand = new MyCoffeeStand(this, `Coffee`);
    this.espressoStand = new MyCoffeeStand(this, `Espresso`);

      this.orderManager = new OrderManager(this, 'initialOrder', 2, [this.coffeeStand.coffees[0], this.espressoStand.coffees[0]]);
    
    }
    
    public createOrder(name: string, quantity: number, coffeeTypes: string[]): void {
        // Create initial order with specified items
        
        const coffees: Coffee[] = coffeeTypes.map(type => {

            let coffee;
            if(type == 'Coffee'){
                 coffee = this.coffeeStand.coffees[0];
            } else if(type == 'Espresso'){
                 coffee = this.espressoStand.coffees[0];
            }
            
            if (!coffee) {
              throw new Error(`Coffee type '${type}' not found`);
            }
            return coffee;
          });
      
        this.orderManager = new OrderManager(this, name, quantity, coffees);
      }
    
      public updateOrder(existingOrderId: number, updatedItems: OrderItems[]): void {
        // Check if OrderManager is initialized
        if (!this.orderManager) {
          console.error("OrderManager is not initialized. Please create an order first.");
          return;
        }
    
        // Update the existing order with new items
        this.orderManager.updateOrder(existingOrderId, updatedItems);
      }
}

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
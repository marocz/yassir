
import { provider } from '@cdktf/provider-hashicups';
import { OrderItems } from '@cdktf/provider-hashicups/lib/order';
import { TerraformStack } from 'cdktf';
import { Construct } from 'constructs';
import { MyCoffeeStand } from '../services/MyCoffeeStand';
import { Coffee } from '../shared/interfaces/coffee.interface';
import { OrderManager } from './OrderManager';


export class HashiCupsStack extends TerraformStack {
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

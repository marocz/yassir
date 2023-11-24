
import { dataHashicupsCoffees, dataHashicupsIngredients, provider } from '@cdktf/provider-hashicups';
import { App, TerraformDataSource, TerraformStack } from 'cdktf';
import { Construct } from 'constructs';



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
    ingredients: any[]; // Adjust this type based on the actual structure of ingredients
  }
  
  
export class MyCoffeeStand extends TerraformDataSource {

    private dataHashicupsCoffees: dataHashicupsCoffees.DataHashicupsCoffees;
    public coffees: Coffee[]=[];
    constructor(scope: Construct, name: string ){//{ ingredientIds: string[] }) {
      super(scope, name,  {
        terraformResourceType: 'hashicups_coffees',
      });
   
      this.dataHashicupsCoffees = new dataHashicupsCoffees.DataHashicupsCoffees(this, `HashicupsCoffee_${name}`);
  
      this.coffees = this.processCoffees();
    }
  
    private processCoffees(): Coffee[] {
 
          // Fetch coffees from data source
    // const rawCoffees = this.dataHashicupsCoffees.coffees; // Assuming this is how you access the raw data
    // const rawCoffeesArray: RawCoffee[] = [];
    try {
        
        
        for (let i = 0; i < 3; i++) {
        const coffeeRef = this.dataHashicupsCoffees.coffees.get(i);
        if (coffeeRef) {
            const ingredientIds: number[] = [];

            for (let j = 0; i < coffeeRef.ingredients.get.length; j++) {
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
          

// Iterate over the ingredients list and extract the ingredient IDs

        }
    }
    } catch (error) {
      // Reached the end of the list or encountered an error
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
class HashiCupsStack extends TerraformStack {
   constructor(scope: Construct, name: string) {
     super(scope, name);

    // Initialize HashiCups provider
    new provider.HashicupsProvider(this, 'hashicups', {
      host: 'http://localhost:19090'

    });
    
      new MyCoffeeStand(this, `Coffee`);
      new MyCoffeeStand(this, `Espresso`);
     

      

    }
    
}

const app = new App();
new HashiCupsStack(app, 'yassir-challenge');
app.synth();

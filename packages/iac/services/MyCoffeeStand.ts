import { dataHashicupsCoffees, dataHashicupsIngredients } from '@cdktf/provider-hashicups';
import { TerraformDataSource } from 'cdktf';
import { Construct } from 'constructs';
import { Coffee } from '../shared/interfaces/coffee.interface';
import { Ingredient } from "../shared/interfaces/ingredient.interface";
import { RawCoffee } from '../shared/interfaces/rawcoffee.interface';

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
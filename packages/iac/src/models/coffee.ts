// import { Coffee } from '@cdktf/provider-hashicups';
// import { TerraformResource } from 'cdktf';
// import { Construct } from 'constructs';
// import { Ingredient } from './ingredients';

// export interface CoffeeTypeConfig {
//   name: string;
//   description: string;
//   price: number;
//   ingredients: Ingredient[];
// }

// export class CoffeeType extends TerraformResource {
//   constructor(scope: Construct, id: string, config: CoffeeTypeConfig) {
//   //  super(scope, id, config );

//     new Coffee(this, id, {
//       name: config.name,
//       description: config.description,
//       price: config.price,
//       ingredients: config.ingredients.map(ingredient => ({
//         ingredientId: ingredient.id,
//         quantity: ingredient.quantity
//       })),
//     });
//   }
// }

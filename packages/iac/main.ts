// import { Construct } from "constructs";
// import { App, TerraformStack } from "cdktf";
// import { provider } from '@cdktf/provider-hashicups';
// import { dataHashicupsCoffees } from '@cdktf/provider-hashicups'

import { provider } from '@cdktf/provider-hashicups';
import { App, TerraformStack } from 'cdktf';
import { Construct } from 'constructs';
//import { CoffeeType, CoffeeTypeConfig } from './src/models/coffee';
//import { CoffeeOrder, OrderConfig } from './src/models/orders';

class HashiCupsStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // Initialize HashiCups provider
    new provider.HashicupsProvider(this, 'hashicups', {
      host: 'http://localhost:19090'

    });

    // Define ingredients
    // const espressoIngredients: Ingredient[] = [
    //   { id: '1', name: 'Coffee', quantity: 1 },
    //   { id: '2', name: 'Water', quantity: 1 }
    // ];

    // const latteIngredients: Ingredient[] = [
    //   { id: '1', name: 'Coffee', quantity: 1 },
    //   { id: '3', name: 'Milk', quantity: 2 }
    // ];

  //   // Define coffee types with ingredients
  //   const espressoConfig: CoffeeTypeConfig = {
  //     name: 'Espresso',
  //     description: 'Strong and dark coffee',
  //     price: 3,
  //     ingredients: espressoIngredients
  //   };
  //   new CoffeeType(this, 'espresso', espressoConfig);

  //   const latteConfig: CoffeeTypeConfig = {
  //     name: 'Latte',
  //     description: 'Milk coffee',
  //     price: 4,
  //     ingredients: latteIngredients
  //   };
  //   new CoffeeType(this, 'latte', latteConfig);

  //   // Create an order
  //   const orderConfig: OrderConfig = {
  //     coffeeId: 'espresso',
  //     quantity: 2
  //   };
  //   new CoffeeOrder(this, 'order1', orderConfig);
   }
}

const app = new App();
new HashiCupsStack(app, 'yassir-challenge');
app.synth();

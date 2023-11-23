// import { order } from '@cdktf/provider-hashicups';
// import { TerraformResource } from 'cdktf';
// import { Construct } from 'constructs';

// export interface OrderConfig {
//   coffeeId: string;
//   quantity: number;
// }

// export class CoffeeOrder extends TerraformResource {
//   constructor(scope: Construct, id: string, config: OrderConfig) {
//     super(scope, id, config);

//     new order.Order(this, id, {
//       items: [{ coffeeId: config.coffeeId, quantity: config.quantity }]
//     });
//   }
// }

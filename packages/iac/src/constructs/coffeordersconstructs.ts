import { TerraformResource } from 'cdktf';
import { Construct } from 'constructs';

export interface CoffeeOrderConfig {
  name: string;
  ingredients: string[];
  price: number;
  description: string;
}

export class CoffeeOrderConstruct extends TerraformResource {
  constructor(scope: Construct, id: string, config: CoffeeOrderConfig) {
    super(scope, id);

    // Define Terraform resources here using `config`
    // This is where you translate your TypeScript models into Terraform resources
  }
}

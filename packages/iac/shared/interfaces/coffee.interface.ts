//const coffeeTypes = ["espresso","cappucino"];
import { Ingredient } from "./ingredient.interface";

export interface Coffee {
    id: string;
    name: string;
    description: string;
    price: number;
    ingredients: Ingredient[];
}
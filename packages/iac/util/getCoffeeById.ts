
export function getCoffeeId(coffeeName: string): number {
    const coffeeMap: { [key: string]: number } = { 'Espresso': 101, 'Cappuccino': 102, 'Latte': 103 };
    return coffeeMap[coffeeName] || 0;
  }
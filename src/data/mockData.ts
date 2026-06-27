export interface Product {
  id: string;
  name: string;
  category: string;
  emoji: string;
}

export interface InventoryItem {
  productId: string;
  price: number;
  stock: number;
}

export interface Retailer {
  id: string;
  name: string;
  address: string;
  distance: string;
  emoji: string;
  inventory: InventoryItem[];
}

export const products: Product[] = [
  {id: 'p1', name: 'Maggi Noodles', category: 'Instant Food', emoji: '🍜'},
  {id: 'p2', name: 'Amul Butter', category: 'Dairy', emoji: '🧈'},
  {id: 'p3', name: 'Tata Salt', category: 'Essentials', emoji: '🧂'},
  {id: 'p4', name: 'Parle-G Biscuits', category: 'Snacks', emoji: '🍪'},
  {id: 'p5', name: 'Surf Excel', category: 'Household', emoji: '🧴'},
  {id: 'p6', name: 'Dairy Milk Chocolate', category: 'Snacks', emoji: '🍫'},
  {id: 'p7', name: 'Aashirvaad Atta', category: 'Essentials', emoji: '🌾'},
  {id: 'p8', name: 'Red Label Tea', category: 'Beverages', emoji: '🍵'},
];

export const retailers: Retailer[] = [
  {
    id: 'r1',
    name: 'Sharma Kirana Store',
    address: 'MG Road, Sector 5',
    distance: '0.5 km',
    emoji: '🏪',
    inventory: [
      {productId: 'p1', price: 14, stock: 10},
      {productId: 'p2', price: 56, stock: 5},
      {productId: 'p3', price: 28, stock: 15},
      {productId: 'p4', price: 10, stock: 20},
      {productId: 'p6', price: 40, stock: 8},
      {productId: 'p8', price: 180, stock: 3},
    ],
  },
  {
    id: 'r2',
    name: 'Quick Mart',
    address: 'Station Road, Block B',
    distance: '1.2 km',
    emoji: '🛒',
    inventory: [
      {productId: 'p1', price: 15, stock: 0}, // Out of stock per assessment example
      {productId: 'p2', price: 54, stock: 3},
      {productId: 'p5', price: 125, stock: 6},
      {productId: 'p6', price: 42, stock: 0},
      {productId: 'p7', price: 320, stock: 4},
      {productId: 'p8', price: 175, stock: 7},
    ],
  },
  {
    id: 'r3',
    name: 'Daily Needs Express',
    address: 'Lake View Colony',
    distance: '2.0 km',
    emoji: '🏬',
    inventory: [
      {productId: 'p1', price: 14, stock: 5},
      {productId: 'p3', price: 30, stock: 10},
      {productId: 'p4', price: 10, stock: 25},
      {productId: 'p5', price: 130, stock: 3},
      {productId: 'p7', price: 315, stock: 2},
    ],
  },
];

import React, {createContext, useContext, useReducer, useRef, useCallback, useEffect, type ReactNode} from 'react';
import {products as seedProducts, retailers as seedRetailers, type Product, type Retailer} from '../data/mockData';

// === TYPES ===
export type OrderStatus = 'Placed' | 'Accepted' | 'Rejected' | 'Packed' | 'ReadyForPickup' | 'PickedUp' | 'Delivered' | 'Cancelled';

export interface StatusHistoryEntry {
  status: OrderStatus;
  timestamp: number;
}

export interface Order {
  id: string;
  customerId: string;
  retailerId: string;
  productId: string;
  productName: string;
  retailerName: string;
  quantity: number;
  totalPrice: number;
  status: OrderStatus;
  deliveryPartnerId: string | null;
  statusHistory: StatusHistoryEntry[];
  createdAt: number;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  timestamp: number;
  forRole: 'customer' | 'retailer' | 'delivery' | 'all';
  read: boolean;
}

interface AppState {
  products: Product[];
  retailers: Retailer[];
  orders: Order[];
  notifications: AppNotification[];
  orderCounter: number;
}

// === ACTIONS ===
type AppAction =
  | {type: 'PLACE_ORDER'; payload: {customerId: string; retailerId: string; productId: string; quantity: number; orderId: string}}
  | {type: 'ACCEPT_ORDER'; payload: {orderId: string}}
  | {type: 'REJECT_ORDER'; payload: {orderId: string}}
  | {type: 'UPDATE_ORDER_STATUS'; payload: {orderId: string; status: OrderStatus}}
  | {type: 'ACCEPT_DELIVERY'; payload: {orderId: string; deliveryPartnerId: string}}
  | {type: 'AUTO_CANCEL_ORDER'; payload: {orderId: string}}
  | {type: 'ADD_NOTIFICATION'; payload: {message: string; type: AppNotification['type']; forRole: AppNotification['forRole']}}
  | {type: 'DISMISS_NOTIFICATION'; payload: {notificationId: string}};

// === INITIAL STATE ===
const initialState: AppState = {
  products: seedProducts,
  retailers: [...seedRetailers.map(r => ({...r, inventory: r.inventory.map(i => ({...i}))}))],
  orders: [],
  notifications: [],
  orderCounter: 0,
};

// === HELPERS ===
function makeNotification(message: string, type: AppNotification['type'], forRole: AppNotification['forRole']): AppNotification {
  return {id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, message, type, timestamp: Date.now(), forRole, read: false};
}

// === REDUCER ===
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'PLACE_ORDER': {
      const {customerId, retailerId, productId, quantity, orderId} = action.payload;
      const retailer = state.retailers.find(r => r.id === retailerId);
      const product = state.products.find(p => p.id === productId);
      const inv = retailer?.inventory.find(i => i.productId === productId);
      if (!retailer || !product || !inv || inv.stock < quantity) return state;

      const now = Date.now();
      const order: Order = {
        id: orderId, customerId, retailerId, productId,
        productName: product.name, retailerName: retailer.name,
        quantity, totalPrice: inv.price * quantity,
        status: 'Placed', deliveryPartnerId: null,
        statusHistory: [{status: 'Placed', timestamp: now}],
        createdAt: now,
      };

      const updatedRetailers = state.retailers.map(r =>
        r.id === retailerId
          ? {...r, inventory: r.inventory.map(i => i.productId === productId ? {...i, stock: i.stock - quantity} : i)}
          : r,
      );

      return {
        ...state,
        orders: [...state.orders, order],
        retailers: updatedRetailers,
        orderCounter: state.orderCounter + 1,
        notifications: [...state.notifications, makeNotification(`New order ${orderId} for ${product.name}`, 'info', 'retailer')],
      };
    }

    case 'ACCEPT_ORDER': {
      const {orderId} = action.payload;
      const now = Date.now();
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === orderId && o.status === 'Placed'
            ? {...o, status: 'Accepted' as OrderStatus, statusHistory: [...o.statusHistory, {status: 'Accepted' as OrderStatus, timestamp: now}]}
            : o,
        ),
        notifications: [...state.notifications, makeNotification(`Order ${orderId} accepted by retailer!`, 'success', 'customer')],
      };
    }

    case 'REJECT_ORDER': {
      const {orderId} = action.payload;
      const now = Date.now();
      const order = state.orders.find(o => o.id === orderId);
      const updatedRetailers = order
        ? state.retailers.map(r =>
            r.id === order.retailerId
              ? {...r, inventory: r.inventory.map(i => i.productId === order.productId ? {...i, stock: i.stock + order.quantity} : i)}
              : r,
          )
        : state.retailers;

      return {
        ...state,
        retailers: updatedRetailers,
        orders: state.orders.map(o =>
          o.id === orderId && o.status === 'Placed'
            ? {...o, status: 'Rejected' as OrderStatus, statusHistory: [...o.statusHistory, {status: 'Rejected' as OrderStatus, timestamp: now}]}
            : o,
        ),
        notifications: [...state.notifications, makeNotification(`Order ${orderId} was rejected by the retailer.`, 'error', 'customer')],
      };
    }

    case 'UPDATE_ORDER_STATUS': {
      const {orderId, status} = action.payload;
      const now = Date.now();
      const msgs: Record<string, {msg: string; role: AppNotification['forRole']; type: AppNotification['type']}> = {
        Packed: {msg: `Order ${orderId} has been packed!`, role: 'customer', type: 'info'},
        ReadyForPickup: {msg: `Order ${orderId} is ready for pickup!`, role: 'delivery', type: 'info'},
        PickedUp: {msg: `Order ${orderId} picked up by delivery partner!`, role: 'customer', type: 'info'},
        Delivered: {msg: `Order ${orderId} delivered successfully! 🎉`, role: 'customer', type: 'success'},
      };
      const n = msgs[status];
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === orderId ? {...o, status, statusHistory: [...o.statusHistory, {status, timestamp: now}]} : o,
        ),
        notifications: n ? [...state.notifications, makeNotification(n.msg, n.type, n.role)] : state.notifications,
      };
    }

    case 'ACCEPT_DELIVERY': {
      const {orderId, deliveryPartnerId} = action.payload;
      return {
        ...state,
        orders: state.orders.map(o =>
          o.id === orderId && o.status === 'ReadyForPickup' ? {...o, deliveryPartnerId} : o,
        ),
        notifications: [...state.notifications, makeNotification(`Delivery partner assigned to order ${orderId}`, 'info', 'customer')],
      };
    }

    case 'AUTO_CANCEL_ORDER': {
      const {orderId} = action.payload;
      const now = Date.now();
      const order = state.orders.find(o => o.id === orderId);
      if (!order || order.status !== 'Placed') return state;

      const updatedRetailers = state.retailers.map(r =>
        r.id === order.retailerId
          ? {...r, inventory: r.inventory.map(i => i.productId === order.productId ? {...i, stock: i.stock + order.quantity} : i)}
          : r,
      );

      return {
        ...state,
        retailers: updatedRetailers,
        orders: state.orders.map(o =>
          o.id === orderId ? {...o, status: 'Cancelled' as OrderStatus, statusHistory: [...o.statusHistory, {status: 'Cancelled' as OrderStatus, timestamp: now}]} : o,
        ),
        notifications: [
          ...state.notifications,
          makeNotification(`Order ${orderId} auto-cancelled — retailer didn't respond in time.`, 'warning', 'customer'),
          makeNotification(`Order ${orderId} timed out and was auto-cancelled.`, 'warning', 'retailer'),
        ],
      };
    }

    case 'ADD_NOTIFICATION':
      return {...state, notifications: [...state.notifications, makeNotification(action.payload.message, action.payload.type, action.payload.forRole)]};

    case 'DISMISS_NOTIFICATION':
      return {...state, notifications: state.notifications.map(n => n.id === action.payload.notificationId ? {...n, read: true} : n)};

    default:
      return state;
  }
}

// === CONTEXT ===
interface AppContextValue {
  state: AppState;
  placeOrder: (customerId: string, retailerId: string, productId: string, quantity: number) => string | null;
  acceptOrder: (orderId: string) => void;
  rejectOrder: (orderId: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  acceptDelivery: (orderId: string, deliveryPartnerId: string) => void;
  dismissNotification: (notificationId: string) => void;
  getNotificationsForRole: (role: string) => AppNotification[];
}

const AppContext = createContext<AppContextValue | undefined>(undefined);

const AUTO_CANCEL_TIMEOUT = 60000; // 60 seconds
const NO_DELIVERY_TIMEOUT = 120000; // 120 seconds

export function AppProvider({children}: {children: ReactNode}) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const deliveryTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const orderCounterRef = useRef(0);

  // Clean up all timers on unmount
  useEffect(() => {
    return () => {
      timersRef.current.forEach(t => clearTimeout(t));
      deliveryTimersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const placeOrder = useCallback((customerId: string, retailerId: string, productId: string, quantity: number): string | null => {
    orderCounterRef.current += 1;
    const orderId = `ORD-${String(orderCounterRef.current).padStart(4, '0')}`;

    const retailer = state.retailers.find(r => r.id === retailerId);
    const inv = retailer?.inventory.find(i => i.productId === productId);
    if (!retailer || !inv || inv.stock < quantity) return null;

    dispatch({type: 'PLACE_ORDER', payload: {customerId, retailerId, productId, quantity, orderId}});

    // Start auto-cancel timer (60s)
    const timer = setTimeout(() => {
      dispatch({type: 'AUTO_CANCEL_ORDER', payload: {orderId}});
      timersRef.current.delete(orderId);
    }, AUTO_CANCEL_TIMEOUT);
    timersRef.current.set(orderId, timer);

    return orderId;
  }, [state.retailers]);

  const acceptOrder = useCallback((orderId: string) => {
    // Clear auto-cancel timer
    const timer = timersRef.current.get(orderId);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(orderId);
    }
    dispatch({type: 'ACCEPT_ORDER', payload: {orderId}});
  }, []);

  const rejectOrder = useCallback((orderId: string) => {
    const timer = timersRef.current.get(orderId);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(orderId);
    }
    dispatch({type: 'REJECT_ORDER', payload: {orderId}});
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: OrderStatus) => {
    dispatch({type: 'UPDATE_ORDER_STATUS', payload: {orderId, status}});

    // Start no-delivery-partner warning timer when ReadyForPickup
    if (status === 'ReadyForPickup') {
      const dTimer = setTimeout(() => {
        dispatch({type: 'ADD_NOTIFICATION', payload: {message: `Warning: No delivery partner has accepted order ${orderId} yet.`, type: 'warning', forRole: 'retailer'}});
        deliveryTimersRef.current.delete(orderId);
      }, NO_DELIVERY_TIMEOUT);
      deliveryTimersRef.current.set(orderId, dTimer);
    }
  }, []);

  const acceptDelivery = useCallback((orderId: string, deliveryPartnerId: string) => {
    // Clear no-delivery timer
    const dTimer = deliveryTimersRef.current.get(orderId);
    if (dTimer) {
      clearTimeout(dTimer);
      deliveryTimersRef.current.delete(orderId);
    }
    dispatch({type: 'ACCEPT_DELIVERY', payload: {orderId, deliveryPartnerId}});
  }, []);

  const dismissNotification = useCallback((notificationId: string) => {
    dispatch({type: 'DISMISS_NOTIFICATION', payload: {notificationId}});
  }, []);

  const getNotificationsForRole = useCallback((role: string): AppNotification[] => {
    return state.notifications.filter(n => !n.read && (n.forRole === role || n.forRole === 'all'));
  }, [state.notifications]);

  const value: AppContextValue = {
    state, placeOrder, acceptOrder, rejectOrder, updateOrderStatus,
    acceptDelivery, dismissNotification, getNotificationsForRole,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp(): AppContextValue {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

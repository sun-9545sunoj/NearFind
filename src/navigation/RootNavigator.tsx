import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {colors, fontSize} from '../theme/colors';

import RoleSelectorScreen from '../screens/RoleSelectorScreen';
import SearchScreen from '../screens/customer/SearchScreen';
import RetailerResultsScreen from '../screens/customer/RetailerResultsScreen';
import PlaceOrderScreen from '../screens/customer/PlaceOrderScreen';
import MyOrdersScreen from '../screens/customer/MyOrdersScreen';
import IncomingOrdersScreen from '../screens/retailer/IncomingOrdersScreen';
import OrderActionsScreen from '../screens/retailer/OrderActionsScreen';
import AvailableOrdersScreen from '../screens/delivery/AvailableOrdersScreen';
import ActiveDeliveryScreen from '../screens/delivery/ActiveDeliveryScreen';
import AdminPanelScreen from '../screens/admin/AdminPanelScreen';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: {backgroundColor: colors.surface},
  headerTintColor: colors.primary,
  headerTitleStyle: {fontWeight: '600' as const, fontSize: fontSize.lg, color: colors.text},
  headerShadowVisible: false,
  headerBackTitleVisible: false,
  contentStyle: {backgroundColor: colors.background},
};

export default function RootNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="RoleSelector" component={RoleSelectorScreen} options={{headerShown: false}} />
      {/* Customer */}
      <Stack.Screen name="CustomerSearch" component={SearchScreen} options={{title: '🛍️ Search Products'}} />
      <Stack.Screen name="RetailerResults" component={RetailerResultsScreen} options={{title: 'Available Stores'}} />
      <Stack.Screen name="PlaceOrder" component={PlaceOrderScreen} options={{title: 'Place Order'}} />
      <Stack.Screen name="MyOrders" component={MyOrdersScreen} options={{title: '📦 My Orders'}} />
      {/* Retailer */}
      <Stack.Screen name="RetailerIncoming" component={IncomingOrdersScreen} options={{title: '🏪 Incoming Orders'}} />
      <Stack.Screen name="OrderActions" component={OrderActionsScreen} options={{title: 'Order Details'}} />
      {/* Delivery */}
      <Stack.Screen name="DeliveryAvailable" component={AvailableOrdersScreen} options={{title: '🚴 Deliveries'}} />
      <Stack.Screen name="ActiveDelivery" component={ActiveDeliveryScreen} options={{title: 'Active Delivery'}} />
      {/* Admin */}
      <Stack.Screen name="AdminPanel" component={AdminPanelScreen} options={{title: '📊 Admin Panel'}} />
    </Stack.Navigator>
  );
}

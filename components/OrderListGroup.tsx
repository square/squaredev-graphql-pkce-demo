import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {graphqlListOrders} from '../helpers/fetchRequests';

interface OrderListGroupProps {
  selectedLocation: string;
}

interface Order {
  name: string;
  lineItems: Array<object>;
  customer: {
    [key: string]: string;
  };
  items: Array<{
    todos: Array<{
      completed: boolean;
    }>;
  }>;
}

const OrderListGroup = ({selectedLocation}: OrderListGroupProps) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getOrders = async (locationId: string) => {
    const merchantId = await AsyncStorage.getItem('merchantId');
    if (!merchantId) {
      console.log('failed to get merchant ID');
      return;
    }
    const tempOrders = await graphqlListOrders({
      locationId,
      merchantId,
    });
    if (!tempOrders.nodes.length) {
      return [];
    }
    const temp = tempOrders.nodes.map((order: Order) => {
      const items = order.lineItems.map(item => {
        return {
          ...item,
          ...{
            todos: [
              {text: '1. Item is in Bag', completed: false},
              {text: '2. Relevant Untensils are in Bag', completed: false},
              {
                text: '3. Checked receipt for special requests',
                completed: false,
              },
            ],
          },
        };
      });
      return {
        name: order.customer?.givenName || 'Henry S',
        items,
        completed: false,
      };
    });
    return temp;
  };

  useEffect(() => {
    const fetchOrders = async () => {
      if (selectedLocation) {
        setIsLoading(true);
        const data = await getOrders(selectedLocation);
        setOrders(data);
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [selectedLocation]);

  const toggleTodo = (
    orderIndex: number,
    itemIndex: number,
    todoIndex: number,
  ) => {
    const updatedOrder = [...orders];
    updatedOrder[orderIndex].items[itemIndex].todos[todoIndex].completed =
      !updatedOrder[orderIndex].items[itemIndex].todos[todoIndex].completed;
    setOrders(updatedOrder);
  };

  const renderTodos = (todos: any[], orderIndex: number, itemIndex: number) => {
    return todos.map((todo, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.todoButton,
          todo.completed && styles.todoButtonCompleted,
        ]}
        onPress={() => toggleTodo(orderIndex, itemIndex, index)}>
        <Text
          style={[styles.todoText, todo.completed && styles.todoTextCompleted]}>
          {todo.text}
        </Text>
      </TouchableOpacity>
    ));
  };

  const renderItems = (items: any[], orderIndex: number) => {
    return items.map((item, itemIndex) => (
      <View style={styles.orderItemsContainer} key={itemIndex}>
        <Text style={styles.itemName}>{item.name}</Text>
        {renderTodos(item.todos, orderIndex, itemIndex)}
      </View>
    ));
  };

  const renderOrders = () => {
    if (orders.length) {
      return orders.map((order, orderIndex) => (
        <View style={styles.orderContainer} key={orderIndex}>
          <Text style={styles.orderName}>{order.name}</Text>
          {renderItems(order.items, orderIndex)}
        </View>
      ));
    } else {
      return (
        <Text style={styles.orderName}>
          No orders available at this location!
        </Text>
      );
    }
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.container}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        renderOrders()
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  orderName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  todoButton: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
  todoButtonCompleted: {
    backgroundColor: '#ccc',
  },
  todoText: {
    fontSize: 16,
  },
  todoTextCompleted: {
    textDecorationLine: 'line-through',
  },
  orderItemsContainer: {
    marginLeft: 8,
  },
  orderContainer: {
    marginBottom: 16,
  },
});

export default OrderListGroup;

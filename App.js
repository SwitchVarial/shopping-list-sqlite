import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  FlatList,
  Keyboard,
  Alert,
} from "react-native";
import * as SQLite from "expo-sqlite";
import { Ionicons } from "@expo/vector-icons";

const db = SQLite.openDatabase("shoppingdb.db");

export default function App() {
  const [product, setProduct] = useState();
  const [amount, setAmount] = useState();
  const [list, setList] = useState([]);

  const createTable = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(
          `create table if not exists list (id integer primary key not null, product text, amount text);`
        );
      },
      null,
      updateList
    );
  };

  useEffect(() => {
    createTable();
  }, []);

  const addItem = () => {
    if (product !== undefined && amount !== undefined) {
      Keyboard.dismiss();
      db.transaction(
        (tx) => {
          tx.executeSql(`insert into list (product, amount) values (?, ?);`, [
            product,
            amount,
          ]);
        },
        null,
        updateList
      );
      setProduct();
      setAmount();
    } else {
      Alert.alert("Product and Amount are required fields!");
    }
  };

  const updateList = () => {
    db.transaction(
      (tx) => {
        tx.executeSql(`select * from list;`, [], (_, { rows }) =>
          setList(rows._array)
        );
      },
      null,
      null
    );
  };

  const deleteItem = (id) => {
    db.transaction(
      (tx) => {
        tx.executeSql(`delete from list where id = ?;`, [id]);
      },
      null,
      updateList
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.control}>
        <TextInput
          style={styles.input}
          placeholder="Product"
          onChangeText={(product) => setProduct(product)}
          value={product}
        />
        <TextInput
          style={styles.input}
          placeholder="Amount"
          onChangeText={(amount) => setAmount(amount)}
          value={amount}
        />
        <Pressable style={styles.button} onPress={addItem}>
          <View style={styles.row}>
            <Text style={styles.buttontext}>Add +</Text>
          </View>
        </Pressable>
      </View>
      <View style={styles.list}>
        <Text style={styles.title}>Shopping List</Text>
        <FlatList
          style={styles.text}
          data={list}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            return (
              <View style={styles.row}>
                <Text style={styles.text}>
                  {item.product}, {item.amount}
                </Text>
                <Pressable
                  style={styles.doneButton}
                  onPress={() => deleteItem(item.id)}
                >
                  <Ionicons
                    name="checkmark-circle-sharp"
                    size={32}
                    color="steelblue"
                  />
                </Pressable>
              </View>
            );
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "powderblue",
    alignItems: "center",
  },
  control: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 60,
  },
  list: {
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    marginTop: 20,
  },
  row: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "100%",
  },
  input: {
    margin: 7,
    width: "90%",
    padding: 15,
    backgroundColor: "white",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 7,
    width: "90%",
    padding: 15,
    backgroundColor: "steelblue",
  },
  doneButton: {
    marginLeft: 7,
  },
  buttontext: {
    fontSize: 20,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  title: {
    fontSize: 30,
    marginBottom: 15,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "steelblue",
  },
  text: {
    fontSize: 20,
    color: "steelblue",
  },
  deleteText: {
    fontSize: 20,
    color: "white",
  },
});

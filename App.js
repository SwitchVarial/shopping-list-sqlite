import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  FlatList,
} from "react-native";
import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("shoppingdb.db");

export default function App() {
  const [product, setProduct] = useState("");
  const [amount, setAmount] = useState("");
  const [list, setList] = useState([]);

  const createDb = () => {
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
    createDb();
  }, []);

  const addItem = () => {
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
    setProduct("");
    setAmount("");
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
          <Text style={styles.buttontext}>Add</Text>
        </Pressable>
      </View>
      <View style={styles.listTitle}>
        <Text style={styles.title}>Shopping List</Text>
      </View>
      <View style={styles.list}>
        <FlatList
          style={styles.text}
          data={list}
          renderItem={({ item }) => {
            return (
              <View style={styles.row}>
                <Text style={styles.text}>
                  {item.product}, {item.amount}
                </Text>
                <Text
                  style={styles.deleteText}
                  onPress={() => deleteItem(item.id)}
                >
                  {" "}
                  Bought
                </Text>
              </View>
            );
          }}
          keyExtractor={(item) => item.id}
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
    justifyContent: "center",
  },
  listTitle: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  control: {
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 100,
  },
  list: {
    marginTop: 5,
    flex: 9,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  row: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    width: "90%",
  },
  input: {
    margin: 7,
    width: "80%",
    padding: 15,
    backgroundColor: "white",
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    margin: 7,
    padding: 15,
    backgroundColor: "steelblue",
  },
  deleteButton: {
    alignItems: "center",
    justifyContent: "center",
    margin: 7,
    padding: 15,
    backgroundColor: "steelblue",
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
    marginTop: 40,
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

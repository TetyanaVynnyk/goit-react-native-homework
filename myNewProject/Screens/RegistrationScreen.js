import {
  StyleSheet,
  Text,
  ImageBackground,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";

const buttonImg = require("../assets/images/add.png");

import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

const RegistrationScreen = ({ changeScrenn }) => {
  const [fontsLoaded] = useFonts({
    "Roboto-Medium": require("../assets/fonts/Roboto-Medium.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
  });

  const [login, setLogin] = useState("");
  const [mail, setMail] = useState("");
  const [password, setPassword] = useState("");
  const [isShowKeyboard, setIsShowKeyboard] = useState(false);


  const handleLogin = (text) => {
    setLogin(text);
  };
  const handleMail = (text) => {
    setMail(text);
  };
  const handlePassword = (text) => {
    setPassword(text);
  };

  const keyboardHide = () => {
    setIsShowKeyboard(false);
    Keyboard.dismiss();
    setLogin("");
    setMail("");
    setPassword("")
  };

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  const register = () => {
    if (!login || !mail || !password) {
      alert("Enter all data pleace!!!");
      return;
    }
    console.log(`Login: ${login}, Email: ${mail}, Password: ${password}`);
  };

  const passwShow = () => alert(`Your password is: ${password}`);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
      style={styles.containerKeyB}
      onPress={keyboardHide}
    >
      <View
        style={{
          ...styles.container,
          marginBottom: isShowKeyboard ? 20 : 150,
        }}
        onLayout={onLayoutRootView}
      >
        <View style={styles.pfotoContainer}>
          <TouchableOpacity style={styles.addbutton} activeOpacity={0.5}>
            <ImageBackground
              source={buttonImg}
              style={{ width: "100%", height: "100%" }}
            ></ImageBackground>
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Registration</Text>

        <TextInput
          style={styles.inputLogin}
          placeholder="Login"
          inputMode="text"
          value={login}
          onChangeText={handleLogin}
          onFocus={() => setIsShowKeyboard(true)}
          onSubmitEditing={keyboardHide}
        />
        <TextInput
          style={styles.inputMailPassw}
          placeholder="Email address"
          inputMode="email"
          value={mail}
          onChangeText={handleMail}
          onFocus={() => setIsShowKeyboard(true)}
          keyboardType={"email-address"}
        />
        <TextInput
          style={styles.inputMailPassw}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={handlePassword}
          onFocus={() => setIsShowKeyboard(true)}
          keyboardType={"email-address"}
        />

        <TouchableOpacity
          style={styles.passwShow}
          activeOpacity={0.5}
          onPress={passwShow}
        >
          <Text style={styles.passwShowText}>Show</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          activeOpacity={0.5}
          onPress={register}
        >
          <Text style={styles.registerButtonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.loginLink}
          activeOpacity={0.5}
          onPress={() => changeScrenn(0)}
        >
          <Text style={styles.loginLinkText}>
            Already have an account? Log in
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    width: "100%",
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
  },
  containerKeyB: {
    justifyContent: "center",
  },
  pfotoContainer: {
    marginTop: -60,
    height: 120,
    width: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },

  addbutton: {
    marginTop: "65%",
    left: "90%",
    height: 25,
    width: 25,
    pointerEvents: "auto",
  },
  title: {
    fontWeight: "500",
    fontSize: 30,
    marginTop: 32,
    lineHeight: 35,
    fontFamily: "Roboto-Medium",
  },
  inputLogin: {
    backgroundColor: "#F6F6F6",
    width: 343,
    height: 50,
    borderRadius: 8,
    marginTop: 33,
    padding: 16,
    // fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
  },
  inputMailPassw: {
    backgroundColor: "#F6F6F6",
    width: 343,
    height: 50,
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
    // fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    position: "relative",
    fontFamily: "Roboto-Regular",
  },
  passwShowText: {
    // fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
  },
  passwShow: {
    top: -34,
    left: 130,
  },
  registerButton: {
    backgroundColor: "#FF6C00",
    height: 50,
    width: 343,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
    marginTop: 0,
    fontFamily: "Roboto-Regular",
  },
  registerButtonText: {
    color: "#fff",
    fontWeight: "400",
    fontFamily: "Roboto-Regular",
  },
  loginLink: {
    marginTop: 16,
    marginBottom: 66,
    fontFamily: "Roboto-Regular",
  },
  loginLinkText: {
    // fontStyle: "normal",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Roboto-Regular",
  },
});

export default RegistrationScreen;

import React, { useState, useEffect, useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  View,
  TextInput,
  KeyboardAvoidingView,
  Text,
  TouchableOpacity,
  Dimensions,
  Image
} from "react-native";

import DownloadPhoto from "../../assets/images/downloadPhoto.svg";
import Location from "../../assets/images/location.svg";
import Trash from "../../assets/images/trash.svg";

const CreatePostsScreen = ({navigation}) => {
  const [fontsLoaded] = useFonts({
    Roboto: require("../../assets/fonts/Roboto-Regular.ttf"),
    RobotoMedium: require("../../assets/fonts/Roboto-Medium.ttf"),
    RobotoBold: require("../../assets/fonts/Roboto-Bold.ttf"),
  });

  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const [isFocusedTitle, setIsFocusedTitle] = useState(false);
  const [isFocusedLocation, setIsFocusedLocation] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");

  const [isDisabledPublish, setIsDisabledPublish] = useState(true);
  const [isDisabledTrash, setIsDisabledTrash] = useState(true);

  const titleHandler = (title) => setTitle(title);
  const locationHandler = (location) => setLocation(location);

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width;
      setWindowWidth(width);
    };
    const dimensionsHandler = Dimensions.addEventListener("change", onChange);

    return () => dimensionsHandler.remove();
  }, []);

  useEffect(() => {
    title && location
      ? setIsDisabledPublish(false)
      : setIsDisabledPublish(true);
  }, [title, location]);

  useEffect(() => {
    title || location ? setIsDisabledTrash(false) : setIsDisabledTrash(true);
  }, [title, location]);

  const onPublish = () => {
    if (!title.trim() || !location.trim()) {
      Alert.alert(`All fields must be completed!`);
      return;
    }
    Alert.alert(`Post successfully created!`);
    console.log(title, location);
    setTitle("");
    setLocation("");
    Keyboard.dismiss();
  };

  const onDelete = () => {
    setTitle("");
    setLocation("");
    Alert.alert(`Successfully deleted!`);
    Keyboard.dismiss();
  };

  useEffect(() => {
    async function prepare() {
      await SplashScreen.preventAutoHideAsync();
    }
    prepare();
  }, []);

  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);
  if (!fontsLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      onLayout={onLayout}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ ...styles.section, width: windowWidth }}>
            <View
              style={{ ...styles.contentBlock, width: windowWidth - 16 * 2 }}
            >
              <TouchableOpacity>
                <Image source={{uri: DownloadPhoto}} />
              </TouchableOpacity>
            </View>
            <View style={{ width: "100%", alignItems: "flex-start" }}>
              <Text style={styles.text}>Download photo</Text>
            </View>
            <View style={{ width: windowWidth - 16 * 2 }}>
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: isFocusedTitle ? "#FF6C00" : "#E8E8E8",
                  fontFamily: "Roboto",
                }}
                onFocus={() => setIsFocusedTitle(true)}
                onBlur={() => setIsFocusedTitle(false)}
                value={title}
                placeholder="Title..."
                cursorColor={"#BDBDBD"}
                placeholderTextColor={"#BDBDBD"}
                onChangeText={titleHandler}
              ></TextInput>
              <TextInput
                style={{
                  ...styles.input,
                  borderColor: isFocusedLocation ? "#FF6C00" : "#E8E8E8",
                  paddingLeft: 26,
                  fontFamily: "Roboto",
                }}
                onFocus={() => setIsFocusedLocation(true)}
                onBlur={() => setIsFocusedLocation(false)}
                value={location}
                textContentType={"location"}
                placeholder="Location"
                cursorColor={"#BDBDBD"}
                placeholderTextColor={"#BDBDBD"}
                onChangeText={locationHandler}
                onPressIn={() => navigation.navigate('Map')}
              ></TextInput>
              <Image source={{uri: Location}} style={styles.locationIcon} />
            </View>
            <TouchableOpacity
              style={{
                ...styles.publishButton,
                width: windowWidth - 16 * 2,
                backgroundColor: isDisabledPublish ? "#F6F6F6" : "#FF6C00",
              }}
              onPress={onPublish}
              disabled={isDisabledPublish}
            >
              <Text
                style={{
                  ...styles.textPublishButton,
                  color: isDisabledPublish ? "#BDBDBD" : "#FFFFFF",
                  fontFamily: "Roboto",
                }}
              >
                Publish
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                ...styles.trashButton,
                backgroundColor: isDisabledTrash ? "#F6F6F6" : "#FF6C00",
              }}
              onPress={onDelete}
              disabled={isDisabledTrash}
            >
              <Image source={{uri: Trash}} stroke={isDisabledTrash ? "#BDBDBD" : "#FFFFFF"} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

export default CreatePostsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  section: {
    flex: 1,
    alignItems: "center",
    marginTop: 32,
    paddingHorizontal: 16,
  },
  contentBlock: {
    alignItems: "center",
    justifyContent: "center",
    height: 240,
    backgroundColor: "#F6F6F6",
    borderStyle: "solid",
    borderWidth: 1,
    borderRadius: 8,
    borderColor: "#E8E8E8",
  },
  text: {
    marginTop: 8,
    marginBottom: 16,
    color: "#BDBDBD",
    fontSize: 16,
    lineHeight: 19,
  },
  input: {
    marginTop: 16,
    paddingTop: 0,
    paddingBottom: 0,
    height: 56,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: "#E8E8E8",
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
  },
  locationIcon: {
    position: "absolute",
    bottom: 16,
  },
  publishButton: {
    height: 51,
    marginTop: 27,
    paddingVertical: 16,
    borderRadius: 100,
  },
  textPublishButton: {
    fontSize: 16,
    lineHeight: 19,
    textAlign: "center",
    color: "#BDBDBD",
  },
  trashButton: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
    width: 70,
    height: 40,
    borderRadius: 20,
  },
});


import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  Image,
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
} from "react-native";

import uuid from "react-native-uuid";

import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../../firebase/config";

import DownloadPhoto from "../../assets/images/downloadPhoto.svg";
import Location from "../../assets/images/location.svg";
import Trash from "../../assets/images/trash.svg";

export const CreatePostsScreen = ({ route, navigation }) => {
  const [fontsLoaded] = useFonts({
    Roboto: require("../../assets/fonts/Roboto-Regular.ttf"),
    RobotoMedium: require("../../assets/fonts/Roboto-Medium.ttf"),
    RobotoBold: require("../../assets/fonts/Roboto-Bold.ttf"),
  });

  const [image, setImage] = useState("");

  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const [isFocusedTitle, setIsFocusedTitle] = useState(false);
  const [isFocusedLocation, setIsFocusedLocation] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [regionName, setRegionName] = useState("");

  const [isDisabledPublish, setIsDisabledPublish] = useState(true);
  const [isDisabledTrash, setIsDisabledTrash] = useState(true);

  const { userId, login } = useSelector((state) => state.auth);

  const titleHandler = (title) => setTitle(title);

  const uploadPhotoToServer = async () => {
    try {
      const response = await fetch(image);
      const file = await response.blob();
      const uniquePostId = uuid.v4();
      const storage = getStorage();
      const storageRef = ref(storage, `postImage/${uniquePostId}`);

      await uploadBytes(storageRef, file);

      const photoRef = await getDownloadURL(storageRef);
      return photoRef;
    } catch (error) {
      console.log("error-message.upoload-photo", error.message);
    }
  };

  const uploadPostToServer = async () => {
    try {
      const imageRef = await uploadPhotoToServer();
      const postRef = await addDoc(collection(firestore, "posts"), {
        photo: imageRef,
        title,
        location,
        userId,
        login,
        regionName,
        commentsQuantity: 0,
        likesQuantity: 0,
        likeStatus: false,
      });
    } catch (error) {
      console.log("error-message.upload-to-server", error.message);
    }
  };

  const onPublish = () => {
    if (!title.trim() || !location) {
      Alert.alert(`All fields must be completed!`);
      return;
    }
    Alert.alert(`Post successfully created!`);
    uploadPostToServer();
    setImage();
    setTitle("");
    setLocation("");
    setRegionName("");
    Keyboard.dismiss();
    navigation.navigate("Posts");
  };

  const onDelete = () => {
    setTitle("");
    setLocation("");
    setImage();
    Alert.alert(`Successfully deleted!`);
    Keyboard.dismiss();
  };
  useEffect(() => {
    if (route.params) {
      setImage(route.params.photo);
      setLocation(route.params.location);
      setRegionName(route.params.regionName);
      console.log(regionName)
    }
  }, [route.params]);

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width;
      setWindowWidth(width);
    };
    const dimensionsHandler = Dimensions.addEventListener("change", onChange);

    return () => dimensionsHandler.remove();
  }, []);

  useEffect(() => {
    image && title && location
      ? setIsDisabledPublish(false)
      : setIsDisabledPublish(true);
  }, [title, location, image]);

  useEffect(() => {
    image || title || location
      ? setIsDisabledTrash(false)
      : setIsDisabledTrash(true);
  }, [title, location, image]);

  // useEffect(() => {
  //   async function prepare() {
  //     await SplashScreen.preventAutoHideAsync();
  //   }
  //   prepare();
  // }, []);

  // const onLayout = useCallback(async () => {
  //   if (fontsLoaded) {
  //     await SplashScreen.hideAsync();
  //   }
  // }, [fontsLoaded]);
  // if (!fontsLoaded) {
  //   return null;
  // }

  return (
    <KeyboardAvoidingView
      // onLayout={onLayout}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={{ flex: 1 }}>
        <ScrollView>
          <View style={{ ...styles.section, width: windowWidth }}>
            {image ? (
              <View>
                <Image
                  style={{ ...styles.image, width: windowWidth - 16 * 2 }}
                  source={{ uri: image }}
                />
                <TouchableOpacity
                  style={{
                    position: "absolute",
                    top: 90,
                    left: (windowWidth - 60 - 16 * 2) / 2,
                  }}
                >
                  <DownloadPhoto
                    onPress={() => navigation.navigate("Camera")}
                    opacity={0.3}
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={{ ...styles.contentBlock, width: windowWidth - 16 * 2 }}
              >
                <TouchableOpacity>
                  <DownloadPhoto
                    onPress={() => navigation.navigate("Camera")}
                  />
                </TouchableOpacity>
              </View>
            )}
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
                value={regionName ? `${regionName[0].city}, ${regionName[0].country}` : ''}
                textContentType={"location"}
                placeholder="Location"
                cursorColor={"#BDBDBD"}
                placeholderTextColor={"#BDBDBD"}
              ></TextInput>
              <Location style={styles.locationIcon} />
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
              <Trash stroke={isDisabledTrash ? "#BDBDBD" : "#FFFFFF"} />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
};

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
  image: {
    height: 240,

    resizeMode: "cover",
    borderRadius: 8,
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

import React, { useState, useEffect, useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import {
  TouchableOpacity,
  StyleSheet,
  View,
  FlatList,
  Image,
  Text,
  ImageBackground,
  Dimensions
} from "react-native";

import Message from "../../assets/images/message.svg";
import Like from "../../assets/images/like.svg";
import Location from "../../assets/images/location.svg";

const POSTS = [
  {
    id: 4,
    postImage: require("../../assets/images/forrest.jpg"),
    title: "Forrest",
    location: "Ukraine",
    comments: 8,
    likes: 153,
  },
  {
    id: 5,
    postImage: require("../../assets/images/sunset.jpg"),
    title: "Sunset on the Black Sea",
    location: "Ukraine",
    comments: 3,
    likes: 200,
  },
  {
    id: 6,
    postImage: require("../../assets/images/oldhouse.jpg"),
    title: "Old house in Venice",
    location: "Italy",
    comments: 50,
    likes: 200,
  },
];

export const ProfileScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    Roboto: require("../../assets/fonts/Roboto-Regular.ttf"),
    RobotoMedium: require("../../assets/fonts/Roboto-Medium.ttf"),
    RobotoBold: require("../../assets/fonts/Roboto-Bold.ttf"),
  });

  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const [windowHeight, setWindowHeight] = useState(
    Dimensions.get("window").height
  );

  const [posts, setPosts] = useState(POSTS);

  useEffect(() => {
    const onChange = () => {
      const width = Dimensions.get("window").width;
      setWindowWidth(width);
      const height = Dimensions.get("window").height;
      setWindowHeight(height);
    };
    const dimensionsHandler = Dimensions.addEventListener("change", onChange);

    return () => dimensionsHandler.remove();
  }, []);

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
    <View onLayout={onLayout} style={styles.container}>
      <ImageBackground
        style={{
          ...styles.imageBG,
          width: windowWidth,
          height: windowHeight,
        }}
        source={require("../../assets/images/PhotoBG.jpeg")}
      >
        <FlatList
          ListHeaderComponent={
            <View
              style={{
                ...styles.headerWrapper,
                marginTop: windowWidth > 500 ? 100 : 147,
                width: windowWidth,
              }}
            >
              <View
                style={{
                  ...styles.imageThumb,
                  left: (windowWidth - 120) / 2,
                }}
              >
                <Image
                  style={styles.avatarImage}
                  source={require("../../assets/images/userAvatarLarge.jpg")}
                />
              </View>
              <View
                style={{
                  ...styles.userTitleWrapper,
                  width: windowWidth - 16 * 2,
                }}
              >
                <Text
                  style={{ ...styles.userTitle, fontFamily: "RobotoMedium" }}
                >
                  Natali Romanova
                </Text>
              </View>
            </View>
          }
          data={posts}
          renderItem={({ item }) => (
            <View
              style={{
                ...styles.cardContainer,
                width: windowWidth,
               
              }}
            >
              <Image
                source={item.postImage}
                style={{
                  ...styles.cardImage,
                  width: windowWidth - 16 * 2,
                }}
              />
              <Text
                style={{
                  ...styles.cardTitle,
                  width: windowWidth - 16 * 2,
                  fontFamily: "RobotoMedium",
                }}
              >
                {item.title}
              </Text>
              <View style={{...styles.cardThumb, width: windowWidth - 16 * 2}}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <TouchableOpacity
                    style={styles.cardWrapper}
                    onPress={() => navigation.navigate("Comments")}
                  >
                    <Image source={{uri: Message}} />
                    <Text style={styles.cardText}>{item.comments}</Text>
                  </TouchableOpacity>
                  <View style={{ ...styles.cardWrapper, marginLeft: 24 }}>
                    <Image source={{uri: Like}} />
                    <Text style={styles.cardText}>{item.likes}</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.cardWrapper} onPress={() => navigation.navigate('Map')}>
                  <Image source={{uri: Location}} />
                  <Text style={styles.cardText}>{item.location}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",

            borderTopLeftRadius: 25,
            borderTopRightRadius: 25,
          }}
          showsVerticalScrollIndicator={false}
        />
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  imageBG: {
    flex: 1,
    resizeMode: "cover",
  },
  headerWrapper: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    alignItems: "center",
  },

  imageThumb: {
    position: "absolute",
    top: -60,
    width: 120,
    height: 120,
    backgroundColor: "#F6F6F6",
    borderRadius: 16,
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    resizeMode: "cover",
  },
  userTitleWrapper: {
    alignItems: "center",
    marginTop: 92,
    marginBottom: 32,
  },
  userTitle: {
    textAlign: "center",
    fontSize: 30,
    lineHeight: 35,
    color: "#212121",
  },
  cardContainer: {
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  cardImage: {
    resizeMode: "cover",
    borderRadius: 8,
  },
  cardTitle: {
    marginTop: 8,
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
  },
  cardThumb: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    marginBottom: 35,
  },
  cardWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    marginLeft: 4,
    fontSize: 16,
    lineHeight: 19,
    color: "#212121",
  },
});
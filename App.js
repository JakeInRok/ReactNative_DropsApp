import React, { useRef, useState } from "react";
import { Animated, PanResponder, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import icons from "./icons";

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #00a8ff;
`;
const CardContainer = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
`;
const Card = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  width: 200px;
  height: 300px;
  border-radius: 30px;
  align-items: center;
  justify-content: center;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.3);
  position: absolute;
`;

const Btn = styled.TouchableOpacity`
  margin: 0px 10px;
`;

const BtnContainer = styled.View`
  flex-direction: row;
  flex: 1;
`;

export default function App() {
  //Values
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.Value(0)).current;
  const opacity = position.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: [0.2, 1, 0.2],
  });
  const rotate = position.interpolate({
    inputRange: [-200, 0, 200],
    outputRange: ["-20deg", "0deg", "20deg"],
  });
  const secondScale = position.interpolate({
    inputRange: [-250, 0, 250],
    outputRange: [1, 0.5, 1],
    extrapolate: "clamp",
  });
  //Animation
  const onPressIn = Animated.spring(scale, {
    toValue: 0.95,
    useNativeDriver: true,
  });
  const onPressOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goCenter = Animated.spring(position, {
    toValue: 0,
    useNativeDriver: true,
  });
  const goLeft = Animated.spring(position, {
    toValue: -350,
    tension: 7,
    useNativeDriver: true,
    restSpeedThreshold: 50,
  });
  const goRight = Animated.spring(position, {
    toValue: 350,
    tension: 7,
    useNativeDriver: true,
    restDisplacementThreshold: 100,
  });
  //Pan Responders
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, { dx }) => {
        position.setValue(dx);
      },
      onPanResponderGrant: () => onPressIn.start(),
      onPanResponderRelease: (_, { dx }) => {
        if (dx < -180) {
          goLeft.start(onDismiss);
        } else if (dx > 180) {
          goRight.start(onDismiss);
        } else {
          Animated.parallel([onPressOut, goCenter]).start();
        }
      },
    })
  ).current;
  const [index, setIndex] = useState(0);
  const onDismiss = () => {
    position.setValue(0);
    scale.setValue(1);
    setIndex((prev) => prev + 1);
  };
  const closePress = () => goLeft.start(onDismiss);
  const checkPress = () => goRight.start(onDismiss);
  return (
    <Container>
      <CardContainer>
        <Card
          style={{
            transform: [{ scale: secondScale }],
          }}
        >
          <Ionicons name={icons[index + 1]} color="#192a56" size={98} />
        </Card>
        <Card
          {...panResponder.panHandlers}
          style={{
            opacity,
            transform: [{ scale }, { translateX: position }, { rotate }],
          }}
        >
          <Ionicons name={icons[index]} color="#192a56" size={98} />
        </Card>
      </CardContainer>
      <BtnContainer>
        <Btn onPress={closePress}>
          <Ionicons name="close-circle" color="white" size={60} />
        </Btn>
        <Btn onPress={checkPress}>
          <Ionicons name="checkmark-circle" color="white" size={60} />
        </Btn>
      </BtnContainer>
    </Container>
  );
}

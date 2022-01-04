import React, { useRef, useState } from "react";
import { Image, Animated, PanResponder, View, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import styled from "styled-components/native";
import icons from "./icons";

const BLACK_COLOR = "#1e272e";
const GREY = "#485460";
const GREEN = "#2ecc71";
const RED = "#e74c3c";

const Container = styled.View`
  flex: 1;
  background-color: ${BLACK_COLOR};
`;
const Edge = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
const WordContainer = styled(Animated.createAnimatedComponent(View))`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  justify-content: center;
  align-items: center;
  background-color: ${GREY};
`;
const Word = styled.Text`
  font-size: 38px;
  font-weight: 500;
  color: ${(props) => props.color};
`;
const Center = styled.View`
  flex: 3;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;
const IconCard = styled(Animated.createAnimatedComponent(View))`
  background-color: white;
  padding: 15px 15px;
  border-radius: 10px;
`;
export default function App() {
  //Values
  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;
  const position = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const upScale = position.y.interpolate({
    inputRange: [-360, 0],
    outputRange: [2, 1],
    extrapolate: "clamp",
  });
  const downScale = position.y.interpolate({
    inputRange: [0, 360],
    outputRange: [1, 2],
    extrapolate: "clamp",
  });

  //Animation
  const onClick = Animated.spring(scale, {
    toValue: 0.9,
    useNativeDriver: true,
  });
  const onClickOut = Animated.spring(scale, {
    toValue: 1,
    useNativeDriver: true,
  });
  const goHome = Animated.spring(position, {
    toValue: { x: 0, y: 0 },
    useNativeDriver: true,
  });
  const onDropOpacity = Animated.timing(opacity, {
    toValue: 0,
    easing: Easing.linear,
    duration: 50,
    useNativeDriver: true,
  });
  const onDropScale = Animated.timing(scale, {
    toValue: 0,
    duration: 50,
    easing: Easing.linear,
    useNativeDriver: true,
  });
  const onDropPosition = Animated.timing(position, {
    toValue: 0,
    duration: 50,
    easing: Easing.linear,
    useNativeDriver: true,
  });
  //Pan Responders
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => onClick.start(),
    onPanResponderRelease: (_, { dy }) => {
      if (dy < -260 || dy > 260) {
        Animated.sequence([
          Animated.parallel([onDropScale, onDropOpacity]),
          onDropPosition,
        ]).start(nextIcons);
      } else {
        Animated.parallel([goHome, onClickOut]).start();
      }
    },
    onPanResponderMove: (_, { dx, dy }) => {
      position.setValue({ x: dx, y: dy });
    },
    //x: 80 , y: 260
  });
  const nextIcons = () => {
    setIndex((prev) => prev + 1);
    Animated.parallel([
      Animated.spring(opacity, { toValue: 1, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true }),
    ]).start();
  };
  return (
    <Container>
      <Edge>
        <WordContainer style={{ transform: [{ scale: upScale }] }}>
          <Word color={GREEN}>YES</Word>
        </WordContainer>
      </Edge>
      <Center>
        <IconCard
          {...panResponder.panHandlers}
          style={{
            opacity,
            transform: [{ scale }, ...position.getTranslateTransform()],
          }}
        >
          <Ionicons name={icons[index]} color={GREY} size={120} />
        </IconCard>
      </Center>
      <Edge>
        <WordContainer style={{ transform: [{ scale: downScale }] }}>
          <Word color={RED}>NO</Word>
        </WordContainer>
      </Edge>
    </Container>
  );
}

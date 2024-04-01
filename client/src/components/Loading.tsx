import React from "react";
// import loading from "";
// import Image from "next/image";
import { Box, Flex, Image } from "@chakra-ui/react";

const Loading = () => {
  return (
    <Flex
      w={"100vw"}
      h={"100vh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Image src={"/loading.gif"} alt="loading" w={"20%"}></Image>
    </Flex>
  );
};

export default Loading;

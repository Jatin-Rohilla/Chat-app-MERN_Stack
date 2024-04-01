"use client";

import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Icon,
  Image,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { FormControl } from "@chakra-ui/react";
import { baseUrl } from "../../../configs";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import { login } from "@/redux/authSlice/authSlice";
import Axios from "../../../axios";
import { IoMdChatbubbles } from "react-icons/io";
import { VscCoffee } from "react-icons/vsc";
import Loading from "@/components/Loading";

interface IntialState {
  email: string;
  password: string;
}

const userInitialObject: IntialState = {
  email: "",
  password: "",
};

const Page = () => {
  const [user, setUser] = useState(userInitialObject);
  const [loading, setLoading] = useState<boolean>(false);
  const handleUser = (e: any) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const isAuth = useSelector<RootState>((store) => store.auth.isAuth);
  const dispatch = useDispatch<AppDispatch>();

  const router = useRouter();
  const toast = useToast();

  const loginRequest = useCallback(
    async (url: string, obj: object) => {
      setLoading(true);
      try {
        let res = await Axios.post(url, obj);
        // console.log(res);

        toast({
          description: res.data.message,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });

        dispatch(login(res.data.userData));
        setLoading(false);
        router.push("/");
        // dispatch(login());
      } catch (error: any) {
        // console.log(error);
        setLoading(false);
        toast({
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      }
    },
    [dispatch, toast, loading]
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    loginRequest(baseUrl + "/user/login", user);
  };

  const HandleGoogleLogin = () => {
    window.location.href = baseUrl + "/user/google";
  };

  useEffect(() => {
    if (isAuth) {
      router.push("/");
    }
  }, [isAuth, router]);

  return (
    <Box>
      <Box w={"100vw"} h={"100vh"} position={"fixed"} zIndex={"-1"}>
        <Box w={"100vw"} h={"30vh"} bg={"blue.400"}></Box>
        <Box w={"100vw"} h={"70vh"}></Box>
      </Box>
      <Flex
        width={"100vw"}
        height={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        maxW={"1280px"}
        m={"auto"}
      >
        <Grid
          gridTemplateColumns={["1fr", "1fr", "0.6fr 1fr", "1fr 1fr"]}
          boxShadow={"rgba(99, 99, 99, 0.4) 0px 2px 8px 0px"}
          borderRadius={"10px"}
          width={["90%", "80%", "90%"]}
          // minH={"90%"}
          bg={"white"}
        >
          <Box
            bgGradient="linear(to-t, purple.400, blue.300 ,green.300)"
            color={"white"}
            borderLeftRadius={"10px"}
            display={["none", "none", "block"]}
          >
            <Flex
              flexDir={"column"}
              justifyContent={"center"}
              alignItems={"center"}
              w={"100%"}
              h={"100%"}
              p={"20px"}
              gap={"25px"}
            >
              <Flex flexDir={"column"} alignItems={"center"}>
                <Icon as={IoMdChatbubbles} w={"70px"} h={"70px"} />
                <Heading fontSize={"2.7rem"}>Chat App</Heading>
              </Flex>
              <Text
                textAlign={"center"}
                fontSize={["1.2rem", "1.3rem", "1.5rem"]}
              >
                Share Your Smile With This World and Loved Ones
              </Text>
              <Flex flexDir={"column"} alignItems={"center"}>
                <Icon as={VscCoffee} w={"70px"} h={"70px"} />
                <Text
                  textAlign={"center"}
                  fontSize={["1.2rem", "1.3rem", "1.5rem"]}
                >
                  Enjoy..!
                </Text>
              </Flex>
            </Flex>
          </Box>

          <form onSubmit={handleSubmit}>
            <Flex
              flexDir={"column"}
              p={["5%", "5%", "5%", "5% 7%", "7% 7%"]}
              gap={"25px"}
              justifyContent={"center"}
              h={"100%"}
              m={"auto"}
            >
              <Flex
                justifyContent={"center"}
                // flexDir={"column"}
                alignItems={"center"}
              >
                <Icon
                  as={IoMdChatbubbles}
                  w={["70px", "70px", "70px"]}
                  h={["70px", "70px", "70px"]}
                  color={"blue.500"}
                  // border={"1px solid red"}
                />
                <Heading
                  textAlign={"center"}
                  color={"purple.500"}
                  // p={["8px 0", "10px 0"]}
                  // paddingBottom={["8px", "10px"]}
                  fontSize={["1.5rem", "1.8rem", "2.1rem"]}
                  // border={"1px solid red"}
                >
                  Login Here
                </Heading>
              </Flex>

              <FormControl isRequired>
                <Input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={user.email}
                  onChange={handleUser}
                  fontSize={["1rem", "1.1rem", "1.3rem"]}
                  py={["5", "6", "6", "6", "7"]}
                />
              </FormControl>
              <FormControl isRequired>
                <Input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={user.password}
                  onChange={handleUser}
                  fontSize={["1rem", "1.1rem", "1.3rem"]}
                  py={["5", "6", "6", "6", ""]}
                />
              </FormControl>
              <Text fontSize={["1rem", "1.1rem", "1.3rem"]}>
                Forgot password?{" "}
              </Text>
              <Button
                isLoading={loading}
                type="submit"
                color={"white"}
                bgGradient="linear(to-l, purple.400, blue.300 ,green.300)"
                _hover={{
                  bgGradient: "linear(to-l, purple.500, blue.400 ,green.400)",
                }}
                fontSize={["1rem", "1.1rem", "1.3rem"]}
                py={["5", "6", "6", "6", "7"]}
              >
                Login
              </Button>
              {/* <Button
                // bg={"#5086EC"}
                // color={"white"}
                _hover={{
                  // bgGradient: "linear(to-l, purple.500, blue.400 ,green.400)",
                  bg: "blue.400",
                  color: "white",
                }}
                style={{
                  border: "1px solid #4299E1",
                }}
                // borderColor={"red.200"}
                // border={"1px solid blue.400"}
                onClick={HandleGoogleLogin}
                fontSize={["1rem", "1.1rem", "1.3rem"]}
                py={["5", "6", "6", "6", "7"]}
              >
                <Image
                  src="https://cdn1.iconfinder.com/data/icons/google-s-logo/150/Google_Icons-09-512.png"
                  w={"10%"}
                  alt=""
                ></Image>
                Login With Google
              </Button> */}
              <Text
                textAlign={"center"}
                fontSize={["1rem", "1.1rem", "1.3rem"]}
              >
                New Here?{" "}
                <Box
                  as="span"
                  fontWeight={"700"}
                  color={"purple.500"}
                  _hover={{ color: "green.400", cursor: "pointer" }}
                  onClick={() => {
                    router.push("/signup");
                  }}
                  fontSize={["1rem", "1.1rem", "1.3rem"]}
                >
                  Sign Up Please!
                </Box>
              </Text>
            </Flex>
          </form>
        </Grid>
      </Flex>
    </Box>
  );
};

export default Page;

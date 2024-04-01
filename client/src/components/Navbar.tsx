"use client";
import React, {
  JSXElementConstructor,
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import { Box, Button, Flex, Heading, Image } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import Axios from "../../axios";
import { logout } from "@/redux/authSlice/authSlice";
import { baseUrl } from "../../configs";
import { IoMdChatbubbles } from "react-icons/io";
import { Icon } from "@chakra-ui/react";
import { useAppSelector } from "@/redux/providers";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
} from "@chakra-ui/react";
import { BiAlignLeft, BiChevronLeft } from "react-icons/bi";
import { ChatState, setShowLeftTab } from "@/redux/chatSlice/chatSlice";
import { useRouter } from "next/navigation";

type NavbarInterface = {
  height: string;
};

const Navbar: JSXElementConstructor<NavbarInterface> = ({ height }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loginComponent, setLoginComponent] = useState<any>();
  const isAuth = useAppSelector((store) => store.auth.isAuth);
  const _id = useAppSelector((store) => store.auth._id);
  const avatar = useAppSelector((store) => store.auth.avatar);
  const name = useAppSelector((store) => store.auth.name);

  const { showLeftTab } = useSelector<RootState, ChatState>(
    (store) => store.chat
  );

  const router = useRouter();

  const logoutRequest = useCallback(async () => {
    try {
      let res = await Axios.post(baseUrl + "/user/logout", {
        _id: _id,
        newMessages: {},
      });
      router.push("/login");
      dispatch(logout());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, _id, router]);

  return (
    <Box h={height} boxShadow={"rgba(99, 99, 99, 0.2) 0px 2px 8px 0px"}>
      <Flex
        justifyContent={"space-between"}
        alignItems={"center"}
        // borderBottom={"1px solid rgba(105,105,105,0.5)"}
        padding={"10px 30px"}
        // maxW={"1370px"}
        m={"auto"}
      >
        <Link href={"/"}>
          <Flex alignItems={"center"} justifyContent={"center"} gap={"2px"}>
            {showLeftTab ? (
              <Icon
                as={BiAlignLeft}
                w={10}
                h={10}
                color="blue.500"
                display={["block", "block", "none"]}
                onClick={() => dispatch(setShowLeftTab(true))}
              />
            ) : (
              <Icon
                as={BiChevronLeft}
                w={10}
                h={10}
                color="blue.500"
                display={["block", "block", "none"]}
                onClick={() => dispatch(setShowLeftTab(true))}
              />
            )}

            <Icon
              as={IoMdChatbubbles}
              w={10}
              h={10}
              color="blue.500"
              display={["none", "none", "block"]}
            />
            <Heading
              fontSize={"1.4rem"}
              color={"blue.500"}
              display={["none", "none", "block"]}
            >
              Chat App
            </Heading>
          </Flex>
        </Link>
        <Box>
          <Flex justifyContent="center" alignItems="center" gap="10px">
            <Image
              src={`${avatar}`}
              alt=""
              w="50px"
              h="50px"
              borderRadius="50%"
            />
            <Menu>
              <MenuButton
                as={Button}
                rightIcon={<ChevronDownIcon />}
                // style={{ backgroundColor: "white" }}
              >
                {`${name}`}
              </MenuButton>
              <MenuList mt="10px">
                <MenuGroup title="Profile">
                  {/* <MenuItem>My Account</MenuItem>
                  <MenuItem>Settings</MenuItem> */}
                  <MenuItem
                    onClick={() => {
                      logoutRequest();
                    }}
                  >
                    Logout
                  </MenuItem>
                </MenuGroup>
              </MenuList>
            </Menu>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default Navbar;

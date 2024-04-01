import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Divider,
  Flex,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputRightElement,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
  IconButtonProps,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  ChatState,
  setNewRoom,
  setNotifications,
  setPreviousRoom,
  setPrivateId,
  setShowLeftTab,
  setTypeRoom,
} from "@/redux/chatSlice/chatSlice";
import { AuthState } from "@/redux/authSlice/authSlice";
import { CloseIcon } from "@chakra-ui/icons";
import { relative } from "path";

const rooms: string[] = [
  "Public Discussion",
  "Technology",
  "Stock Market",
  "Science",
];

const LeftTab = () => {
  const [totalNotificationsPublic, setTotalNotificationsPublic] =
    useState<number>(0);
  const [totalNotificationsPrivate, setTotalNotificationsPrivate] =
    useState<number>(0);

  const { _id, name, avatar } = useSelector<RootState, AuthState>(
    (store) => store.auth
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { members, newRoom, notifications, privateId, showLeftTab } =
    useSelector<RootState, ChatState>((store) => store.chat);

  const dispatch = useDispatch();

  const joinPublicChat = useCallback(
    (room: string) => {
      const pRoom = newRoom;
      dispatch(
        setNotifications({ type: "remove", sender: "chatroom", room: room })
      );
      dispatch(setPreviousRoom(pRoom));
      dispatch(setPrivateId(""));
      dispatch(setNewRoom(room));
      dispatch(setTypeRoom("chatroom"));
      dispatch(setShowLeftTab(false));
    },
    [dispatch, newRoom]
  );

  useEffect(() => {
    for (let key in notifications) {
      if (key === "chatroom") {
        let num1 = 0;
        for (let key2 in notifications[key]) {
          num1 += Number(notifications[key][key2]);
        }
        setTotalNotificationsPublic(num1);
      } else if (key === "private") {
        let num2 = 0;
        for (let key2 in notifications[key]) {
          num2 += Number(notifications[key][key2]);
        }
        setTotalNotificationsPrivate(num2);
      }
    }
  }, [notifications]);

  const joinPrivateChat = useCallback(
    (e: any) => {
      if (_id == e._id) {
        return;
      }
      dispatch(
        setNotifications({ type: "remove", sender: "private", room: e._id })
      );
      const pRoom = newRoom;
      dispatch(setPreviousRoom(pRoom));
      dispatch(setPrivateId(e));

      if (_id > e._id) {
        dispatch(setNewRoom(_id + "-" + e._id));
      } else {
        dispatch(setNewRoom(e._id + "-" + _id));
      }
      dispatch(setTypeRoom("private"));

      dispatch(setShowLeftTab(false));
    },
    [_id, dispatch, newRoom]
  );

  const memoizedPublicRooms = useCallback(
    (rooms: any) =>
      rooms.map((e: any, ind: number) => (
        <Box key={ind}>
          <Flex
            onClick={() => joinPublicChat(e)}
            bg={e == newRoom ? "gray.400" : ""}
            _hover={{
              cursor: "pointer",
              bg: e == newRoom ? "gray.400" : "gray.200",
            }}
            borderRadius={"10px"}
            p={"10px"}
            gap={"10px"}
            alignItems={"center"}
          >
            <Flex
              w="50px"
              h="50px"
              borderRadius="50%"
              justifyContent={"center"}
              alignItems={"center"}
              bg={"blue.300"}
              color={"white"}
              fontWeight={"700"}
            >
              {e.substring(0, 2).toUpperCase()}
            </Flex>
            <Box>{e} </Box>
            {notifications.chatroom[e] && (
              <Flex
                as="span"
                width={"25px"}
                height={"25px"}
                display="flex"
                borderRadius={"50%"}
                bg={"blue.400"}
                color={"white"}
                p={"5px"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                {notifications.chatroom[e]}
              </Flex>
            )}
          </Flex>
          <Divider w={"90%"} m={"auto"} />
        </Box>
      )),
    [newRoom, joinPublicChat, notifications]
  );

  const memoizedPrivateChats = useCallback(
    (members: any) =>
      members.map((e: any) => (
        <Box key={e._id}>
          <Flex
            onClick={() => joinPrivateChat(e)}
            bg={e._id == privateId._id ? "gray.400" : ""}
            _hover={{
              cursor: "pointer",
              bg: e._id == privateId._id ? "gray.400" : "gray.200",
            }}
            p={"10px"}
            gap={"10px"}
            alignItems={"center"}
            alignSelf={e._id === _id ? "flex-start" : ""}
            borderRadius={"10px"}
            // borderBottom={"1px solid red"}
          >
            <Box position={"relative"}>
              <Image
                alt=""
                w="50px"
                h="50px"
                minW={"50px"}
                borderRadius="50%"
                src={e.avatar}
              />
              <Box
                h={"10px"}
                w={"10px"}
                bg={e.status == "online" ? "green" : "red.600"}
                borderRadius={"50%"}
                position={"absolute"}
                top={"40px"}
                zIndex={10}
                left={"5px"}
              ></Box>
            </Box>
            <Box color={e._id == _id ? "gray.400" : ""}>
              {e.name} {e._id == _id ? "(You)" : `(${e.status})`}
            </Box>
            {notifications.private[e._id] && (
              <Flex
                as="span"
                width={"25px"}
                height={"25px"}
                display="flex"
                borderRadius={"50%"}
                bg={"blue.400"}
                color={"white"}
                p={"5px"}
                alignItems={"center"}
                justifyContent={"center"}
              >
                {notifications.private[e._id]}
              </Flex>
            )}
          </Flex>
          <Divider w={"90%"} m={"auto"} />
        </Box>
      )),
    [_id, privateId, joinPrivateChat, notifications]
  );

  const [privateSearch, setPrivateSearch] = useState<string>("");
  const [searchedPrivate, setSearchedPrivate] = useState<any[]>([]);

  const [publicSearch, setPublicSearch] = useState<string>("");
  const [searchedPublic, setSearchedPublic] = useState<any[]>([]);

  useEffect(() => {
    let arr = [];
    if (privateSearch) {
      arr = members.filter((e) => {
        const a1 = e.name.toLowerCase();
        const a2 = privateSearch.toLowerCase();

        if (a1.includes(a2)) {
          return e;
        }
      });
    } else {
      arr = [];
    }
    setSearchedPrivate(arr);
  }, [privateSearch, members]);

  useEffect(() => {
    let arr: string[] = [];
    if (publicSearch) {
      arr = rooms.filter((e) => {
        const a1 = e.toLowerCase();
        const a2 = publicSearch.toLowerCase();

        if (a1.includes(a2)) {
          return e;
        }
      });
    } else {
      arr = [];
    }
    setSearchedPublic(arr);
  }, [publicSearch]);

  return (
    <Tabs
      isFitted
      variant="enclosed"
      display={{
        base: showLeftTab ? "block" : "none",
        sm: showLeftTab ? "block" : "none",
        md: "block",
      }}
      // h={"100%"}
      h={["calc(100vh - 77px)", "calc(100vh - 77px)", "calc(100vh - 150px)"]}
      border={"1px solid grey"}
      borderColor={"gray.200"}
      borderRadius={"10px"}
      // mt={["10px", "10px", "0"]}
    >
      <TabList mb="1em">
        <Tab display={"flex"} justifyContent={"space-around"}>
          Public Rooms{" "}
          {totalNotificationsPublic !== 0 && (
            <Flex
              as="span"
              width={"25px"}
              height={"25px"}
              display="flex"
              borderRadius={"50%"}
              bg={"blue.400"}
              color={"white"}
              p={"5px"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {totalNotificationsPublic}
            </Flex>
          )}
        </Tab>
        <Tab display={"flex"} justifyContent={"space-around"}>
          Private Chats{" "}
          {totalNotificationsPrivate !== 0 && (
            <Flex
              as="span"
              width={"25px"}
              height={"25px"}
              display="flex"
              borderRadius={"50%"}
              bg={"blue.400"}
              color={"white"}
              p={"5px"}
              alignItems={"center"}
              justifyContent={"center"}
            >
              {totalNotificationsPrivate}
            </Flex>
          )}
        </Tab>
      </TabList>
      <TabPanels h={"calc(100% - 56px)"}>
        <TabPanel h={"100%"}>
          <InputGroup>
            <Input
              mb="15px"
              placeholder="Search Groups..."
              value={publicSearch}
              onChange={(e) => setPublicSearch(e.target.value)}
            />
            <InputRightElement>
              {publicSearch && (
                <IconButton
                  aria-label="Clear"
                  icon={<CloseIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setPublicSearch("");
                    onClose();
                  }}
                />
              )}
            </InputRightElement>
          </InputGroup>
          <Box
            h={"calc(100% - 56px)"}
            style={{
              overflow: "auto",
            }}
          >
            {publicSearch
              ? memoizedPublicRooms(searchedPublic)
              : memoizedPublicRooms(rooms)}
          </Box>
        </TabPanel>
        <TabPanel h={"100%"} position={"relative"}>
          <InputGroup>
            <Input
              mb="15px"
              placeholder="Search People..."
              value={privateSearch}
              onChange={(e) => setPrivateSearch(e.target.value)}
            />
            <InputRightElement>
              {privateSearch && (
                <IconButton
                  aria-label="Clear"
                  icon={<CloseIcon />}
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setPrivateSearch("");
                    onClose();
                  }}
                />
              )}
            </InputRightElement>
          </InputGroup>
          <Box
            h={"calc(100% - 56px)"}
            style={{
              overflow: "auto",
            }}
          >
            {privateSearch
              ? memoizedPrivateChats(searchedPrivate)
              : memoizedPrivateChats(members)}
          </Box>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
};

export default LeftTab;

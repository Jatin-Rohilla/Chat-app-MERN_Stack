"use client";
import { useRouter } from "next/navigation";
import styles from "../styles/page.module.css";
import Navbar from "@/components/Navbar";
import React, { useEffect } from "react";
import Homepage from "@/components/Homepage";
import { useAppSelector } from "@/redux/providers";
import PrivateRoute from "@/redux/PrivateRoute";
import Loading from "@/components/Loading";
import { useToast } from "@chakra-ui/react";

const Home: React.FC = () => {
  // const router = useRouter();
  // const isAuth = useAppSelector((store) => store.auth.isAuth);

  let toast = useToast();
  useEffect(() => {
    toast({
      description:
        "It can take upto 2 mins in initial start, please be patient!",
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top",
    });
  }, []);

  return (
    <main className={styles.main}>
      {/* <Loading /> */}
      <PrivateRoute>
        <Homepage />
      </PrivateRoute>
    </main>
  );
};

export default Home;

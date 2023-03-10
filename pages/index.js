import Head from "next/head";
import { Inter } from "@next/font/google";
import {
  Box,
  Button,
  Center,
  Container,
  FormControl,
  FormLabel,
  Input,
  Text,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUserStore, client } from "../store/store";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  //react hook form declaration
  const { register, handleSubmit } = useForm();

  //next router declaration
  const router = useRouter();

  //declaring global state using context
  const { currentUser } = useUserStore((state) => state);

  //declaring globat setState function
  const { setCurrentUser } = useUserStore((state) => state);

  //login form submit handler
  const submitHandler = async (data) => {
    try {
      await client
        .collection("users")
        .authWithPassword(data.username, data.password);
      if (client.authStore.model) {
        setCurrentUser(client.authStore.model);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser) {
      router.push("/dashboard");
    } else {
    }
  }, [currentUser]);

  console.log(currentUser);
  return (
    <>
      <Head>
        <title>Login</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container maxW={"100%"} h={"100%"} flex={1}>
        <Center h={"100vh"}>
          <Box maxW={"xl"}>
            <Text
              textAlign={"center"}
              my={3}
              fontSize={"xl"}
              fontWeight={"semibold"}
            >
              Login
            </Text>
            <Box
              bgColor={"white"}
              w={"100%"}
              borderRadius={"md"}
              boxShadow={"md"}
              p={4}
            >
              <form onSubmit={handleSubmit(submitHandler)}>
                <FormControl isRequired>
                  <FormLabel>Username</FormLabel>
                  <Input
                    type={"text"}
                    name={"username"}
                    {...register("username")}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type={"password"}
                    name={"password"}
                    {...register("password")}
                  />
                </FormControl>

                <Button
                  mx={"auto"}
                  type="submit"
                  mt={4}
                  colorScheme="green"
                  w={"100%"}
                >
                  Login
                </Button>
              </form>
            </Box>
          </Box>
        </Center>
      </Container>
    </>
  );
}

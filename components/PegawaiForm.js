import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import pocketbaseEs from "pocketbase";
import { useEffect, useState } from "react";

export default function PegawaiForm({ onClose }) {
  // pocketbase declaration to connect with the database
  const client = new pocketbaseEs("http://127.0.0.1:8090/");

  // declaring state to reset the form
  const [safeToReset, setSafeToReset] = useState(false);

  //declaring function to reload the window
  const refresh = () => {
    window.location.reload();
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitSuccessful },
  } = useForm();

  async function postData(data) {
    try {
      await client.collection("daftar_pegawai").create(data);
      setSafeToReset(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(
    function () {
      if (safeToReset) {
        reset();
        setSafeToReset(false);
        refresh();
      }
    },
    [safeToReset]
  );
  return (
    <>
      <Box maxW={"100%"} bgColor={"white"} borderRadius={"md"} p={1}>
        <form onSubmit={handleSubmit(postData)}>
          <VStack w={"100%"} px={2} py={4} spacing={2}>
            <FormControl isRequired>
              <FormLabel>Nama</FormLabel>
              <Input type={"text"} name={"nama"} {...register("nama")} />
            </FormControl>
            <FormControl>
              <FormLabel>Pangkat</FormLabel>
              <Input type={"text"} name={"pangkat"} {...register("pangkat")} />
            </FormControl>
            <FormControl>
              <FormLabel>Golongan</FormLabel>
              <Input
                type={"text"}
                name={"golongan"}
                {...register("golongan")}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Jabatan</FormLabel>
              <Input type={"text"} name={"jabatan"} {...register("jabatan")} />
            </FormControl>
            <FormControl>
              <FormLabel>NIP</FormLabel>
              <Input type={"text"} name={"golongan"} {...register("nip")} />
            </FormControl>
          </VStack>
          <Button
            onClick={onClose}
            w={"100%"}
            type="submit"
            colorScheme={"green"}
            my={4}
          >
            Submit
          </Button>
        </form>
      </Box>
    </>
  );
}

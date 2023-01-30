import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import pocketbaseEs from "pocketbase";
import { useEffect, useState } from "react";
import { address } from "../store/store";

export default function Spdform({ nomor, listNama, stId, onClose }) {
  //declaring variables to connect to database
  const client = new pocketbaseEs(address);

  //declaring state to reset the form
  const [safeToReset, setSafeToReset] = useState(false);

  //declaring toast for submit success
  const successToast = useToast();

  //declaring toast for error on submit
  const errorToast = useToast();

  //declaring function to reload the page
  const refresh = () => {
    window.location.reload();
  };

  //declaring react hook form
  const {
    handleSubmit,
    register,
    reset,
    formState: { isSubmitSuccessful, isSubmitting },
  } = useForm();

  const postData = async (data) => {
    data.surat_tugas = stId;
    data.nomor = nomor;
    try {
      await client.collection("spd").create(data);
      setSafeToReset(true);
    } catch (error) {
      errorToast({
        position: "top",
        title: "Submit Gagal",
        description: "Input data gagal",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  useEffect(() => {
    if (safeToReset) {
      reset();
      setSafeToReset(false);
    }
    if (isSubmitSuccessful) {
      successToast({
        position: "top",
        title: "Input Sukses",
        description: "Data SPD berhasil diinput",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      refresh();
    }
  });

  return (
    <>
      <Box bgColor={"white"} borderRadius={"md"} p={1}>
        <VStack w={"100%"} px={2} py={4}>
          <form onSubmit={handleSubmit(postData)}>
            <FormControl>
              <FormLabel>Surat Tugas ID</FormLabel>
              <Input
                type={"text"}
                defaultValue={stId}
                name={"surat_tugas"}
                disabled={true}
                {...register("surat_tugas")}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Nomor SPD</FormLabel>
              <Input
                type={"number"}
                defaultValue={nomor}
                name={"nomor"}
                disabled={true}
                {...register("nomor")}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Nama Pegawai</FormLabel>
              <Select
                placeholder="Pilih Nama Pegawai"
                name="pegawai"
                {...register("pegawai")}
              >
                {listNama.map((nama) => {
                  if (nama) {
                    return (
                      <option key={nama.id} value={nama.id}>
                        {nama.nama}
                      </option>
                    );
                  }
                })}
              </Select>
            </FormControl>
            <Button
              onClick={onClose}
              w={"100%"}
              type="submit"
              colorScheme={"green"}
              my={3}
            >
              Submit
            </Button>
          </form>
        </VStack>
      </Box>
    </>
  );
}

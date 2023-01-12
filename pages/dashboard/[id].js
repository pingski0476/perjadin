import {
  Button,
  Center,
  Container,
  Text,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  TableContainer,
  Table,
  Thead,
  Tr,
  Td,
  Th,
  Tbody,
} from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useMemo } from "react";
import Spdform from "../../components/Spdform";
import { useUserStore, client } from "../../store/store";

export default function Details() {
  //declaring modal state open or close
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { currentUser } = useUserStore((state) => state);

  //declaring state for storing details id
  const [id, setId] = useState("");

  //declaring state for single data
  const [single, setSingle] = useState({});

  //declaring state for spd data
  const [spdData, setSpdData] = useState([]);

  //declaring state for nama list
  const [listNama, setListNama] = useState([]);

  //declaring variables for next router
  const router = useRouter();

  //declaring function to get id data from router variables into id state
  useEffect(() => {
    if (router.isReady) {
      setId(router.query.id);
    }
  }, [router.isReady, router.query.id]);

  //declaring function to fetch single item from surat tugas database
  const getSingleST = async () => {
    try {
      let singleData = await client.collection("surat_tugas").getOne(`${id}`, {
        expand: "pegawai_1, pegawai_2, pegawai_3, pegawai_4, pegawai_5",
      });
      setSingle(singleData);
    } catch (error) {
      console.log(error);
    }
  };

  //declaring function to fetch list from spd database
  const getSPD = async () => {
    try {
      let dataSpd = await client
        .collection("spd")
        .getFullList(6, { sort: "+created", expand: "surat_tugas, pegawai" });
      setSpdData(dataSpd);
    } catch (error) {
      console.log(error);
    }
  };

  const getName = () => {
    const arrayNama = [];
    const daftPegawai = single.expand;
    if (daftPegawai) {
      if (single.pegawai_1 !== "") {
        arrayNama.push(daftPegawai.pegawai_1);
      }
      if (single.pegawai_2 !== "") {
        arrayNama.push(daftPegawai.pegawai_2);
      }
      if (single.pegawai_3 !== "") {
        arrayNama.push(daftPegawai.pegawai_3);
      }
      if (single.pegawai_4 !== "") {
        arrayNama.push(daftPegawai.pegawai_4);
      }
      if (single.pegawai_5 !== "") {
        arrayNama.push(daftPegawai.pegawai_5);
      }
      setListNama(arrayNama);
    }
  };

  useEffect(() => {
    getSingleST();
  }, [id]);

  useEffect(() => {
    getName();
  }, [single]);

  useEffect(() => {
    getSPD();
  }, []);

  useEffect(() => {
    if (currentUser === null) {
      router.push("/");
    }
  }, [currentUser]);

  const filteredSPD = useMemo(
    () => spdData.filter((data) => data.surat_tugas === id),
    [id, spdData]
  );

  const nomorSPD = spdData.length + 1;

  return (
    <>
      <Head>
        <title>Details</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Container maxW={"100%"} flex={1}>
        <Center h={"100vh"} maxW={"100vw"} p={4}>
          <VStack>
            <Text
              textAlign={"center"}
              my={3}
              fontSize={"xl"}
              fontWeight={"semibold"}
            >
              Details Perjalanan
            </Text>
            <Button colorScheme={"green"} onClick={onOpen}>
              Buat SPD
            </Button>
            <Modal isOpen={isOpen} onClose={onClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader textAlign={"center"}>Tambah SPD</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Spdform
                    nomor={nomorSPD}
                    listNama={listNama}
                    stId={id}
                    onClose={onClose}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
            <TableContainer>
              <Table variant={"striped"}>
                <Thead>
                  <Tr>
                    <Th>Nomor ST</Th>
                    <Th>Nomor</Th>
                    <Th>Pelaksana</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredSPD.map((spd) => {
                    let suratTugas = spd.expand.surat_tugas;
                    let pegawai = spd.expand.pegawai;
                    let tanggal = new Date(suratTugas.created);
                    let stMonth = tanggal.getMonth() + 1;
                    let stYear = tanggal.getFullYear();

                    function test() {
                      if (stMonth < 10) {
                        let bulan = "0" + stMonth;
                        return bulan;
                      } else {
                        let bulan = stMonth;
                        return bulan;
                      }
                    }

                    const month = test();

                    return (
                      <Tr key={spd.id}>
                        {suratTugas.nomor < 10 ? (
                          <Td>{`0${suratTugas.nomor}/TU.040/A.10/${month}/${stYear}`}</Td>
                        ) : (
                          <Td>{`${suratTugas.nomor}/TU.040/A.10/${month}/${stYear}`}</Td>
                        )}

                        {spd.nomor < 10 ? (
                          <Td>{`0${spd.nomor}/TU.040/A.10/${month}/${stYear}`}</Td>
                        ) : (
                          <Td>{`${spd.nomor}/TU.040/A.10/${month}/${stYear}`}</Td>
                        )}

                        <Td>{pegawai.nama}</Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </VStack>
        </Center>
      </Container>
    </>
  );
}

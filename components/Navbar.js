import { Box, Button } from "@chakra-ui/react";
import { useUserStore } from "../store/store";
import Link from "next/link";

export default function Navbar() {
  const { currentUser, logoutUser } = useUserStore((state) => state);

  return (
    <Box w={"full"} px={0} display={"flex"} justifyContent={"flex-end"} py={2}>
      {currentUser?.name === "kepegawaian" ? (
        <Link href={"/dashboard/kepegawaian"}>
          <Button colorScheme={"green"} mx={2}>
            Kepegawaian
          </Button>
        </Link>
      ) : (
        <></>
      )}

      <Button colorScheme={"blue"} mx={2} onClick={logoutUser}>
        Logout
      </Button>
    </Box>
  );
}

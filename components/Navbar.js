import { Box, Button } from "@chakra-ui/react";
import { useUserStore } from "../store/store";

export default function Navbar() {
  const { logoutUser } = useUserStore((state) => state);

  return (
    <Box w={"full"} px={0} display={"flex"} justifyContent={"flex-end"} py={2}>
      <Button colorScheme={"blue"} mx={2} onClick={logoutUser}>
        Logout
      </Button>
    </Box>
  );
}

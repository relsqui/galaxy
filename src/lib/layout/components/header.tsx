import { Center, Box, Flex, Stack, IconButton } from "@chakra-ui/react";

import { ColorModeButton } from "@/lib/components/ui/color-mode";
import { Login } from "./login";
import { LuHouse } from "react-icons/lu";
import { useMoveTo } from "@/lib/pages/home/hooks/useMoveTo";

export const Header = () => {
  const moveTo = useMoveTo();

  return (
    <Flex
      as="header"
      width="full"
      align="center"
      alignSelf="flex-start"
      justifyContent="center"
      gridGap={2}
    >
      <Box marginLeft="auto">
        <Stack direction="row">
          <Center>
            <Login />
            <ColorModeButton />
            <IconButton aria-label="Go home" variant="ghost" onClick={() => moveTo(1)}>
              <LuHouse />
            </IconButton>
          </Center>
        </Stack>
      </Box>
    </Flex>
  );
};

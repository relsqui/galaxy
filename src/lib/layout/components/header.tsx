import { Center, Box, Flex, Stack } from "@chakra-ui/react";

import { ColorModeButton } from "@/lib/components/ui/color-mode";
import { Login } from "./login";

export const Header = () => {
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

          </Center>
        </Stack>
      </Box>
    </Flex>
  );
};

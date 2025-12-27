import { Center, Box, Flex, Stack, IconButton } from "@chakra-ui/react";

import { ColorModeButton } from "@/lib/components/ui/color-mode";
import { Login } from "./login";
import { LuHouse } from "react-icons/lu";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectCurrentPerson } from "@/app/store/slices/currentSelectors";
import { updatePerson } from "@/app/store/slices/personSlice";

export const Header = () => {
  const currentPerson = useAppSelector(selectCurrentPerson);
  const dispatch = useAppDispatch();

  const goHome = async () => {
    dispatch(updatePerson({id: currentPerson.id, location: 1}));
  }

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
            <IconButton aria-label="Go home" variant="ghost" onClick={goHome}>
              <LuHouse />
            </IconButton>
          </Center>
        </Stack>
      </Box>
    </Flex>
  );
};

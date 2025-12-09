import { Grid } from "@chakra-ui/react";

import { Login } from "./components/login";
import { Room } from "./components/room";

const Home = async () => {
  return (
    <>
      <Login />
      <Room />
      <Grid gap={4}></Grid>
    </>
  );
};

export default Home;

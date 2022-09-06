import { Box } from "@chakra-ui/layout";
import { Flex } from "@chakra-ui/react";
import { FunctionComponent } from "react";

interface LayoutProps {
  children: any;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <Flex alignItems="center" justifyContent="center">
      <Box maxW="2xl" w="100%" p={4}>
        {children}
      </Box>
    </Flex>
  );
};

export default Layout;

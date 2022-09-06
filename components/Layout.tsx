import { Box } from "@chakra-ui/layout";
import { FunctionComponent } from "react";

interface LayoutProps {
  children: any;
}

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <Box maxW="2xl" w="100%" p={4}>
      {children}
    </Box>
  );
};

export default Layout;

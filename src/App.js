import axios from "axios";
import React, { useEffect, useState } from "react";
// import { SECRET_KEY } from "./constants";
import { Base64 } from "./base64";
import FileBase from "react-file-base64";
import {
  ChakraProvider,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  useDisclosure,
  AlertDialogCloseButton,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Flex,
  Input,
  useToast,
  Wrap,
  WrapItem,
  Image,
  Skeleton,
  Container,
  Heading,
  Box,
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
} from "@chakra-ui/react";
import "./App.css";
export default function App() {
  // Name of image
  const [seletedFileName, setSelectedFileName] = useState(null);
  // Getting image from input field
  const [singleFile, setSingleFile] = useState([]);
  // Converting image into base64
  const [singleFileBase64, setSinglFileBase64] = useState();
  // Button Loading
  const [btnLoading, setBtnLoading] = useState(false);
  // Loading
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (singleFile.selectedFile !== undefined) {
      let base64Pure = singleFile.selectedFile.slice(22);
      // jpg
      // let base64Pure = singleFile.selectedFile.slice(23);
      setSinglFileBase64(base64Pure);
      // console.log(singleFileBase64);
    }

    let file = document.querySelectorAll('input[type="file"]')[0];
    // file.setAttribute("accept", "image/png, image/gif, image/jpeg");
    file.setAttribute("accept", "image/png");
    file.setAttribute("id", "imageShot");
    file.onchange = function (e) {
      setSelectedFileName(e.target.value.slice(12));
    };
    // let triggerImageShot = document.getElementById("triggerImageShot");
    // triggerImageShot.addEventListener("click", () => {
    //   // file.addEventListener("click", (e) => console.log(e));
    // });
  }, [singleFile, singleFileBase64]);

  useEffect(() => {
    if (seletedFileName === null || seletedFileName === undefined) {
      return;
    }
    console.log(seletedFileName);
  }, [seletedFileName]);

  const convertJPEGtoWEBP = async (event) => {
    event.preventDefault();
    // const formData = new FormData();
    // formData.append("seletedFile", seletedFile);
    // console.log(formData);
    try {
      setLoading(true);
      const url = `https://v2.convertapi.com/convert/png/to/webp?Secret=${process.env.REACT_APP_API_KEY}&StoreFile=true`;
      const res = await axios.post(url, {
        headers: {
          "Content-Type": "application/json",
        },
        Parameters: [
          {
            Name: "File",
            FileValue: {
              Name: seletedFileName,
              Data: singleFileBase64,
            },
          },
          {
            Name: "StoreFile",
            Value: true,
          },
        ],
      });
      setBtnLoading(false);
      setLoading(false);
      console.log(res);
      console.log(res.data);
    } catch (error) {
      console.log("Catching error: " + error);
    }
  };
  const handleFileSelect = (e) => {
    console.log(e.target.files[0].name);
    setSelectedFileName(e.target.files[0]);
  };
  return (
    <>
      <ChakraProvider>
        <Container maxW={"1140px"}>
          <Flex
            bg={"gray.100"}
            alignItems={"center"}
            justifyContent="center"
            h="100vh"
            direction={"column"}
            rowGap={10}
          >
            <Heading as={"h1"} textAlign="center">
              Convert PNG to WEBP
            </Heading>
            <Box
              border="2px dashed"
              borderColor="gray.300"
              p={25}
              borderRadius={8}
              w={"80%"}
              cursor="pointer"
              onClick={() =>
                document.querySelector('input[type="file"]').click()
              }
            >
              {singleFileBase64 ? (
                <Flex justifyContent="center">
                  <Image
                    src={`data:image/jpeg;base64,${singleFileBase64}`}
                    alt={seletedFileName}
                    objectFit="contain"
                    height={300}
                  />
                </Flex>
              ) : (
                <Flex
                  textAlign={"center"}
                  justifyContent={"center"}
                  direction="column"
                >
                  <Image
                    src={require("./assets/images/dummy-image.png")}
                    w={300}
                    m="auto"
                  />
                  <Heading
                    mt={3}
                    as={"h5"}
                    color="gray.500"
                    fontWeight="300"
                    fontSize="md"
                  >
                    Click to select
                  </Heading>
                </Flex>
              )}
            </Box>
            <form method="POST" onSubmit={convertJPEGtoWEBP}>
              <FormControl>
                {/* <input type="file" name="" id="" onChange={handleFileSelect} /> */}
                <Flex direction="column">
                  <FormLabel textAlign="center" textTransform="capitalize">
                    {seletedFileName
                      ? "File Name: " + seletedFileName.slice(0, -4)
                      : "Select A File"}
                  </FormLabel>
                  <FileBase
                    type="file"
                    multiple={false}
                    onDone={({ base64 }) =>
                      setSingleFile({ ...singleFile, selectedFile: base64 })
                    }
                    onChange={handleFileSelect}
                  />
                  <Button
                    isLoading={btnLoading}
                    w={300}
                    type="submit"
                    bg={"green.400"}
                    color="white"
                    _hover={{ bg: "green.300" }}
                  >
                    Submit
                  </Button>
                </Flex>
              </FormControl>
            </form>
          </Flex>
          <DownloadTable isLoading={isLoading} title={seletedFileName} />
        </Container>
      </ChakraProvider>
    </>
  );
}

const DownloadTable = (props) => {
  let isLoading = props.isLoading;
  return isLoading ? (
    <TableContainer>
      <Table variant="simple">
        <Tbody>
          <Tr>
            <Td>{props.seletedFileName}</Td>
            <Td>
              <Button>Download Now</Button>
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </TableContainer>
  ) : (
    ""
  );
};

function ToastStatusExample() {
  const toast = useToast();
  const statuses = ["success", "error", "warning", "info"];

  return (
    <Wrap>
      {statuses.map((status, i) => (
        <WrapItem key={i}>
          <Button
            onClick={() =>
              toast({
                title: `${status} toast`,
                status: status,
                isClosable: true,
              })
            }
          >
            Show {status} toast
          </Button>
        </WrapItem>
      ))}
    </Wrap>
  );
}

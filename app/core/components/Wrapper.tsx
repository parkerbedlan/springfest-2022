import { Box } from "@chakra-ui/layout"
import { Button } from "@chakra-ui/react"
import { BlitzChakraLink } from "app/core/components/BlitzChakraLink"
import { Routes } from "blitz"
import React from "react"

export type WrapperVariant = "small" | "regular"

type WrapperProps = {
  variant?: WrapperVariant
  showNavbar?: boolean
}

export const Wrapper: React.FC<WrapperProps> = ({
  children,
  variant = "regular",
  showNavbar = true,
}) => {
  return (
    <>
      {showNavbar && (
        <Box bgColor="gray.300" position="sticky" top="0" w="100%" p="2" zIndex={5}>
          <BlitzChakraLink href={Routes.Home()} color="default">
            <Button variant={"ghost"}>Springfest</Button>
          </BlitzChakraLink>
          <BlitzChakraLink href={Routes.ActivitiesPage()} color="default">
            <Button variant={"ghost"} fontWeight="medium">
              Activities
            </Button>
          </BlitzChakraLink>
          <BlitzChakraLink href={Routes.OrgsPage()} color="default">
            <Button variant={"ghost"} fontWeight="medium">
              Orgs
            </Button>
          </BlitzChakraLink>
        </Box>
      )}
      <Box maxW={variant === "regular" ? "800px" : "400px"} w="100%" mt={8} mx="auto" px={4}>
        {children}
      </Box>
    </>
  )
}

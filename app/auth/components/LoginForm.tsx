import { AuthenticationError, Link, useMutation, Routes, PromiseReturnType } from "blitz"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { Form, FORM_ERROR } from "app/core/components/Form"
import login from "app/auth/mutations/login"
import { Login } from "app/auth/validations"
import { BlitzChakraLink } from "../../core/components/BlitzChakraLink"
import { Text } from "@chakra-ui/react"
import { Wrapper } from "app/core/components/Wrapper"

type LoginFormProps = {
  onSuccess?: (user: PromiseReturnType<typeof login>) => void
}

export const LoginForm = (props: LoginFormProps) => {
  const [loginMutation] = useMutation(login)

  return (
    <Wrapper showNavbar={false}>
      <Text fontSize={"2xl"} color="red">
        This part of the site is locked: admins only!
      </Text>

      <Text fontSize="3xl" mb="4">
        Login
      </Text>

      <Form
        submitText="Login"
        schema={Login}
        initialValues={{ email: "", password: "" }}
        onSubmit={async (values) => {
          try {
            const user = await loginMutation(values)
            props.onSuccess?.(user)
          } catch (error: any) {
            if (error instanceof AuthenticationError) {
              return { [FORM_ERROR]: "Sorry, those credentials are invalid" }
            } else {
              return {
                [FORM_ERROR]:
                  "Sorry, we had an unexpected error. Please try again. - " + error.toString(),
              }
            }
          }
        }}
      >
        <LabeledTextField name="email" label="Email" placeholder="Email" />
        <LabeledTextField name="password" label="Password" placeholder="Password" type="password" />
        <BlitzChakraLink href={Routes.ForgotPasswordPage()}>Forgot your password?</BlitzChakraLink>
      </Form>

      <div style={{ marginTop: "1rem" }}>
        Or <BlitzChakraLink href={Routes.SignupPage()}>Sign Up</BlitzChakraLink>
      </div>
    </Wrapper>
  )
}

export default LoginForm

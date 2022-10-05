import { forwardRef, PropsWithoutRef, ComponentPropsWithoutRef } from "react"
import { useField, useFormikContext, ErrorMessage } from "formik"

import { Input } from "@chakra-ui/input"
import { FormControl, FormLabel } from "@chakra-ui/form-control"

export interface LabeledTextFieldProps extends ComponentPropsWithoutRef<typeof Input> {
  /** Field name. */
  name: string
  /** Field label. */
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  isTextArea?: boolean
}

export const LabeledTextField = forwardRef<HTMLInputElement, LabeledTextFieldProps>(
  ({ name, label, outerProps, isTextArea, ...props }, ref) => {
    const [input] = useField(name)
    const { isSubmitting } = useFormikContext()

    return (
      <div {...outerProps}>
        <FormLabel>
          {label}
          {isTextArea ? (
            //@ts-ignore
            <Input {...input} disabled={isSubmitting} {...props} ref={ref} as="textarea" h="8em" />
          ) : (
            <Input {...input} disabled={isSubmitting} {...props} ref={ref} />
          )}
        </FormLabel>
        <ErrorMessage name={name}>
          {(msg) => (
            <div role="alert" style={{ color: "red" }}>
              {msg}
            </div>
          )}
        </ErrorMessage>
      </div>
    )
  }
)

export default LabeledTextField

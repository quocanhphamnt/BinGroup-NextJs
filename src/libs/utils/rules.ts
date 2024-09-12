import type { CustomTypeConfig } from '@/types/common'
import { MAX_FILE_SIZE, SUPPORTED_FORMATS } from '@/ui/MultipleFileUpload/MultipleFileUpload'
import * as yup from 'yup'

const fullNameValidate = (t: CustomTypeConfig<string>) => {
  return yup.string().trim().required(t?.txt_field_required).max(255, t?.txt_field_invalid).min(1, t?.txt_field_invalid)
  // .matches(/^[a-zA-ZÀ-ỹ\s.,\-_()*&0-9]{1,255}$/u, t?.txt_format_your_full_name)
}

const emailValidate = (t: CustomTypeConfig<string>) => {
  return yup
    .string()
    .required(t?.txt_field_required)
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^[a-zA-Z0-9]+([_\.\!\-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([_\.\!\-]?[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/g,
      t?.txt_field_invalid
    )
}

const phoneNumberValidate = (t: CustomTypeConfig<string>) => {
  return yup.string().trim().required(t?.txt_field_required).min(6, t?.txt_field_invalid)
  // .matches(/^\+\d{1,3}\d{6,19}$/, t?.txt_phone_number_invalid)
}

export const filesValidationSchema = (t: CustomTypeConfig<string>) => {
  return yup
    .array()
    .nullable()
    .max(3, t?.txt_contact_us_limit_file)
    .test({
      name: 'fileSize',
      exclusive: false,
      message: t?.txt_file_size_limit,
      test: (value) => value?.every((file) => file?.file.size < MAX_FILE_SIZE)
    })
    .test({
      name: 'fileFormat',
      exclusive: false,
      message: t?.txt_select_correct_file_format,
      test: (value) => value?.every((file) => SUPPORTED_FORMATS.includes(file?.file.type as string))
    })
}

const selectValidate = (t: CustomTypeConfig<string>) => {
  return yup
    .object()
    .required(t?.txt_field_required)
    .typeError(t?.txt_field_required)
    .test('required', t?.txt_field_invalid, (value) => Object.keys(value).length > 0)
}

export const BookingSchema = (t: CustomTypeConfig<string>) => {
  const schema = yup.object({
    leadform_name: fullNameValidate(t),
    leadform_email: emailValidate(t),
    leadform_phone: phoneNumberValidate(t),
    leadform_residence: selectValidate(t),
    leadform_type_id: selectValidate(t)
  })

  return schema
}

export const ContactFormSchema = (t: CustomTypeConfig<string>) => {
  const schema = yup.object({
    contact_name: fullNameValidate(t),
    contact_email: emailValidate(t),
    contact_phone: phoneNumberValidate(t),
    contact_subject: fullNameValidate(t),
    contact_type_id: selectValidate(t),
    contact_file: filesValidationSchema(t)
  })

  return schema
}

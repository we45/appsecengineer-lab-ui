const inputProps = {
  noDense: Boolean,
  noOutlined: Boolean,
  label: String,
  labelClass: [String, Object, Array],
  labelStyle: [String, Object, Array]
}
const inputFieldProps = {
  ...inputProps
}
const inputSelectProps = {
  ...inputProps,
  useInput: Boolean,
  useChips: Boolean,
  optionValue: {
    type: [String, Function],
    default: 'id'
  },
  optionLabel: {
    type: [String, Function],
    default: 'name'
  },
  options: {
    type: Array,
    default: () => []
  }
}
export { inputProps, inputSelectProps, inputFieldProps }

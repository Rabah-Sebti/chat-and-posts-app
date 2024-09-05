import PropTypes from "prop-types";
// form
import { useFormContext } from "react-hook-form";
// @ui
import { Textarea } from "../ui/textarea";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "../ui/form";

// ----------------------------------------------------------------------

RHFTextArea.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
};

export default function RHFTextArea({ name, label, helperText, ...other }) {
  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          {label && (
            <FormLabel className="select-none text-sm lg:text-lg">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <Textarea className="resize-none" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

import PropTypes from "prop-types";
// form
import { useFormContext, Controller } from "react-hook-form";
// @mui
import { Input } from "../ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormLabel,
} from "../ui/form";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

// ----------------------------------------------------------------------

RHFTextField.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  helperText: PropTypes.node,
  isPassword: PropTypes.bool,
};

export default function RHFTextField({
  name,
  label,
  helperText,
  isPassword = false,
  ...other
}) {
  const [showPassword, setShowPassword] = useState(false);

  const { control } = useFormContext();

  return (
    <FormField
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <FormItem>
          {label && (
            <FormLabel className="select-none text-fluid-lg ">
              {label}
            </FormLabel>
          )}
          <FormControl>
            <div className="relative flex items-center">
              <Input
                type={`${isPassword && !showPassword ? "password" : "text"}`}
                {...field}
                {...other}
                className="rounded-xl h-[45px] 2xl:h-[50px]"
              />
              {isPassword && (
                <div
                  className="select-none flex flex-row items-center absolute right-4  cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              )}
            </div>
          </FormControl>

          <FormMessage />
        </FormItem>
      )}
    />
  );
}

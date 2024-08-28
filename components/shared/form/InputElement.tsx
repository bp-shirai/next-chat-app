import { FormControl, FormField, FormItem, FormLabel } from "@components/ui/form";
import { Input } from "@components/ui/input";
import React, { HTMLInputTypeAttribute } from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface InputProps {
  name: FieldPath<FieldValues>;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  label: string;
  control: Control<FieldValues>;
}

export const InputElement = ({ label, name, type = "text", placeholder, control }: InputProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
        </FormItem>
      )}
    />
  );
};

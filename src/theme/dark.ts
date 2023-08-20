import { useDark, useToggle } from "@vueuse/core";

export const value = useDark();
export const toggle = useToggle(value);
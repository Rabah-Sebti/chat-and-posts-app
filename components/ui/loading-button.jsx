import * as React from "react";

import { Loader2 } from "lucide-react";
import { Button } from "./button";

export default function LoadingButton({ children, loading, ...props }) {
  return (
    <Button {...props} disabled={props.disabled || loading}>
      {loading && <Loader2 className="mr-2 animate-spin" />}
      {children}
    </Button>
  );
}

"use client";

import { Contrast, ImagesearchRoller, Opacity } from "@mui/icons-material";
import { Divider } from "@mui/material";
import React from "react";

export default function PrinterComponentsView({
  components = [],
}: {
  components: Array<Object>;
}) {
  return (
    <div className="flex flex-col gap-4">
      {components?.map((component: any) => {
        return (
          <React.Fragment key={component.printerComponentId}>
            <Divider />
            <div className="flex gap-2">
              {component.componentType === "cartridge" ? (
                <Opacity />
              ) : (
                <ImagesearchRoller />
              )}
              <div>{`${component.makeModel} - ${component.partNumber}`}</div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

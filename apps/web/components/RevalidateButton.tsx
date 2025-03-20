'use client'

import React, { type FC } from "react";
import revalidate from "../actions/revalidate";

export const RevalidateButton: FC = (): JSX.Element => {

  function handleRevalidate() {
    revalidate("pokemon");
  }

  return (
    <button type="button" onClick={handleRevalidate}>
      Revalidate
    </button>
  );
};

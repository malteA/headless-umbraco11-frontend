import React from "react";

interface Props {
  value: string;
}

export const Rte = ({ value }: Props) => (
  <div dangerouslySetInnerHTML={{ __html: value }}></div>
);

export default Rte;

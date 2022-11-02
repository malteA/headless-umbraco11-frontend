import React from "react";

interface Props {
  value: string;
}

export const Headline = ({ value }: Props) => <h1>{value}</h1>;

export default Headline;

import { FunctionComponent } from "react";

import classes from "./currency-formatter.module.scss";

interface Props {
  amount: number;
}

export const CurrencyFormatter: FunctionComponent<Props> = ({ amount }) => {
  return <span className={classes.currency}>${amount}</span>;
};

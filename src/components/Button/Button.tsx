import classes from "./Button.module.css";

interface ButtonProps {
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export default function Button({ ...props }: ButtonProps) {
  return (
    <button
      className={
        props.isActive ? `${classes.button} ${classes.active}` : `${classes.button}`
       }
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

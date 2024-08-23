import classes from "./Button.module.css";

interface ButtonProps {
  className?: string;
  children: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}

export default function Button({ ...props }: ButtonProps) {
  return (
    <button
      className={
        props.isActive ? `${classes.button} ${classes.active} ${props.className}` : `${classes.button} ${props.className}`
       }
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

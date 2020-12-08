import React, { forwardRef, useImperativeHandle, useState } from "react";
import "./styles/Login.css";

const LoginForm = forwardRef((props, ref) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
    setError("");
    props.onChange(event.target.name, event.target.value);
  };

  const validate = () => {
    //return true if is valid
    //else return false

    if (props.validation) {
      const rules = props.validation.split("|");

      for (let i = 0; i < rules.length; i++) {
        const current = rules[i];

        if (current === "required") {
          if (!value) {
            setError("This field is required");
            return false;
          }
        }

        const pair = current.split(":");
        switch (pair[0]) {
          case "min":
            if (value.length < pair[1]) {
              setError(
                `This field must be at least ${pair[1]} charactesr long`
              );
              return false;
            }
            break;
          case "max":
            if (value.length > pair[1]) {
              setError(
                `This field must be no longer than ${pair[1]} charactesr long`
              );
              return false;
            }
            break;
          default:
            break;
        }
      }
    }

    return true;
  };

  useImperativeHandle(ref, () => {
    return {
      validate: () => validate(),
    };
  });

  return (
    <div className="input-wrapper">
      {props.label && <label>{props.label}</label>}
      <input
        placeholder={props.placeholder}
        name={props.name}
        onChange={(event) => handleChange(event)}
        type={props.type}
        value={props.value ? props.value : value}
        autoComplete={props.autoComplete}
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
});

export default LoginForm;

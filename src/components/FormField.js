import React from "react";

const FormField = ({
                     label,
                     control = <input className="input" type="text"/>
}) => (
  <div className="field">
    {label && <label className="label">{label}</label>}

    <div className="control">
      {React.cloneElement(control)}
    </div>
  </div>
)

export default FormField;

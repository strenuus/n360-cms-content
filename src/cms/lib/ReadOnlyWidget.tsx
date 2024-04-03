import React, {forwardRef} from 'react';

type ReadOnlyProps = {
  forID: string;
  value: string;
  classNameWrapper: string;
};

const ReadOnly = forwardRef<HTMLDivElement, ReadOnlyProps>((props, ref) => {
  const { forID, value, classNameWrapper } = props;
  const unset = value === "__unset__"

  return <div ref={ref}>
    {unset ? (
      <>
        <input
          type="text"
          value=""
          readOnly
          className={classNameWrapper}
        />
        <input
          type="hidden"
          id={forID}
          value={value}
        />
      </>
    ) : (
      <input
        type="text"
        id={forID}
        value={value}
        readOnly
        className={classNameWrapper}
      />
    )}
  </div>
});

export default ReadOnly;

"use client";

export const PrimaryButton = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2 border border-gray-800 "
    >
      {children}
    </button>
  );
};

export const SecondaryButton = ({
  prefix,
  children,
  onClick,
}: {
  prefix?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="text-white flex items-center justify-center   bg-blue-600 hover:bg-blue-700  rounded-lg px-4 py-2 md:text-normal md:px-4 md:py-2 font-semibold"
    >
      <div>{prefix}</div>
      <div>{children}</div>
    </button>
  );
};

export const TertiaryButton = ({
  prefix,
  children,
  onClick,
}: {
  prefix?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="text-xl  px-8 py-2 active:bg-blue-700 active:hover:bg-blue-800 rounded-md  bg-white bg-opacity-10 hover:bg-opacity-20  "
    >
      <div>{prefix}</div>
      <div>{children}</div>
    </button>
  );
};

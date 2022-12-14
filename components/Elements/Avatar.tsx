import { FunctionComponent } from "react";

interface AvatarProps {
  username?: string | null;
  className?: string;
  url: string | null | undefined;
}

const Avatar: FunctionComponent<AvatarProps> = ({
  username,
  className,
  url,
}) => {
  const firstLetter = username?.split("");
  if (url) {
    return (
      <>
        <img
          className={`inline-block rounded-full h-8 w-8 ${className}`}
          src={url}
          alt=""
        />
      </>
    );
  }
  return (
    <span
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500 ${className}`}
    >
      <span className={`font-medium leading-none text-white`}>
        {firstLetter ? firstLetter[0] : ":)"}
      </span>
    </span>
  );
};

export default Avatar;

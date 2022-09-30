import { FunctionComponent } from "react";

interface AvatarProps {
  username?: string | null;
  className?: string;
  url: string | null;
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
        <img className="inline-block h-16 w-16 rounded-full" src={url} alt="" />
      </>
    );
  }
  return (
    <span className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gray-500">
      <span
        className={`text-sm font-medium leading-none text-white ${className}`}
      >
        {firstLetter ? firstLetter[0] : ":)"}
      </span>
    </span>
  );
};

export default Avatar;

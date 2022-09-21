import { FunctionComponent } from "react";

interface AvatarProps {
  username?: string | null;
  className?: string;
}

const Avatar: FunctionComponent<AvatarProps> = ({ username, className }) => {
  const firstLetter = username?.split("");
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
      <span
        className={`text-sm font-medium leading-none text-white ${className}`}
      >
        {firstLetter ? firstLetter[0] : ":)"}
      </span>
    </span>
  );
};

export default Avatar;

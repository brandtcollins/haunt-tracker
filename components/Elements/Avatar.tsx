import { FunctionComponent } from "react";

interface AvatarProps {}

const Avatar: FunctionComponent<AvatarProps> = () => {
  return (
    <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-500">
      <span className="text-sm font-medium leading-none text-white">BC</span>
    </span>
  );
};

export default Avatar;

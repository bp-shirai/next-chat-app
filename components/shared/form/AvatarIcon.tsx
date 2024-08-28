import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import React from "react";

type Props = {
  imageUrl: string;
  username?: string;
};

const AvatarIcon = ({ imageUrl, username }: Props) => {
  return (
    <Avatar className="w-8 h-8">
      <AvatarImage src={imageUrl} />
      <AvatarFallback>{username?.substring(0, 1)}</AvatarFallback>
    </Avatar>
  );
};

export { AvatarIcon };

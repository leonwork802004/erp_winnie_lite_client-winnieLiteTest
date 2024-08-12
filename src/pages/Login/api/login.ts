import { useMutation } from "@tanstack/react-query";
import { JwtAuthSchema, jwtAuthSchema } from "@appTypes/auth";
import axios from "@lib/axios";
import { MD5 } from "../utils/md5";
import { FetchLoginPayload, LoginType } from "./type";

const fetchLogin = async ({
  option,
  acc,
  pwd,
}: FetchLoginPayload): Promise<JwtAuthSchema> => {
  let newPwd;
  if (option === LoginType.Ad) {
    newPwd = pwd;
  } else {
    newPwd = MD5(pwd);
  }

  const { data } = await axios.post(`/auth${option}`, {
    Acc: acc,
    Pvvd: newPwd,
  });

  return jwtAuthSchema.parse(data);
};

export const useLoginMutation = () =>
  useMutation({
    mutationFn: fetchLogin,
  });

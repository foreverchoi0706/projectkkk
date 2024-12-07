import user from "@/queryKeys/user.ts";
import axiosInstance from "@/utils/axiosInstance.ts";
import type { TError } from "@/utils/types.ts";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const useLike = (initialLiked: boolean, id?: number) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState<boolean>(initialLiked);

  const likeMutation = useMutation<unknown, TError>({
    mutationFn: () => axiosInstance.post(`/wishList/add?productId=${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries(user.products.wish()).then(() => setIsLiked(!isLiked)),
    onError: ({ responseMessage }) => {
      alert(responseMessage);
      navigate("/signin");
    },
  });

  const unlikeMutation = useMutation<unknown, TError>({
    mutationFn: () => axiosInstance.delete(`/wishList/remove?productId=${id}`),
    onSuccess: () =>
      queryClient.invalidateQueries(user.products.wish()).then(() => setIsLiked(!isLiked)),
    onError: ({ responseMessage }) => {
      alert(responseMessage);
      navigate("/signin");
    },
  });

  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  return { isLiked, likeMutation, unlikeMutation };
};

export default useLike;

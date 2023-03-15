import { useMutation } from '@tanstack/react-query';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../@hooks/useAuth';
import { FormButton } from "../../@ui/button";
import Dialog, { DIALOG_TRANSITION_DURATION } from "../../@ui/dialog";
import { DialogHeader } from "../../@ui/dialog/dialogHeader";
import { Input } from "../../@ui/input";
import api, { SignupArgs } from '../../data-access';

const SignUpPage: React.FC = () => {
  let navigate = useNavigate();

  const { register, handleSubmit } = useForm<SignupArgs>();

  const [openDialog, setOpenDialog] = useState(false);

  const { refetch } = useAuth();

  const { mutate, isLoading } = useMutation(api.signup, {
    onSuccess: () => refetch(),
    onError: (err) => console.log('something went wrong', err),
  });

  useEffect(() => {
    setOpenDialog(true);
  }, []);

  function closeDialog() {
    setOpenDialog(false);
    setTimeout(() => {
      navigate(-1);
    }, DIALOG_TRANSITION_DURATION);
  }

  return (
    <Dialog aria-labelledby="label" close={closeDialog} open={openDialog}>
      <DialogHeader close={closeDialog}>Sign Up</DialogHeader>
      <form onSubmit={handleSubmit(data => mutate(data))}>
        <Input
          placeholder="Email"
          register={register}
          name="email"
          type="email"
        />
        <Input placeholder="Username" register={register} name="username" />
        <Input
          placeholder="Password"
          register={register}
          name="password"
          type="password"
        />
        <FormButton loading={isLoading}>Submit</FormButton>
      </form>
    </Dialog>
  );
};

export default SignUpPage;

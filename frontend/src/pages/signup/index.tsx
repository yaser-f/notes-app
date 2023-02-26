import React, { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormButton } from "../../@ui/button";
import Dialog, { DIALOG_TRANSITION_DURATION } from "../../@ui/dialog";
import { DialogHeader } from "../../@ui/dialog/dialogHeader";
import { Input } from "../../@ui/input";
import {
  useSignUpMutation,
  SignUpMutationVariables,
  useCurrentUserQuery,
} from "../../gql/generated/graphql";

const SignUpPage: React.FC = () => {
  let navigate = useNavigate();

  const { register, handleSubmit } = useForm<SignUpMutationVariables>();

  const [openDialog, setOpenDialog] = useState(false);

  const [signUp, { loading }] = useSignUpMutation();

  const { data, refetch, loading: loading2 } = useCurrentUserQuery();

  useEffect(() => {
    if (!loading && data?.currentUser) {
      // logged in
      navigate("/notes");
    }
  }, [data, loading, navigate]);

  useEffect(() => {
    setOpenDialog(true);
  }, []);

  function closeDialog() {
    setOpenDialog(false);
    setTimeout(() => {
      navigate(-1);
    }, DIALOG_TRANSITION_DURATION);
  }

  const onSubmit: SubmitHandler<SignUpMutationVariables> = async (
    variables
  ) => {
    await signUp({
      variables,
    })
      .then(({ data }) => {
        if (data?.signUp) {
          refetch();
        } else {
          console.log("something went wrong");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Dialog aria-labelledby="label" close={closeDialog} open={openDialog}>
      <DialogHeader close={closeDialog}>Sign Up</DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <FormButton loading={loading || loading2}>Submit</FormButton>
      </form>
    </Dialog>
  );
};

export default SignUpPage;

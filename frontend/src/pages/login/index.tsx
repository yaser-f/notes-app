import React, { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FormButton } from "../../@ui/button";
import Dialog, { DIALOG_TRANSITION_DURATION } from "../../@ui/dialog";
import { DialogHeader } from "../../@ui/dialog/dialogHeader";
import { Input } from "../../@ui/input";
import {
  LoginMutationVariables,
  useCurrentUserQuery,
  useLoginMutation,
} from "../../gql/generated/graphql";

const LoginPage: React.FC = () => {
  let navigate = useNavigate();

  const [openDialog, setOpenDialog] = useState(false);

  const { register, handleSubmit } = useForm<LoginMutationVariables>();

  const [login, { loading }] = useLoginMutation();

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

  const onSubmit: SubmitHandler<LoginMutationVariables> = async (variables) => {
    await login({
      variables,
    })
      .then(({ data }) => {
        if (data?.login) {
          refetch();
        } else {
          console.log("something went wrong");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <Dialog aria-labelledby="label" close={closeDialog} open={openDialog}>
      <DialogHeader close={closeDialog}>login</DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
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

export default LoginPage;

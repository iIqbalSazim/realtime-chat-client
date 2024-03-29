import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { loginSuccess } from "../../../../Stores/Actions/auth";
import { LoginFormValidationSchema } from "../../../Login/Validation/LoginValidation";
import { createNewUser } from "../../Api/RegistrationMethods";

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const defaultValues = useState({
    username: "",
    password: "",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const onSubmit = async (user) => {
    const response = await createNewUser(user);

    if (response) {
      const newUser = {
        id: response.data.id,
        username: response.data.username,
      };
      const token = response.data.token;

      localStorage.setItem("token", token);

      dispatch(loginSuccess(newUser));

      alert("Signed Up Successfully");

      navigate(`/${newUser.id}`);
    }

    reset({ ...defaultValues });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 items-center justify-center w-[500px] px-10 py-12 border border-slate-200"
    >
      <h1 className="font-medium text-lg mb-5">REGISTER</h1>

      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Username</span>
        </label>

        <input
          type="text"
          placeholder="Your username"
          className="input input-bordered w-full max-w-xs"
          {...register("username", {
            ...LoginFormValidationSchema.validateUsername,
          })}
        />
        {errors.username && (
          <p className="text-red-500 text-xs my-1">{errors.username.message}</p>
        )}
      </div>

      <div className="form-control w-full max-w-xs">
        <label className="label">
          <span className="label-text">Password</span>
        </label>

        <input
          type="password"
          placeholder="Your password"
          className="input input-bordered w-full max-w-xs"
          {...register("password", {
            ...LoginFormValidationSchema.validatePassword,
          })}
        />
        {errors.password && (
          <p className="text-red-500 text-xs my-1">{errors.password.message}</p>
        )}
      </div>

      <button
        className="btn btn-md btn-secondary font-semibold mt-5"
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};

export default RegistrationForm;

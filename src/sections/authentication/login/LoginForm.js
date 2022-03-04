import * as Yup from "yup";
import { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { useFormik, Form, FormikProvider } from "formik";
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
// component
import Iconify from "../../../components/Iconify";
import swal from "sweetalert";

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Địa chỉ emmail phải là địa chỉ email hợp lệ")
      .required("Email không được trống"),
    password: Yup.string().required("Password không được trống"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: true,
    },
    validationSchema: LoginSchema,
    onSubmit: (e) => {
      
      const {values} = formik;
      const {email,password} = values;
     
      if (email !== "admin@gmail.com" || password !== "admin") {
        swal("Lỗi!", "Sai tài khoản hoặc mật khẩu", "error");
        formik.isSubmitting=false;
        return;
      }else{
        navigate("/dashboard", { replace: true });
        localStorage.setItem("username", email);
      }

      
    },
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } =
    formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            label="Địa chỉ email"
            {...getFieldProps("email")}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? "text" : "password"}
            label="Mật khẩu"
            {...getFieldProps("password")}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Iconify
                      icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                    />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        >
          <FormControlLabel
            control={
              <Checkbox
                {...getFieldProps("remember")}
                checked={values.remember}
              />
            }
            label="Ghi nhớ"
          />

          {/* <Link component={RouterLink} variant="subtitle2" to="#" underline="hover">
            Forgot password?
          </Link> */}
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          // loading={isSubmitting}
        >
          Đăng nhập
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}

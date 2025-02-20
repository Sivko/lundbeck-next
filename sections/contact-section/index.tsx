"use client";

import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { TextField, Button, Typography, Box } from "@mui/material";
import PhoneInput from "react-phone-input-2";
import SuccessMsg from "@/components/result-message/SuccessMsg";
import ErrorSend from "@/components/result-message/ErrorSend";
import { IContactsFormData } from "@/types/contacts-types";
import 'react-phone-input-2/lib/style.css'

const ContactForm: React.FC = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<IContactsFormData>();

  const [statusResponse, setStatusResponse] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState(false)


  const onSubmit = async (data: IContactsFormData) => {
    setIsLoading(true)
    try {
      const formData = new FormData();

      // Заполняем FormData
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof FileList) {
          Array.from(value).forEach(file => formData.append(key, file));
        } else {
          formData.append(key, value as string);
        }
      });

      const response = await fetch('/api/form-contact-processing', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      console.log(response)

      setStatusResponse(true);
    } catch (error) {
      console.error('Error:', error);
      setStatusResponse(false);
    }
    setIsLoading(false)
  };


  if (statusResponse === true) return <SuccessMsg />
  if (statusResponse === false) return <ErrorSend />

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ maxWidth: 400, mx: "auto", p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
      <Typography variant="h6">Контактная форма</Typography>

      <TextField
        label="Имя *"
        {...register("firstName", { required: "Это поле обязательно" })}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
        fullWidth
      />

      <TextField
        label="Фамилия или название организации"
        {...register("companyName")}
        fullWidth
      />

      <TextField
        label="E-mail *"
        type="email"
        {...register("email", {
          required: "Это поле обязательно",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Введите корректный email"
          }
        })}
        error={!!errors.email}
        helperText={errors.email?.message}
        fullWidth
      />

      <Controller
        name="phone"
        control={control}
        render={({ field }) => (
          <PhoneInput
            {...field}
            country={"ru"}
            inputStyle={{ width: "100%" }}
            specialLabel="Телефон"
          />
        )}
      />

      <TextField
        label="Ваше сообщение *"
        multiline
        rows={4}
        {...register("message", { required: "Это поле обязательно" })}
        error={!!errors.message}
        helperText={errors.message?.message}
        fullWidth
      />

      <Controller
        name="file"
        control={control}
        render={({ field }) => (
          <input
            type="file"
            onChange={(e) => field.onChange(e.target.files)}
          />
        )}
      />

      <Button type={isLoading ? "button" : "submit"} disabled={isLoading} variant="contained" color="primary">
        {isLoading ? "Отправка..." : "Отправить"}
      </Button>
    </Box>
  );
};

export default ContactForm;

import { Box, Checkbox, FormControlLabel, FormLabel, MenuItem, Radio, RadioGroup, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import Select from "react-select"
import { dataCountries } from "@/data/data-countries";
import PhoneInput from 'react-phone-input-2'
import { useEffect } from "react";

import 'react-phone-input-2/lib/style.css'

interface FormData {
  isCommunication: string; // Даете ли Вы согласие на то, чтобы сотрудник компании Лундбек связался с вами, используя информацию из этой формы, если это необходимо?
  contactMethod: "email" | "phone"; // Способ связи
  phone: string; // Телефон
  email: string; // Email
  isPatient: string; // Я - пациент
  agent: string; // Связь с пациентом
  country: object; // Страна
  isLundbeckDrugPurchase: string; // Препарат компании Лундбек был приобретен в той же стране, где возник побочный эффект?
  sideEffectCountry: object; // Страна, в которой возник побочный эффект
  personalDataCheck: boolean; // Согласие на обработку персональных данных
}

export const Step1: React.FC = () => {
  const { control, watch, unregister, setValue } = useFormContext<FormData>();
  const isCommunication = watch("isCommunication");
  const isPatient = watch("isPatient");
  const contactMethod = watch("contactMethod");
  const isLundbeckDrugPurchase = watch("isLundbeckDrugPurchase");


  useEffect(() => {
    setValue("country", { label: "Россия", value: "Россия" })
  }, [])

  useEffect(() => {
    if (isCommunication === "Нет") {
      unregister("contactMethod")
      unregister("phone")
      unregister("email")
    }
  }, [isCommunication])

  useEffect(() => {
    if (contactMethod === "phone")
      unregister("email")
    if (contactMethod === "email")
      unregister("phone")
  }, [contactMethod])

  useEffect(() => {
    if (isPatient === "Да") {
      unregister("agent");
    }
  }, [isPatient, unregister]);

  useEffect(() => {
    if (isCommunication === "Нет") {
      unregister("contactMethod");
    }
  }, [isCommunication, unregister]);

  useEffect(() => {
    if (isLundbeckDrugPurchase === "Да") {
      unregister("sideEffectCountry");
    }
    if (isLundbeckDrugPurchase === "Нет") {
      setValue("sideEffectCountry", { "value": "Россия", "label": "Россия" });
    }
  }, [isLundbeckDrugPurchase, unregister]);

  return (
    <Box>
      <div className="flex flex-col gap-4">
        <Controller
          name="isCommunication"
          control={control}
          rules={{ required: "Выберите вариант" }}
          render={({ field, fieldState }) => (
            <>
              <FormLabel error={!!fieldState.error} id="isCommunication">Даете ли Вы согласие на то, чтобы сотрудник компании Лундбек связался с вами, используя информацию из этой формы, если это необходимо? *</FormLabel>
              <RadioGroup name="isCommunication">
                <FormControlLabel {...field} value="Да" control={<Radio checked={isCommunication === "Да"} />} label="Да" />
                <FormControlLabel {...field} value="Нет" control={<Radio checked={isCommunication === "Нет"} />} label="Нет" />
              </RadioGroup>
              {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>}
            </>
          )}
        />
        {isCommunication === "Да" && <>
          <Controller
            name="contactMethod"
            control={control}
            rules={{ required: "Выберите способ связи" }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Укажите предпочтительный способ связи"
                fullWidth
                margin="normal"
                error={!!fieldState.error}
              // helperText={fieldState.error?.message}
              >
                <MenuItem value="email">Email</MenuItem>
                <MenuItem value="phone">Телефон</MenuItem>
              </TextField>
            )}
          />
          {contactMethod === "email" && isCommunication === "Да" && <Controller
            name="email"
            control={control}
            rules={{
              required: contactMethod === "email" ? "Заполните email" : false,
              pattern: contactMethod === "email" ? {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Введите корректный email"
              } : undefined,
            }}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                fullWidth
                margin="normal"
                error={!!fieldState.error}
                label="Email"
                helperText={fieldState.error?.message}
              />
            )}
          />}
          {contactMethod === "phone" && isCommunication === "Да" && <Controller
            name="phone"
            control={control}
            rules={{ required: "Заполните телефон" }}
            render={({ field, fieldState }) => (
              <>
                <PhoneInput
                  inputStyle={{ width: "100%", height: "60px" }}
                  country={"ru"}
                  {...field}
                />
                {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>}
              </>
            )}
          />}
        </>}


        <Controller
          name="isPatient"
          control={control}
          rules={{ required: "Выберите вариант" }}
          render={({ field, fieldState }) => (
            <>
              <FormLabel error={!!fieldState.error} id="isPatient">Вы – пациент, у которого развился побочный эффект? *</FormLabel>
              <RadioGroup name="isPatient">
                <FormControlLabel {...field} value="Да" control={<Radio checked={isPatient === "Да"} />} label="Да" />
                <FormControlLabel {...field} value="Нет" control={<Radio checked={isPatient === "Нет"} />} label="Нет" />
              </RadioGroup>
              {/* {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>} */}
            </>
          )}
        />

        {isPatient === "Нет" && <>
          <Controller
            name="agent"
            control={control}
            rules={{ required: "Выберите вариант" }}
            render={({ field, fieldState }) => (
              <>
                <FormLabel error={!!fieldState.error} id="agent">Связь с пациентом</FormLabel>
                <RadioGroup name="agent">
                  <FormControlLabel {...field} value="Я родственник/друг, действующий от лица пациента" control={<Radio />} label="Я родственник/друг, действующий от лица пациента" />
                  <FormControlLabel {...field} value="Я специалист в области здравоохранения, сообщающий о побочном эффекте" control={<Radio />} label="Я специалист в области здравоохранения, сообщающий о побочном эффекте" />
                  <FormControlLabel {...field} value="Ничто из перечисленного" control={<Radio />} label="Ничто из перечисленного" />
                </RadioGroup>
                {/* {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>} */}
              </>
            )}
          />
        </>}

        <Controller
          name="country"
          control={control}
          rules={{ required: "Выберите вариант" }}
          render={({ field, fieldState }) => (
            <>
              <FormLabel error={!!fieldState.error} id="country">В какой стране отмечался побочный эффект? *</FormLabel>
              <Select
                {...field}
                defaultValue={{ "value": "Россия", "label": "Россия" }}
                options={dataCountries.map((country) => ({ value: country, label: country }))}
              />
            </>
          )}
        />

        <Controller
          name="isLundbeckDrugPurchase"
          control={control}
          render={({ field, fieldState }) => (
            <>
              <FormLabel error={!!fieldState.error} id="isLundbeckDrugPurchase">Препарат компании Лундбек был приобретен в той же стране, где возник побочный эффект?</FormLabel>
              <RadioGroup name="">
                <FormControlLabel {...field} value="Да" control={<Radio checked={isLundbeckDrugPurchase === "Да"} />} label="Да" />
                <FormControlLabel {...field} value="Нет" control={<Radio checked={isLundbeckDrugPurchase === "Нет"} />} label="Нет" />
              </RadioGroup>
              {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>}
            </>
          )}
        />

        {isLundbeckDrugPurchase === "Нет" && <Controller
          name="sideEffectCountry"
          control={control}
          rules={{ required: "Выберите вариант" }}
          render={({ field, fieldState }) => (
            <>
              <FormLabel error={!!fieldState.error} id="sideEffectCountry">В какой стране отмечался побочный эффект? *</FormLabel>
              <Select
                {...field}
                defaultValue={{ "value": "Россия", "label": "Россия" }}
                options={dataCountries.map((country) => ({ value: country, label: country }))}
              />
            </>
          )}
        />}

        <Controller
          name="personalDataCheck"
          rules={{ required: "Подтвердите согласие" }}
          control={control}
          render={({ field, fieldState }) => (
            <>
              <FormControlLabel className="md:w-2/3" {...field} control={<Checkbox checked={field.value} />} label={(<div>
                Даю&nbsp;<a href="/Consent_Pharmacovigilance_2.pdf" target="_blank" className="text-blue-500 underline">согласие на обработку своих персональных данных</a>&nbsp;в соответствии с&nbsp;
                <a href="/DPA_pol_3.pdf" target="_blank" className="text-blue-500 underline">Политикой конфиденциальности Представительства компании «Лундбек Экспорт А/С»</a>
              </div>)} />
              {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>}
            </>
          )}
        />

      </div>
    </Box>
  );
};

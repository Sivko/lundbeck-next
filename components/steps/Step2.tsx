import { Box, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

import { useEffect } from "react";


interface FormData {
  gender: string; // Пол
  isPregnant: string; // Беременность
  dateOfBirth: string | null; // Дата родов
  weekOfBirth: number | null; // Неделя родов
  description: string; // Любая доступная информацию о результате или текущем статусе беременности
  age: number | string; // Возраст
}

export const Step2: React.FC = () => {
  const { control, watch, unregister } = useFormContext<FormData>();

  const gender = watch("gender");
  const isPregnant = watch("isPregnant");

  useEffect(() => {
    if (gender !== "Женский") {
      unregister("isPregnant");
      unregister("dateOfBirth");
      unregister("weekOfBirth");
      unregister("description");
      unregister("age");
    }
  }, [gender, unregister]);

  useEffect(() => {
    if (isPregnant !== "Да") {
      unregister("dateOfBirth");
      unregister("weekOfBirth");
      unregister("description");
    }
  }, [isPregnant, unregister]);



  return (
    <Box>
      <h1 className="text-3xl font-thin">У кого произошел побочный эффект?</h1>
      <Controller
        name="gender"
        control={control}
        rules={{ required: "Выберите вариант" }}
        render={({ field, fieldState }) => (
          <>
            <FormLabel error={!!fieldState.error} id="gender">Пол пациента *</FormLabel>
            <RadioGroup name="gender">
              <FormControlLabel {...field} value="Женский" control={<Radio checked={gender === "Женский"} />} label="Женский" />
              <FormControlLabel {...field} value="Мужской" control={<Radio checked={gender === "Мужской"} />} label="Мужской" />
              <FormControlLabel {...field} value="Не определен" control={<Radio checked={gender === "Не определен"} />} label="Не определен" />
            </RadioGroup>
            {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>}
          </>
        )}
      />

      {gender === "Женский" && <Controller
        name="isPregnant"
        control={control}
        rules={{ required: "Выберите вариант" }}
        render={({ field, fieldState }) => (
          <>
            <FormLabel error={!!fieldState.error} id="isPregnant">Была ли пациентка беременна во время лечения препаратом Лундбек?</FormLabel>
            <RadioGroup name="isPregnant">
              <FormControlLabel {...field} value="Да" control={<Radio checked={isPregnant === "Да"} />} label="Да" />
              <FormControlLabel {...field} value="Нет" control={<Radio checked={isPregnant === "Нет"} />} label="Нет" />
            </RadioGroup>
            {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>}
          </>
        )}
      />}

      {isPregnant === "Да" && gender === "Женский" && (
        <>
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field }) => (
              <>
                {/* <FormLabel error={!!fieldState.error} id="dateOfBirth">Дата родов (ожидаемая или фактическая)</FormLabel> */}
                <div className="flex mt-4 max-md:flex-col gap-2 items-center">
                  {/* <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                    <DatePicker
                      {...field}
                      className="md:max-w-[400px] w-full"
                      label="Дата родов (ожидаемая или фактическая)"
                      onChange={(date) => field.onChange(date)} // обязательно для работы react-hook-form
                    />
                  </LocalizationProvider> */}
                  <TextField
                    {...field}
                    label="Дата родов (ожидаемая или фактическая)"
                    placeholder="DD-MM-YYYY"
                    fullWidth
                    margin="normal"
                  />
                  <span>или</span>
                  <Controller
                    name="weekOfBirth"
                    control={control}
                    render={({ field, fieldState }) => (
                      <TextField
                        {...field}
                        type="number"
                        className="md:max-w-[400px] w-full"
                        label="Число недель/месяцев беременности"
                        fullWidth
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message}
                      />
                    )}
                  />
                </div>
              </>
            )}
          />
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextareaAutosize
                {...field}
                className="max-w-[400px] w-full mt-4 p-4 border rounded"
                aria-label="minimum height"
                minRows={3}
                placeholder="Пожалуйста, добавьте любую доступную информацию о результате или текущем статусе беременности."
              />
            )}
          />

        </>)
      }
      <Controller
        name="age"
        control={control}
        rules={{
          validate: (value) => {
            if (value === undefined || value === "" || value === null) {
              return true; // Поле необязательно, пропускаем валидацию
            }
            if (Number(value) < 1) {
              return "Возраст должен быть больше 0";
            }
            if (Number(value) > 120) {
              return "Возраст должен быть меньше 120";
            }
            return true; // Все проверки пройдены
          },
        }}
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            type="number"
            margin="normal"
            label="Возраст пациента (полных лет)"
            fullWidth
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
          />
        )}
      />
    </Box>
  );
};
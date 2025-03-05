import React, { useEffect } from "react";
import { Box, FormLabel, Button, TextareaAutosize, RadioGroup, FormControlLabel, Radio, TextField } from "@mui/material";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3/AdapterDateFnsV3";
// import { ru } from "date-fns/locale/ru";

interface FormData {
  ateMedicine: string; // Принимал ли пациент другие препараты
  anyDrugs: {
    name: string; // Укажите название другого препарата, который принимал пациент
    reason: string; // Укажите показание, по которому был назначен препарат Лундбек (причина назначения)
    dose: string; // Ежедневная доза препарата (по возможности укажите единицы измерения)
    dateStart: string | null; // Дата начала приема препарата
    isContinue: string; // Продолжается ли прием препарата на сегодняшний день?
    additionalDrugs: string; // Принимал ли пациент дополнительный препарат, когда отмечался побочный эффект?
    dateEnd: string | null; // Когда был прекращен прием препарата?
  }[];
}

export const Step5: React.FC = () => {
  const { control, watch, unregister } = useFormContext<FormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "anyDrugs",
  });

  const ateMedicine = watch("ateMedicine");


  useEffect(() => {
    if (ateMedicine !== "Да") {
      unregister("anyDrugs");
    }
  }, [ateMedicine, unregister]);

  useEffect(() => {
    if (fields.length === 0) {
      append({ name: "", reason: "", dose: "", dateStart: null, isContinue: "", dateEnd: null, additionalDrugs: "" }); // Добавляем первый обязательный элемент
    }
  }, []);


  return (
    <Box>
      <h1 className="text-3xl font-thin">Принимал ли пациент другие препараты (не Лундбек)?</h1>

      <Controller
        name={`ateMedicine`}
        control={control}
        render={({ field, fieldState }) => (
          <div className="mt-4">
            <FormLabel error={!!fieldState.error} id="periodicity">Принимал ли пациент другие препараты (не Лундбек) в момент возникновения побочного эффекта?</FormLabel>
            <RadioGroup name="periodicity" className="mt-2">
              <FormControlLabel {...field} control={<Radio checked={field.value === "Да"} style={{ padding: "0 8px 0 8px" }} />} label="Да" value="Да" />
              <FormControlLabel {...field} control={<Radio checked={field.value === "Нет, пациент не принимал других препаратов"} style={{ padding: "0 8px 0 8px" }} />} label="Нет, пациент не принимал других препаратов" value="Нет, пациент не принимал других препаратов" />
              <FormControlLabel {...field} control={<Radio checked={field.value === "Я не буду указывать эту информацию"} style={{ padding: "0 8px 0 8px" }} />} label="Я не буду указывать эту информацию" value="Я не буду указывать эту информацию" />
            </RadioGroup>
            {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>}
          </div>
        )}
      />

      {ateMedicine === "Да" && <Controller
        name={`anyDrugs`}
        control={control}
        render={({ }) => (
          <div className="mt-4">
            {fields.map((item, index) => (
              <Box key={item.id} className="mt-4 border p-2 rounded grid grid-cols-2 gap-4">
                <Controller
                  name={`anyDrugs.${index}.name`}
                  control={control}
                  // rules={{ required: "Укажите название другого препарата (не Лундбек), который принимал пациент во время возникновения побочного эффекта" }}
                  render={({ field }) => (
                    <>
                      <TextareaAutosize
                        {...field}
                        className=" w-full p-4 border rounded"
                        aria-label="minimum height"
                        minRows={3}
                        placeholder="Укажите название другого препарата, который принимал пациент во время возникновения побочного эффекта"
                      />
                    </>
                  )}
                />
                <Controller
                  name={`anyDrugs.${index}.reason`}
                  control={control}
                  // rules={{ required: "Укажите показание, по которому был назначен этот препарат (причина назначения)" }}
                  render={({ field }) => (
                    <>
                      <TextareaAutosize
                        {...field}
                        className=" w-full p-4 border rounded"
                        aria-label="minimum height"
                        minRows={3}
                        placeholder="Укажите показание, по которому был назначен препарат Лундбек (причина назначения)"
                      />
                    </>
                  )}
                />
                <Controller
                  name={`anyDrugs.${index}.dose`}
                  control={control}
                  render={({ field, fieldState }) => (

                    <TextField
                      {...field}
                      type="string"
                      className=" w-full"
                      label="Ежедневная доза препарата (по возможности укажите единицы измерения)"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  name={`anyDrugs.${index}.dateStart`}
                  control={control}
                  render={({ field }) => (
                    <>
                      {/* <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                        <DatePicker
                          {...field}
                          className=" w-full"
                          label="Дата начала приема препарата"
                          onChange={(date) => field.onChange(date)} // обязательно для работы react-hook-form
                        />
                      </LocalizationProvider> */}
                      <TextField
                        {...field}
                        label="Дата начала приема препарата"
                        placeholder="ДД.ММ.ГГГГ"
                        fullWidth
                      />
                    </>
                  )}
                />

                <Controller
                  name={`anyDrugs.${index}.isContinue`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="">
                      <FormLabel error={!!fieldState.error} id="isContinue">Продолжается ли прием препарата на сегодняшний день?</FormLabel>
                      <RadioGroup name="isContinue" className="">
                        <FormControlLabel {...field} control={<Radio checked={field.value === "Да"} style={{ padding: "0 8px 0 8px" }} />} label="Да" value="Да" />
                        <FormControlLabel {...field} control={<Radio checked={field.value === "Нет"} style={{ padding: "0 8px 0 8px" }} />} label="Нет" value="Нет" />
                      </RadioGroup>
                      {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>}
                    </div>
                  )}
                />
                <Controller
                  name={`anyDrugs.${index}.additionalDrugs`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="">
                      <FormLabel error={!!fieldState.error} id="additionalDrugs">Принимал ли пациент дополнительный препарат, когда отмечался побочный эффект?</FormLabel>
                      <RadioGroup name="additionalDrugs" className="">
                        <FormControlLabel {...field} control={<Radio checked={field.value === "Да"} style={{ padding: "0 8px 0 8px" }} />} label="Да" value="Да" />
                        <FormControlLabel {...field} control={<Radio checked={field.value === "Нет"} style={{ padding: "0 8px 0 8px" }} />} label="Нет" value="Нет" />
                      </RadioGroup>
                      {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>}
                    </div>
                  )}
                />

                <Controller
                  name={`anyDrugs.${index}.dateEnd`}
                  control={control}
                  render={({ field }) => (
                    <>
                      {/* <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                        <DatePicker
                          {...field}
                          className=" w-full"
                          label="Когда был прекращен прием препарата?"
                          onChange={(date) => field.onChange(date)} // обязательно для работы react-hook-form
                        />
                      </LocalizationProvider> */}
                      <TextField
                        {...field}
                        label="Когда был прекращен прием препарата?"
                        placeholder="ДД.ММ.ГГГГ"
                        fullWidth
                      />
                    </>
                  )}
                />


                {index !== 0 && ( // Кнопка удаления недоступна для первого элемента
                  <div className="">
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => remove(index)}
                    >
                      Удалить
                    </Button>
                  </div>
                )}

              </Box>
            ))}
          </div>
        )}
      />}

      {ateMedicine === "Да" && <Button
        variant="contained"
        color="primary"
        onClick={() => append({ name: "", reason: "", dose: "", dateStart: null, isContinue: "", dateEnd: null, additionalDrugs: "" })}
        style={{ marginTop: "20px" }}
      >
        Добавить побочный эффект
      </Button>}
    </Box>
  );
};
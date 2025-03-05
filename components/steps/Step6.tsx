import React, { useEffect } from "react";
import { Box, FormLabel, Button, TextareaAutosize, RadioGroup, FormControlLabel, Radio, TextField } from "@mui/material";
import { useFormContext, Controller, useFieldArray } from "react-hook-form";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3/AdapterDateFnsV3";
// import { ru } from "date-fns/locale/ru";

interface FormData {
  disease: string // Хотели бы вы сообщить о каких-либо других заболеваниях/состояниях на момент возникновения побочного эффекта
  diseasesItems: {
    name: string; // Другое заболевание/состояние
    dateStart: string | null; // Дата начала другого заболевания/состояния
    status: string; // Статус другого заболевания/состояния
    isTreatment: string; // Проводилось ли какое-либо лечение заболевания/состояния
    treatmentDescription: string; // Если лечение проводилось, опишите его
  }[]
}

export const Step6: React.FC = () => {
  const { control, watch, unregister } = useFormContext<FormData>();

  const disease = watch("disease");
  const { fields, append, remove } = useFieldArray({
    control,
    name: "diseasesItems",
  });

  useEffect(() => {
    if (disease !== "Да") {
      unregister("diseasesItems");
    }
  }, [disease, unregister]);

  useEffect(() => {
    if (fields.length === 0) {
      append({ name: "", dateStart: null, status: "", isTreatment: "", treatmentDescription: "" }); // Добавляем первый обязательный элемент
    }
  }, []);

  return (
    <Box>
      <h1 className="text-3xl font-thin">Были ли у пациента какие-либо другие заболевания/состояния?</h1>



      <Controller
        name={`disease`}
        control={control}
        render={({ field, fieldState }) => (
          <div className="">
            <FormLabel error={!!fieldState.error} id="isContinue">Хотели бы вы сообщить о каких-либо других заболеваниях/состояниях на момент возникновения побочного эффекта?</FormLabel>
            <RadioGroup name="isContinue" className="">
              <FormControlLabel {...field} control={<Radio checked={disease === "Да"} style={{ padding: "0 8px 0 8px" }} />} label="Да" value="Да" />
              <FormControlLabel {...field} control={<Radio checked={disease === "Нет, у пациента не было других заболеваний/состояний"} style={{ padding: "0 8px 0 8px" }} />} label="Нет, у пациента не было других заболеваний/состояний" value="Нет, у пациента не было других заболеваний/состояний" />
              <FormControlLabel {...field} control={<Radio checked={disease === "Нет, я не хочу предоставлять эту информацию"} style={{ padding: "0 8px 0 8px" }} />} label="Нет, я не хочу предоставлять эту информацию" value="Нет, я не хочу предоставлять эту информацию" />
            </RadioGroup>
            {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>}
          </div>
        )}
      />

      {disease === "Да" && <Controller
        name={`diseasesItems`}
        control={control}
        render={() => (
          <div className="mt-4">
            {fields?.map((item, index) => (
              <Box key={item.id} className="mt-4 border p-2 rounded grid grid-cols-2 gap-4">
                <Controller
                  name={`diseasesItems.${index}.name`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      type="string"
                      className=" w-full"
                      label="Другое заболевание/состояние"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                    />
                  )}
                />

                <Controller
                  name={`diseasesItems.${index}.dateStart`}
                  control={control}
                  render={({ field }) => (
                    <>
                      {/* <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                        <DatePicker
                          {...field}
                          className=" w-full"
                          label="Дата начала другого заболевания/состояния"
                          onChange={(date) => field.onChange(date)} // обязательно для работы react-hook-form
                        />
                      </LocalizationProvider> */}
                      <TextField
                        {...field}
                        label="Дата начала другого заболевания/состояния"
                        placeholder="DD-MM-YYYY"
                        fullWidth
                        margin="normal"
                      />
                    </>
                  )}
                />

                <Controller
                  name={`diseasesItems.${index}.status`}
                  control={control}
                  // rules={{ required: "Укажите показание, по которому был назначен этот препарат (причина назначения)" }}
                  render={({ field }) => (
                    <>
                      <TextareaAutosize
                        {...field}
                        className=" w-full p-4 border rounded"
                        aria-label="minimum height"
                        minRows={3}
                        placeholder="Статус другого заболевания/состояния"
                      />
                    </>
                  )}
                />

                <Controller
                  name={`diseasesItems.${index}.isTreatment`}
                  control={control}
                  render={({ field, fieldState }) => (
                    <div className="">
                      <FormLabel error={!!fieldState.error} id="isContinue">Проводилось ли какое-либо лечение заболевания/состояния?</FormLabel>
                      <RadioGroup name="isContinue" className="">
                        <FormControlLabel {...field} control={<Radio checked={field.value === "Да"} style={{ padding: "0 8px 0 8px" }} />} label="Да" value="Да" />
                        <FormControlLabel {...field} control={<Radio checked={field.value === "Нет"} style={{ padding: "0 8px 0 8px" }} />} label="Нет" value="Нет" />
                      </RadioGroup>
                      {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>}
                    </div>
                  )}
                />

                <Controller
                  name={`diseasesItems.${index}.treatmentDescription`}
                  control={control}
                  // rules={{ required: "Укажите показание, по которому был назначен этот препарат (причина назначения)" }}
                  render={({ field }) => (
                    <>
                      <TextareaAutosize
                        {...field}
                        className=" w-full p-4 border rounded"
                        aria-label="minimum height"
                        minRows={3}
                        placeholder="Если лечение проводилось, опишите его"
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
      {disease === "Да" && <Button
        variant="contained"
        color="primary"
        onClick={() => append({ name: "", dateStart: null, status: "", isTreatment: "", treatmentDescription: "" })}
        style={{ marginTop: "20px" }}
      >
        Добавить заболевание/состояние
      </Button>}
    </Box>
  );
};
import { Box, Button, FormControlLabel, FormLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Select from "react-select"
// import { OptionTypeBase } from 'react-select';

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ru } from "date-fns/locale";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { useEffect } from "react";
import { dataDrugNames } from "@/data/data-drug-names";

interface FormData {
  drugItems: {
    drugName: string; // Название препарата
    drugNumber: string; // Номер препарата
    purposeDrug: string; // Укажите показание, по которому был назначен препарат Лундбек (причина назначения)
    periodicity: string; // Как часто пациент получал препарат Лундбек
    dose: string; // Дозировка
    customPeriodicity: string; // Опишите, как часто принимался препарат Лундбек
    startDate: Date | null; // Когда был начат прием препарата?
    isContinuePurpose: string; // Продолжается ли прием препарата на текущий момент?
    endDate: Date | null; // Когда был прекращен прием препарата?
  }[]
}

export const Step3: React.FC = () => {
  const { control, watch } = useFormContext<FormData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "drugItems",
  });

  const values = watch("drugItems");

  // Добавляем первый элемент по умолчанию, если список пуст
  useEffect(() => {
    if (fields.length === 0) {
      append({ drugName: "", drugNumber: "", purposeDrug: "", periodicity: "", dose: "", customPeriodicity: "", startDate: null, isContinuePurpose: "", endDate: null });
    }
  }, []);

  return (
    <Box>
      <h1 className="text-3xl font-thin">Какой препарат компании Лундбек получал пациент?</h1>
      <p className="opacity-50 ">Пожалуйста укажите только один препарат. Вы сможете добавить информацию по другим препаратам в конце страницы.</p>

      {fields.map((item, index) => (<Box key={index}>
        <div className="flex flex-col gap-3 p-4 border rounded mt-4">
          <Controller
            name={`drugItems.${index}.drugName`}
            control={control}
            rules={{ required: "Выберите вариант" }}
            render={({ field, fieldState }) => (
              <div className="">
                <FormLabel error={!!fieldState.error} id="country">Укажите название препарата Лундбек, который предположительно вызвал побочный эффект *</FormLabel>
                <Select
                  {...field}
                  styles={{
                    // Fixes the overlapping problem of the component
                    input: provided => ({ ...provided, paddingTop: 10, paddingBottom: 10 }),
                    menu: provided => ({ ...provided, zIndex: 9999 }),
                  }}
                  placeholder="Выберите препарат"
                  options={dataDrugNames.map((item) => ({ value: item, label: item }))}
                  onChange={(selectedOption) => field.onChange(selectedOption?.value)}
                  value={field.value ? { value: field.value, label: field.value } : null}
                />
              </div>
            )}
          />

          <Controller
            name={`drugItems.${index}.drugNumber`}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="string"
                className="w-full"
                label="Номер серии препарата"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />


          <div>
            <Controller
              name={`drugItems.${index}.purposeDrug`}
              control={control}
              render={({ field }) => (
                <TextareaAutosize
                  {...field}
                  className="w-full p-4 border rounded"
                  aria-label="minimum height"
                  minRows={3}
                  placeholder="Укажите показание, по которому был назначен препарат Лундбек (причина назначения)"
                />
              )}
            />
          </div>

          <Controller
            name={`drugItems.${index}.periodicity`}
            control={control}
            render={({ field, fieldState }) => (
              <div className="flex flex-col">
                <FormLabel error={!!fieldState.error} id="periodicity">Как часто пациент получал препарат Лундбек?</FormLabel>
                <RadioGroup name="periodicity">
                  <FormControlLabel {...field} value="ежедневно" control={<Radio style={{ padding: 0, paddingLeft: "8px", paddingRight: "8px" }} checked={field.value === "ежедневно"} />} label="ежедневно" />
                  <FormControlLabel {...field} value="еженедельно" control={<Radio style={{ padding: 0, paddingLeft: "8px", paddingRight: "8px" }} checked={field.value === "еженедельно"} />} label="еженедельно" />
                  <FormControlLabel {...field} value="раз в месяц" control={<Radio style={{ padding: 0, paddingLeft: "8px", paddingRight: "8px" }} checked={field.value === "раз в месяц"} />} label="раз в месяц" />
                  <FormControlLabel {...field} value="раз в 3 месяца" control={<Radio style={{ padding: 0, paddingLeft: "8px", paddingRight: "8px" }} checked={field.value === "раз в 3 месяца"} />} label="раз в 3 месяца" />
                  <FormControlLabel {...field} value="другое (пожалуйста, укажите)" control={<Radio style={{ padding: 0, paddingLeft: "8px", paddingRight: "8px" }} checked={field.value === "другое (пожалуйста, укажите)"} />} label="другое (пожалуйста, укажите)" />
                </RadioGroup>
                {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>}
              </div>
            )}
          />

          {values[index].periodicity === "другое (пожалуйста, укажите)" && <Controller
            name={`drugItems.${index}.customPeriodicity`}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="string"
                className=""
                fullWidth
                label="Опишите, как часто принимался препарат Лундбек"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />}

          <Controller
            name={`drugItems.${index}.dose`}
            control={control}
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                type="string"
                className=""
                fullWidth
                label="Доза (пожалуйста, по возможности укажите единицы измерения)"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />


          <Controller
            name={`drugItems.${index}.startDate`}
            control={control}
            render={({ field }) => (
              <>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                  <DatePicker
                    {...field}
                    className="w-full"
                    label="Когда был начат прием препарата?"
                    onChange={(date) => field.onChange(date)} // обязательно для работы react-hook-form
                  />
                </LocalizationProvider>
              </>
            )}
          />

          <Controller
            name={`drugItems.${index}.isContinuePurpose`}
            control={control}
            render={({ field, fieldState }) => (
              <div className="">
                <FormLabel error={!!fieldState.error} id="periodicity">Продолжается ли прием препарата на текущий момент?</FormLabel>
                <RadioGroup name="periodicity">
                  <FormControlLabel {...field} value="Да" control={<Radio style={{ padding: 0, paddingLeft: "8px", paddingRight: "8px" }} checked={field.value === "Да"} />} label="Да" />
                  <FormControlLabel {...field} value="Нет" control={<Radio style={{ padding: 0, paddingLeft: "8px", paddingRight: "8px" }} checked={field.value === "Нет"} />} label="Нет" />
                </RadioGroup>
                {fieldState.error && <p className="text-[#d32f2f]">{fieldState.error.message}</p>}
              </div>
            )}
          />

          {values[index].isContinuePurpose === "Нет" && <Controller
            name={`drugItems.${index}.endDate`}
            control={control}
            render={({ field }) => (
              <>
                <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ru}>
                  <DatePicker
                    {...field}
                    className="w-full"
                    label="Когда был прекращен прием препарата?"
                    onChange={(date) => field.onChange(date)} // обязательно для работы react-hook-form
                  />
                </LocalizationProvider>
              </>
            )}
          />}

          {index !== 0 && ( // Кнопка удаления недоступна для первого элемента
            <div className="">
              <Button
                variant="outlined"
                color="error"
                onClick={() => remove(index)}
                style={{ marginTop: "10px" }}
              >
                Удалить
              </Button>
            </div>
          )}
        </div>


      </Box>))}


      <Button
        variant="contained"
        color="primary"
        onClick={() => append({ drugName: "", drugNumber: "", purposeDrug: "", periodicity: "", dose: "", customPeriodicity: "", startDate: null, isContinuePurpose: "", endDate: null })}
        style={{ marginTop: "20px" }}
      >
        Добавить препарат
      </Button>
    </Box>
  );
};
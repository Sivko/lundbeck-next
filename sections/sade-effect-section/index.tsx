"use client";

import React, { useState } from "react";
import Header from "@/components/header";
import { useForm, FormProvider } from "react-hook-form";
import { Box, Button } from "@mui/material";
import { Step1 } from "@/components/steps/Step1";
import { Step2 } from "@/components/steps/Step2";
import { Step3 } from "@/components/steps/Step3";
import { Step4 } from "@/components/steps/Step4";
import { Step5 } from "@/components/steps/Step5";
import { Step6 } from "@/components/steps/Step6";

import dataToMessage, { DataToSend } from "@/lib/message-form-1";
import SuccessMsg from "@/components/result-message/SuccessMsg";
import ErrorSend from "@/components/result-message/ErrorSend";

const sadeEffectSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [statusResponse, setStatusResponse] = useState<null | boolean>(null);
  const [isLoading, setIsLoading] = useState(false)

  const methods = useForm<FormData>({
    defaultValues: {},
  });

  const steps = 6;

  const handleNext = async () => {
    const isValid = await methods.trigger();
    if (isValid) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const allValues = methods.watch();


  const handleBack = () => setActiveStep((prev) => prev - 1);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    const dataJson = JSON.stringify(data);
    const object = JSON.parse(dataJson) as DataToSend;
    console.log("Отправленные данные:", dataToMessage(object));
    await fetch('https://app.salesap.ru/web_forms/order', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'contact[general_phone]': object?.phone ?? "",
        'contact[email]': object?.email ?? "",
        'order[name]': 'Форма о побочных эффектах',
        'order[description]': dataToMessage(object),
        'source_id': '366321',
        'redirect_url': '',
        'token': '1df035e0bf0cf3cb2fc310aef52e5512',
        'responsible_id': '125378',
      }),
    }).then(response => { response.json(); setStatusResponse(true); setIsLoading(false) })
      .catch(() => { setStatusResponse(false); setIsLoading(false) });
    // setResponse(res)
  };

  if (statusResponse === true) return <SuccessMsg />
  if (statusResponse === false) return <ErrorSend />

  return (
    <div className="container mx-auto py-10">
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Header activeStep={activeStep} steps={steps} />
          <Box my={4}>
            {activeStep === 0 && <Step1 />}
            {activeStep === 1 && <Step2 />}
            {activeStep === 2 && <Step3 />}
            {activeStep === 3 && <Step4 />}
            {activeStep === 4 && <Step5 />}
            {activeStep === 5 && <Step6 />}
          </Box>
          <Box display="flex" justifyContent="space-between">
            <div>
              {activeStep > 0 && (
                <Button variant="outlined" onClick={handleBack}>
                  Назад
                </Button>
              )}
            </div>
            {activeStep < steps - 1 && (
              <Button variant="contained" onClick={handleNext}>
                Далее
              </Button>
            )}
            {activeStep === steps - 1 && (
              <Button type={isLoading ? "button" : "submit"} disabled={isLoading} variant="contained" color="primary">
                {isLoading ? "Отправка..." : "Отправить"}
              </Button>
            )}
          </Box>
        </form>
      </FormProvider>

      <pre>
        <div className="text-red-200">{JSON.stringify(methods.formState.errors, null, 2)}</div>
        {JSON.stringify(allValues, null, 2)}
      </pre>
    </div>
  );
};

export default sadeEffectSection;
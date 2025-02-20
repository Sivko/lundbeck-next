import {
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";



export default function Header({ activeStep, steps }: { activeStep: number,steps:number }) {
  return (
    <Stepper activeStep={activeStep}>
      {Array.from({ length: steps }).map((_, index) => (
        <Step key={index}>
          <StepLabel />
        </Step>
      ))}
    </Stepper>
  )
}
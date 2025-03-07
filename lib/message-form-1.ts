export interface DataToSend {
  isCommunication: string;
  contactMethod: "email" | "phone";
  phone: string;
  email: string;
  isPatient: string;
  agent: string;
  country: {
    label: string;
    value: string;
  };
  isLundbeckDrugPurchase: string;
  sideEffectCountry: object;
  gender: string;
  isPregnant: string;
  dateOfBirth: string | null;
  weekOfBirth: number | null;
  description: string;
  age: number | string;
  drugItems?: {
    drugName: {
      label: string;
      value: string;
    };
    drugNumber: string;
    purposeDrug: string;
    periodicity: string;
    dose: string;
    customPeriodicity: string;
    startDate: string | null;
    isContinuePurpose: string;
    endDate: string | null;
  }[];
  sideEffects?: {
    sideEffectDescription: string;
    sideEffectStartDate: string | null;
    sideEffectStatus: string;
    sideEffectEndDate: string | null;
  }[];
  consequences: Record<string, boolean>;
  ateMedicine: string;
  anyDrugs?: {
    name: string;
    reason: string;
    dose: string;
    dateStart: string | null;
    isContinue: string;
    additionalDrugs: string;
    dateEnd: string | null;
  }[];
  disease: string;
  diseasesItems?: {
    name: string;
    dateStart: string | null;
    status: string;
    isTreatment: string;
    treatmentDescription: string;
  }[];
}

export default function generateEmailContent(data: DataToSend): string {
  const drugItemsContent = data?.drugItems
    ?.map(
      (item, index) => `
    Препарат ${index + 1}: <br />
      - Название: ${item.drugName ? JSON.stringify(item.drugName) : "не указано"} <br />
      - Номер: ${item.drugNumber || "не указано"} <br />
      - Показание: ${item.purposeDrug || "не указано"} <br />
      - Периодичность: ${item.periodicity} (${item.customPeriodicity || "не указано"}) <br />
      - Дозировка: ${item.dose || "не указано"} <br />
      - Начало приема: ${item.startDate || "не указано"} <br />
      - Продолжается ли прием: ${item.isContinuePurpose || "не указано"} <br />
      - Дата окончания: ${item.endDate || "не указано"} <br />`
    )
    .join("<br />");

  const sideEffectsContent = data?.sideEffects
    ?.map(
      (effect, index) => `
    Побочный эффект ${index + 1}: <br />
      - Описание: ${effect.sideEffectDescription || "не указано"} <br />
      - Дата начала: ${effect.sideEffectStartDate || "не указано"} <br />
      - Статус: ${effect.sideEffectStatus || "не указано"} <br />
      - Дата окончания: ${effect.sideEffectEndDate || "не указано"} <br />`
    )
    .join("<br />");

  const anyDrugsContent = data?.anyDrugs
    ?.map(
      (drug, index) => `
    Другой препарат ${index + 1}: <br />
      - Название: ${drug.name || "не указано"} <br />
      - Показание: ${drug.reason || "не указано"} <br />
      - Доза: ${drug.dose || "не указано"} <br />
      - Начало приема: ${drug.dateStart || "не указано"} <br />
      - Продолжается ли прием: ${drug.isContinue || "не указано"} <br />
      - Дополнительные препараты: ${drug.additionalDrugs || "не указано"} <br />
      - Дата окончания: ${drug.dateEnd || "не указано"} <br />` 
    )
    .join("\n");

  const diseasesContent = data?.diseasesItems
    ?.map(
      (disease, index) => `
    Заболевание ${index + 1}: <br />
      - Название: ${disease.name || "не указано"} <br /> 
      - Дата начала: ${disease.dateStart || "не указано" }<br />
      - Статус: ${disease.status || "не указано"} <br />
      - Проводилось лечение: ${disease.isTreatment || "не указано"} <br />
      - Описание лечения: ${disease.treatmentDescription || "не указано"} <br />`
    )
    .join("<br />");

  return `
  Данные формы: <br />
    - Согласие на связь: ${data.isCommunication || "не указано"} <br />
    - Способ связи: ${data.contactMethod || "не указано"} <br />
    - Телефон: ${data.phone || "не указано"} <br />
    - Email: ${data.email || "не указано"} <br />
    - Является пациентом: ${data.isPatient || "не указано"} <br />
    - Связь с пациентом: ${data.agent || "не указано"} <br />
    - Страна: ${data.country?.value} <br />
    - Препарат Лундбек приобретен в той же стране: ${data.isLundbeckDrugPurchase || "не указано"} <br />
    - Страна возникновения побочного эффекта: ${data.sideEffectCountry ? JSON.stringify(data.sideEffectCountry) : "не указано"} <br />
    - Пол: ${data.gender || "не указано"} <br />
    - Беременность: ${data.isPregnant || "не указано"} <br />
    - Дата родов: ${data.dateOfBirth || "не указано"} <br />
    - Неделя родов: ${data.weekOfBirth || "не указано"} <br />
    - Возраст: ${data.age || "не указано"} <br />
    - Описание беременности: ${data.description || "не указано"} <br />
    - Принимал другие препараты: ${data.ateMedicine || "не указано"} <br />
    - Хотите сообщить о других заболеваниях: ${data.disease || "не указано"} <br />

  Препараты: <br /><br />
  ${drugItemsContent ?? "Нет"}  <br /><br /> 

  Побочные эффекты: <br /><br /> 
  ${sideEffectsContent ?? "Нет"}  <br /><br /> 

  Другие препараты: <br /><br />
  ${anyDrugsContent ?? "Нет"}  <br /><br /> 

  Заболевания:<br /><br />
  ${diseasesContent ?? "Нет"}  <br /><br /> 
  `;
}
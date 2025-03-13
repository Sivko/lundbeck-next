import { IContactsResCreateCRM, IContactsFormData, IContactsUploadResponse } from "@/types/contacts-types";

export async function POST(req: Request) {
  const formData = await req.formData();

  const data: IContactsFormData = {
    firstName: formData.get("firstName") as string,
    companyName: formData.get("companyName") as string | undefined,
    email: formData.get("email") as string,
    phone: formData.get("phone") as string | undefined,
    message: formData.get("message") as string,
    file: formData.getAll("file") as unknown as FileList | undefined,
  };


  const responseCreateContact = await fetch('https://app.salesap.ru/api/v1/contacts', {
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${process.env.API_CRM}`,
    },
    method: 'POST',
    body: JSON.stringify({
      "data": {
        "type": "contacts",
        "attributes": {
          "first-name": data?.firstName || "Неизвестно",
          "email": data?.email || "",
          "general-phone": data?.phone || "",
        }
      }
    })
  }).then(response => response.json() as unknown as IContactsResCreateCRM)

  // console.log("responseCreateContact", responseCreateContact)

  const responseCreateOrder = await fetch('https://app.salesap.ru/api/v1/orders', {
    headers: {
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${process.env.API_CRM}`,
    },
    method: 'POST',
    body: JSON.stringify({
      "data": {
        "type": "orders",
        "attributes": {
          "name": "Форма обратной связи",
          "description": data.companyName + " " + data.message,
          "customs": {
            "custom-132762": data.companyName + " " + data.message,
          }
        },
        "relationships": {
          "contact": {
            "data": {
              "type": "contacts",
              "id": responseCreateContact.data.id
            }
          }

        }
      }
    })
  }).then(response => response.json() as unknown as IContactsResCreateCRM)

  if (data.file?.[0].size) {
    const json = {
      "type": "files",
      "data": {
        "filename": data.file?.[0].name,
        "resource-type": "orders",
        "resource-id": Number(responseCreateOrder.data.id),
      }
    }
    const res = await fetch('https://upload.app.salesap.ru/api/v1/files', {
      headers: {
        'Content-Type': 'application/vnd.api+json',
        Authorization: `Bearer ${process.env.API_CRM}`,
      },
      method: 'POST',
      body: JSON.stringify(json) as unknown as string
    }).then(response => response.json() as unknown as IContactsUploadResponse)

    const formDataToAWS = new FormData();

    for (const [key, value] of Object.entries(res.data["form-fields"])) {
      formDataToAWS.append(key, value);
      console.log(key, value)
    }

    formDataToAWS.append("file", data.file?.[0], data.file?.[0].name);

    await fetch(`https://storage.yandexcloud.net/salesapiens`, {
      method: "POST",
      body: formDataToAWS
    })

  }


  return Response.json({ data, file: data.file?.[0].name });
}
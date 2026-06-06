"use server";

export async function submitInquiry(formData: FormData) {
  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    message: formData.get("message"),
    property: formData.get("property"),
  };
  console.log("[Inquiry]", payload);
  return { success: true };
}

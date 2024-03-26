const IP = "64.23.166.132:8005";
export const sendQuery = async (queryObject) => {
  const formData = new FormData();
  formData.append("query", queryObject?.query);
  formData.append("chatbot_id", queryObject?.agentId);
  formData.append("vertical", queryObject?.agentRole);
  formData.append("user_id", queryObject?.userId);
  formData.append("user_chatid", queryObject?.chatUniqueId);
  try {
    const response = await fetch(`http://${IP}/chat`, {
      method: "POST",
      headers: {
        // authorization: import.meta.env.VITE_CHAT_API_AUTHORIZATION_TOKEN,
        authorization:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjVlNTgyNmQ3M2ZkODQ0YTQ1MmM1MDgwIiwiaWF0IjoxNzEwNzQ0MzY4LCJleHAiOjE3MTEwMDM1Njh9.Ot6KCMrHMRJTix2U7kVAwyE4BDOWiFyhWIOQI-wDn7I",
      },
      body: formData,
      redirect: "follow",
    });

    const result = await response.json();
    console.log(result);
    if (result?.status === 200) {
      return result?.Message;
    } else throw new Error(result?.Message);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const generateUUID = () => {
  return Math.random().toString(36).substring(2, 15);
};

export const getSpeed = (type) => {
  console.log(type);
  if (type === "Slow") {
    return 400;
  }
  if (type === "Medium") {
    return 300;
  }
  if (type === "Fast") {
    return 150;
  }
  return 150;
};
